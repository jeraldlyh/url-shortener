import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { BaseModel } from '../common';

export interface IUrl {
  url: string;
  title?: string;
  qrFgColor?: string;
}

export class Url extends BaseModel implements IUrl {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  public url: string;

  @IsString()
  @IsOptional()
  public title?: string;

  @IsString()
  @IsOptional()
  public qrFgColor?: string;

  constructor(url: string, title: string, qrFgColor: string, createdAt: Date) {
    super(createdAt);
    this.url = url;
    this.title = title;
    this.qrFgColor = qrFgColor;
  }
}
