import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResponsavelModule } from './responsavel/responsavel.module';
import { PrismaService } from './prisma/prisma.service';
import { ProfessorModule } from './professor/professor.module';

@Module({
  controllers: [AppController],
  providers: [AppService, PrismaService],
  imports: [ResponsavelModule, ProfessorModule],
})
export class AppModule {}
