import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { WorkspaceService } from '../workspace/workspace.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserDocument } from '../users/schemas/user.schema';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private workspaceService: WorkspaceService,
  ) {}

async register(dto: RegisterDto) {
  try {
    let workspace;

    if (dto.inviteCode) {
      // Davet kodu ile workspace'e katılım
      workspace = await this.workspaceService.findByInviteCode(dto.inviteCode);
      if (!workspace) {
        throw new BadRequestException('Geçersiz davet kodu.');
      }
    } else {
      // Yeni workspace oluşturulacaksa, companyName zorunlu
      if (!dto.companyName) {
        throw new BadRequestException('Şirket ismi gerekli.');
      }

      const inviteCode = uuidv4();
      workspace = await this.workspaceService.create({
        name: dto.companyName,
        inviteCode,
        ownerId: 'temporary-owner-id', // Buraya kayıt olan kullanıcı ID'si gelmeli
      });
    }

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Bu email adresi zaten kullanılıyor.');
    }

    const role = dto.inviteCode ? 'Member' : 'SuperAdmin';

    const userData: CreateUserDto = {
      name: dto.name,
      lastname: dto.lastname,
      email: dto.email,
      phone: dto.phone,
      password: dto.password,
      workspace:
        workspace._id instanceof Types.ObjectId
          ? workspace._id.toString()
          : String(workspace._id),
      role,
      inviteCode: dto.inviteCode,
      companyName: dto.companyName,
    };

    const user = await this.usersService.create(userData);

    // Burada workspace oluşturma sırasında ownerId eksikti, bu yüzden ownerId'yi update edelim
    if (!workspace.ownerId) {
      workspace.ownerId = user._id.toString();
      await workspace.save();
    }

    if (workspace && user) {
      const workspaceId =
        workspace._id instanceof Types.ObjectId
          ? workspace._id.toString()
          : String(workspace._id);
      const userId =
        user._id instanceof Types.ObjectId ? user._id.toString() : String(user._id);

      await this.workspaceService.addMember(workspaceId, userId);
    }

    // Token oluştur
    const tokenData = this._signToken(user, '1d');

    return {
      message: 'Kullanıcı başarıyla oluşturuldu',
      ...tokenData, // access_token ve user bilgisi
      workspace,
    };
  } catch (error) {
    // hata işlemleri aynı...
  }
}


  async login(dtoOrUser: LoginDto | any, direct = false) {
    try {
      let user;

      if (!direct) {
        const dto = dtoOrUser as LoginDto;

        // Email veya telefon ile kullanıcı ara
        if (dto.email) {
          user = await this.usersService.findByEmail(dto.email);
        } else if (dto.phone) {
          user = await this.usersService.findByPhone(dto.phone);
        } else {
          throw new BadRequestException('Email veya telefon numarası gerekli.');
        }

        if (!user) {
          throw new UnauthorizedException('Kullanıcı bulunamadı.');
        }

        if (!user.password) {
          throw new UnauthorizedException('Bu hesap için şifre ayarlanmamış.');
        }

        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
          throw new UnauthorizedException('Şifre hatalı.');
        }

        const expiresIn = dto.rememberMe ? '7d' : '1d';
        return this._signToken(user, expiresIn);
      } else {
        return this._signToken(dtoOrUser, '1d');
      }
    } catch (error) {
      console.error('Login error:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new BadRequestException(
        'Giriş işlemi sırasında bir hata oluştu: ' + error.message,
      );
    }
  }

  async validateOAuthLogin(email: string, name: string) {
    try {
      let user = await this.usersService.findByEmail(email);

      if (!user) {
        // OAuth kullanıcısı için varsayılan workspace oluştur
        const inviteCode = uuidv4();
        const workspace = await this.workspaceService.create({
          name: `${name}'s Workspace`,
          inviteCode,
        });

        const userData: CreateUserDto = {
          name,
          email,
          phone: '', // OAuth'ta telefon olmayabilir
          password: '', // OAuth'ta şifre yok
          provider: 'google',
          workspace: (workspace._id as any).toString(),
          role: 'SuperAdmin',
        };

        user = await this.usersService.create(userData);

        await this.workspaceService.addMember(
          (workspace._id as any).toString(),
          (user._id as any).toString(),
        );
      }

      return this._signToken(user, '7d');
    } catch (error) {
      console.error('OAuth validation error:', error);
      throw new BadRequestException(
        'OAuth doğrulama sırasında bir hata oluştu: ' + error.message,
      );
    }
  }

private _signToken(user: UserDocument, expiresIn: string) {
    try {
      const payload = {
        sub: (user._id as any).toString(),
        email: user.email,
        role: user.role,
      };

      const access_token = this.jwtService.sign(payload, { expiresIn });

      // Refresh token için genelde daha uzun süre verilir (örn. 7 gün)
      const refresh_token = this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_key',
        expiresIn: '7d',
      });

      return {
        access_token,
        refresh_token,
        user: {
          id: (user._id as any).toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          workspace: user.workspace,
        },
      };
    } catch (error) {
      console.error('Token signing error:', error);
      throw new BadRequestException('Token oluşturma sırasında bir hata oluştu.');
    }
  }
}
