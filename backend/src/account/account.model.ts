import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';

export class Account {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  public username: string;

  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  @Length(8)
  public password: string;

  public createdAt: Date;

  constructor(username: string, password: string, createdAt: Date) {
    this.username = username;
    this.password = password;
    this.createdAt = createdAt;
  }
}

export const AccountConverter = {
  toFirestore(account: Account): DocumentData {
    return {
      username: account.username,
      password: account.password,
      createdAt: new Date(),
    };
  },

  fromFirestore(snapshot: QueryDocumentSnapshot): Account {
    const data = snapshot.data();

    return new Account(data.username, data.password, data.createdAt);
  },
};
