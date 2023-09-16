import { Request } from 'express';
import { Professor } from 'src/professor/entities/professor.entity';
import { Responsavel } from 'src/responsavel/entities/responsavel.entity';

export interface AuthRequest extends Request {
  professor: Professor;
  responsavel: Responsavel;
}
