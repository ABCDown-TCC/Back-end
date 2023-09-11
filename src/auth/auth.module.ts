import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { ProfessorModule } from 'src/professor/professor.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ResponsavelModule } from 'src/responsavel/responsavel.module';

@Module({
  imports: [
    ProfessorModule,
    ResponsavelModule,
    JwtModule.register({
      secret: process.env.DATABASE_URL,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
