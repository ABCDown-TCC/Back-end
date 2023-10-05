import { Module } from '@nestjs/common';
import { RedefinicaoSenhaService } from './redefinicao-senha.service';
import { RedefinicaoSenhaController } from './redefinicao-senha.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ProfessorService } from 'src/professor/professor.service';

@Module({
  controllers: [RedefinicaoSenhaController],
  providers: [RedefinicaoSenhaService, PrismaService, JwtService, ProfessorService],
})
export class RedefinicaoSenhaModule {}
