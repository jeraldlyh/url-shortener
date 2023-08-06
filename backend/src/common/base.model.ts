import { Timestamp } from 'firebase-admin/firestore';

export interface IBaseModel {
  createdAt: Date | Timestamp;
  isDeleted: boolean;
}

export class BaseModel implements IBaseModel {
  public createdAt: Date | Timestamp;
  public isDeleted: boolean;

  constructor(createdAt: Date | Timestamp, isDeleted: boolean) {
    this.createdAt = createdAt;
    this.isDeleted = isDeleted;
  }
}
