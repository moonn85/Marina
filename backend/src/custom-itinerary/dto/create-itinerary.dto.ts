import { IsString, IsArray, IsNumber, IsOptional, IsDateString, IsIn } from 'class-validator';

export class CreateItineraryDto {
  @IsString()
  tripName: string;

  @IsArray()
  @IsString({ each: true })
  cities: string[];

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsNumber()
  adults: number;

  @IsNumber()
  children: number;

  @IsString()
  @IsIn(['vi', 'en', 'ko', 'zh', 'ru', 'hi'])
  lang: string;
}
