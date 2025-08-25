import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { User } from './users/user.entity';
import { Role } from './roles/role.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(String(process.env.DB_PORT), 10) || 5433,
      username: process.env.DB_USERNAME || 'project_user',
      password: process.env.DB_PASSWORD || 'project_password',
      database: process.env.DB_NAME || 'project_db',
      entities: [User, Role],
      synchronize: true,
      logging: true,
    }),
    UsersModule,
    RolesModule,
  ],
})
export class AppModule {}
