import { Module } from '@nestjs/common';
import { ResponsavelService } from './responsavel.service';
import { ResponsavelController } from './responsavel.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [ResponsavelController],
  providers: [ResponsavelService, PrismaService],
  exports: [ResponsavelService],
})
export class ResponsavelModule {}
