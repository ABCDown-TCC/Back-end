import { Module } from '@nestjs/common';
import { RedefinicaoSenhaService } from './redefinicao-senha.service';
import { RedefinicaoSenhaController } from './redefinicao-senha.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [RedefinicaoSenhaController],
  providers: [RedefinicaoSenhaService, PrismaService, JwtService],
})
export class RedefinicaoSenhaModule {}
