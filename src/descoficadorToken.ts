import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

interface User {
  id: string;
  email: string;
}

@Injectable()
@Injectable()
export class Decodificadora {
  private readonly secretKey = process.env.SECRET_KEY;

  async decodificadorToken(token: string): Promise<string | null> {
    try {
      const [bearer, codigo] = token.split('');

      if (bearer !== 'Bearer' || !codigo) {
        throw new Error('Token inválido');
      }

      const decoded = (await jwt.verify(codigo, this.secretKey)) as User;

      const { id } = decoded;
      return id;
    } catch (error) {
      // Trate o erro e forneça uma mensagem de erro significativa
      console.error('Erro ao decodificar o token:', error.message);
      return null;
    }
  }
}
