import { Controller, Get } from '@nestjs/common';
import { GeneroService } from './genero.service';

@Controller('genero')
export class GeneroController {
  constructor(private readonly generoService: GeneroService) {}

  @Get()
  async findAll() {
    return { generos: await this.generoService.findGenero() };
  }
}
