import { Request } from 'express';
import { Professor } from 'src/professor/entities/professor.entity';

export class AuthRequest extends Request {
  user: Professor;
}
