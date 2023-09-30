import { PartialType } from '@nestjs/mapped-types';
import { SignAuthDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(SignAuthDto) {}
