import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { CalendarModule } from './calendar/calendar.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProjectsModule } from './projects/projects.module';
import { RolesModule } from './roles/roles.module';
import { TasksModule } from './tasks/tasks.module';
import { TimeTrackingModule } from './time-tracking/time-tracking.module';
import { UsersModule } from './users/users.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI ||
        'mongodb+srv://tastanyigitumre:AqdWdNFUt4yJnEnl@x24-api.ehv8ibp.mongodb.net/?retryWrites=true&w=majority&appName=X24-Api',
    ),
    AnalyticsModule,
    AuthModule,
    CalendarModule,
    DashboardModule,
    MessagesModule,
    NotificationsModule,
    ProjectsModule,
    RolesModule,
    TasksModule,
    TimeTrackingModule,
    UsersModule,
    WorkspaceModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
