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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private workspaceService: WorkspaceService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      let workspace;

      if (dto.inviteCode) {
        workspace = await this.workspaceService.findByInviteCode(dto.inviteCode);
        if (!workspace) {
          throw new BadRequestException('Geçersiz davet kodu.');
        }
      } else {
        if (!dto.companyName) {
          throw new BadRequestException('Şirket ismi gerekli.');
        }

        const inviteCode = uuidv4();
        workspace = await this.workspaceService.create({
          name: dto.companyName,
          inviteCode,
          ownerId: 'temporary-owner-id',
        });
      }

      const existingUser = await this.usersService.findByEmail(dto.email);
      if (existingUser) {
        throw new BadRequestException('Bu email adresi zaten kullanılıyor.');
      }

      const role = dto.inviteCode ? 'Member' : 'SuperAdmin';
      const hashedPassword = await bcrypt.hash(dto.password, 12);

      const userData: CreateUserDto = {
        name: dto.name,
        lastname: dto.lastname,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        workspace: workspace._id.toString(),
        role,
        inviteCode: dto.inviteCode,
        companyName: dto.companyName,
      };

      const user = await this.usersService.create(userData);

      if (!workspace.ownerId || workspace.ownerId === 'temporary-owner-id') {
        workspace.ownerId = user._id.toString();
        await workspace.save();
      }

      await this.workspaceService.addMember(workspace._id.toString(), user._id.toString());

      const tokenData = this._signToken(user, '1d');

      return {
        message: 'Kullanıcı başarıyla oluşturuldu',
        ...tokenData,
        workspace,
      };
    } catch (error) {
      throw new BadRequestException('Kayıt sırasında hata: ' + error.message);
    }
  }

  async login(dtoOrUser: LoginDto | any, direct = false) {
    try {
      let user;

      if (!direct) {
        const dto = dtoOrUser as LoginDto;

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
      throw new BadRequestException('Giriş işlemi sırasında hata: ' + error.message);
    }
  }

  async validateOAuthLogin(email: string, name: string) {
    try {
      let user = await this.usersService.findByEmail(email);

      if (!user) {
        const inviteCode = uuidv4();
        const workspace = await this.workspaceService.create({
          name: `${name}'s Workspace`,
          inviteCode,
          ownerId: 'temporary-owner-id',
        });

        const userData: CreateUserDto = {
          name,
          lastname: '',
          email,
          phone: '',
          password: '',
          provider: 'google',
          workspace: workspace._id.toString(),
          role: 'SuperAdmin',
        };

        user = await this.usersService.create(userData);
        workspace.ownerId = user._id.toString();
        await workspace.save();

        await this.workspaceService.addMember(workspace._id.toString(), user._id.toString());
      }

      return this._signToken(user, '7d');
    } catch (error) {
      throw new BadRequestException('OAuth doğrulama hatası: ' + error.message);
    }
  }

  private _signToken(user: UserDocument, expiresIn: string) {
    try {
      const payload = {
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const access_token = this.jwtService.sign(payload, { expiresIn });
      const refresh_token = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh_secret_key',
        expiresIn: '7d',
      });

      return {
        access_token,
        refresh_token,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          lastname: user.lastname,
          role: user.role,
          workspace: user.workspace,
        },
      };
    } catch (error) {
      throw new BadRequestException('Token oluşturma hatası.');
    }
  }
}