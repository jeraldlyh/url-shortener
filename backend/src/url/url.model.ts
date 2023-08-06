import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { BaseModel, IBaseModel } from '../common';

export interface IUrl extends IBaseModel {
  url: string;
  title?: string;
  qrCode: IQrCode;
  redirectHash: string;
  isDeleted: boolean;
}

interface IQrCode {
  fgColor?: string;
  isCreated: boolean;
}

export class QrCode implements IQrCode {
  @IsString()
  @IsOptional()
  public fgColor: string;

  @IsBoolean()
  public isCreated: boolean;

  constructor(fgColor: string, isCreated: boolean) {
    this.fgColor = fgColor;
    this.isCreated = isCreated;
  }
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

  @ValidateNested()
  @Type(() => QrCode)
  public qrCode: IQrCode;

  public redirectHash: string;

  constructor(
    url: string,
    title: string,
    qrCode: IQrCode,
    redirectHash: string,
    isDeleted: boolean,
    createdAt: Date,
  ) {
    super(createdAt, isDeleted);
    this.url = url;
    this.title = title;
    this.qrCode = qrCode;
    this.redirectHash = redirectHash;
  }
}
