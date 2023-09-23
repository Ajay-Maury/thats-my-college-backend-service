export interface ICreatedInfo {
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
  isDeleted: boolean;
}

export interface IUpdatedInfo {
  updatedOn: string;
  updatedBy: string;
}

export interface IDeletedInfo {
  deletedOn: string;
  isDeleted: boolean;
  deletedBy: string;
}
