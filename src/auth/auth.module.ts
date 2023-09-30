import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ProfessorModule } from 'src/professor/professor.module';
import { JwtModule } from '@nestjs/jwt';
import { ResponsavelModule } from 'src/responsavel/responsavel.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ProfessorModule,
    ResponsavelModule,
    JwtModule.register({
      secret: process.env.DATABASE_URL,
      signOptions: { expiresIn: '2d' },
    }),
  ],
})
export class AuthModule {}
