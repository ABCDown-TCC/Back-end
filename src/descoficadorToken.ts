import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

interface User {
  id: string;
}

@Injectable()
export class Decodificadora {
  private readonly secretKey = process.env.SECRET_KEY;

  async decodificadorToken(token: string): Promise<string | null> {
    try {
      const [bearer, codigo] = token.split(' ');

      if (bearer !== 'Bearer' || !codigo) {
        throw new Error('Token inválido');
      }

      const decoded = jwt.verify(codigo, this.secretKey) as User;
      const { id } = decoded;
      return id;
    } catch (error) {
      // Aqui você pode lidar com erros de decodificação ou token inválido
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  }
}

