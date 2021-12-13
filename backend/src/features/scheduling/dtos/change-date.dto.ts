import { IsDateString, IsNotEmpty } from 'class-validator';

export class SetDateDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
