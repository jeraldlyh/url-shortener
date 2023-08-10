import {
  instanceToPlain,
  Transform,
  TransformFnParams,
  Type,
} from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase-admin/firestore';
import { BaseModel, IBaseModel } from '../common';

export interface IUrl extends IBaseModel {
  url: string;
  title?: string;
  qrCode: IQrCode;
  redirectHash: string;
  isDeleted: boolean;
}

export interface IQrCode {
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

export class CreateQrCodeDto implements Pick<IUrl, 'redirectHash'> {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  redirectHash: string;

  @IsObject()
  @ValidateNested()
  @Type(() => QrCode)
  qrCode: IQrCode;

  constructor(redirectHash: string, qrCode: IQrCode) {
    this.redirectHash = redirectHash;
    this.qrCode = qrCode;
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
    createdAt: Date | Timestamp,
  ) {
    super(createdAt, isDeleted);
    this.url = url;
    this.title = title;
    this.qrCode = qrCode;
    this.redirectHash = redirectHash;
  }
}

export const UrlConverter = {
  toFirestore(data: IUrl): DocumentData {
    return {
      url: data.url,
      title: data.title,
      qrCode: instanceToPlain(data.qrCode),
      redirectHash: data.redirectHash,
      isDeleted: data.isDeleted,
      createdAt: data.createdAt,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<IUrl>): IUrl {
    const data = snapshot.data();

    return new Url(
      data.url,
      data.title,
      new QrCode(data.qrCode.fgColor, data.qrCode.isCreated),
      data.redirectHash,
      data.isDeleted,
      data.createdAt,
    );
  },
};
