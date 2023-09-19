import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

interface user {
  id: string;
}

@Injectable()
export class Decodificadora {
  private readonly secretKey = process.env.DATABASE_URL;

  async decodificadorToken(token: string) {
    const [bearer, codigo] = token.split(' ');
    const decoded = (await jwt.verify(codigo, this.secretKey)) as user;
    const { id } = decoded;
    return id;
  }
}
