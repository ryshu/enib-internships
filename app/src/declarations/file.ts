import { IInternshipEntity } from './internship';

export declare interface IFileEntity {
  id?: number;

  name: string;
  type: string;
  path: string;

  internship?: IInternshipEntity;

  createdAt?: Date;
  updatedAt?: Date;
}

/** @interface FileOpts Interface of all availables filters for files list */
export interface FileOpts {
  /** @property {number} internshipId Filter files by internship */
  internshipId?: number;
}
