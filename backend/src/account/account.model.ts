import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase-admin/firestore';
import { BaseModel, IBaseModel } from '../common';
import { IUrl, QrCode, Url } from '../url/url.model';

export interface IAccount extends IBaseModel {
  username: string;
  password: string;
  urls?: IUrl[];
}

export class Account extends BaseModel implements IAccount {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  public username: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  @Length(8)
  public password: string;

  public urls?: IUrl[];

  constructor(
    username: string,
    password: string,
    urls: IUrl[],
    isDeleted: boolean,
    createdAt: Date | Timestamp,
  ) {
    super(createdAt, isDeleted);
    this.username = username;
    this.password = password;
    this.urls = urls;
  }
}

export const AccountConverter = {
  toFirestore(account: IAccount): DocumentData {
    return {
      username: account.username,
      password: account.password,
      urls: account.urls || [],
      isDeleted: account.isDeleted || false,
      createdAt: new Date(),
    };
  },

  fromFirestore(snapshot: QueryDocumentSnapshot<IAccount>): IAccount {
    const data = snapshot.data();

    return new Account(
      data.username,
      data.password,
      data.urls.map(
        (meta) =>
          new Url(
            meta.url,
            meta.title,
            new QrCode(meta.qrCode.fgColor, meta.qrCode.isCreated),
            meta.redirectHash,
            meta.isDeleted,
            (meta.createdAt as Timestamp).toDate(),
          ),
      ),
      data.isDeleted,
      (data.createdAt as Timestamp).toDate(),
    );
  },
};
