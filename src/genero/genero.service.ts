import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GeneroService {
  constructor(private prisma: PrismaService) {}

  async findGenero() {
    const query = 'select * from tbl_genero';
    const result = await this.prisma.$queryRawUnsafe(query);
    return result;
  }
}
