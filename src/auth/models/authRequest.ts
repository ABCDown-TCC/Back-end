import { Request } from 'express';
import { Professor } from 'src/professor/entities/professor.entity';

export interface AuthRequest extends Request {
  user: Professor;
}
