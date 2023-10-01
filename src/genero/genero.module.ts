import { Module } from '@nestjs/common';
import { GeneroService } from './genero.service';
import { GeneroController } from './genero.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [GeneroController],
  providers: [GeneroService, PrismaService],
})
export class GeneroModule {}
