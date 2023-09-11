import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResponsavelModule } from './responsavel/responsavel.module';
import { PrismaService } from './prisma/prisma.service';
import { ProfessorModule } from './professor/professor.module';
import { TurmaModule } from './turma/turma.module';
import { AlunoModule } from './aluno/aluno.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guards';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  imports: [
    ResponsavelModule,
    ProfessorModule,
    TurmaModule,
    AlunoModule,
    AuthModule,
  ],
})
export class AppModule {}
