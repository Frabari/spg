import { IsDateString, IsNotEmpty } from 'class-validator';

export class ChangeDateDto {
  @IsDateString({})
  @IsNotEmpty()
  date: string;
}
