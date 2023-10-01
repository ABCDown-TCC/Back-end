import { Body, Controller, Post } from '@nestjs/common';
import { RedefinicaoSenhaService } from './redefinicao-senha.service';

@Controller('redefinicao-senha')
export class RedefinicaoSenhaController {
  constructor(private readonly redefinicaoSenha: RedefinicaoSenhaService) {}

  @Post('solicitar')
  async solicitarRedefinicaoSenha(
    @Body() body: { email: string },
  ): Promise<void> {
    const { email } = body;

    await this.redefinicaoSenha.enviarTokenPorEmail(email);
  }

  @Post('confirmar')
  async confirmarRedefinicaoSenha(
    @Body() body: { email: string; token: string; novaSenha: string },
  ): Promise<void> {
    const { email, token, novaSenha } = body;

    await this.redefinicaoSenha.redefinirSenha(email, token, novaSenha);
  }
}
