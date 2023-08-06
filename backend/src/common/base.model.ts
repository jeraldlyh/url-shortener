export interface IBaseModel {
  createdAt: Date;
  isDeleted: boolean;
}

export class BaseModel implements IBaseModel {
  public createdAt: Date;
  public isDeleted: boolean;

  constructor(createdAt: Date, isDeleted: boolean) {
    this.createdAt = createdAt;
    this.isDeleted = isDeleted;
  }
}
