import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { BaseModel } from '../common';
import { IUrl, QrCode, Url } from '../url/url.model';

interface IAccount {
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
    createdAt: Date,
  ) {
    super(createdAt, isDeleted);
    this.username = username;
    this.password = password;
    this.urls = urls;
  }
}

export const AccountConverter = {
  toFirestore(account: Account): DocumentData {
    return {
      username: account.username,
      password: account.password,
      urls: account.urls || [],
      isDeleted: account.isDeleted || false,
      createdAt: new Date(),
    };
  },

  fromFirestore(snapshot: QueryDocumentSnapshot): Account {
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
            meta.createdAt.toDate(),
          ),
      ),
      data.isDeleted,
      data.createdAt.toDate(),
    );
  },
};
