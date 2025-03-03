import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ErrorHandlingFilter } from './common/filters';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorHandlingFilter,
    },
  ],
})
export class AppModule {}
