import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResponsavelModule } from './responsavel/responsavel.module';
import { PrismaService } from './prisma/prisma.service';
import { ProfessorModule } from './professor/professor.module';
import { TurmaModule } from './turma/turma.module';
import { AlunoModule } from './aluno/aluno.module';

@Module({
  controllers: [AppController],
  providers: [AppService, PrismaService],
  imports: [ResponsavelModule, ProfessorModule, TurmaModule, AlunoModule],
})
export class AppModule {}
