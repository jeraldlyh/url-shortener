export interface IBaseModel {
  createdAt: Date;
}

export class BaseModel implements IBaseModel {
  public createdAt: Date;

  constructor(createdAt: Date) {
    this.createdAt = createdAt;
  }
}
