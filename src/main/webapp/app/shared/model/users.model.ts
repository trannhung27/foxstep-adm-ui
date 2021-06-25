import dayjs from 'dayjs';
import { IUsersPosition } from 'app/shared/model/users-position.model';

export interface IUsers {
  id?: number;
  email?: string | null;
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  nickName?: string | null;
  nationalIdNumber?: string | null;
  mobilePhone?: string | null;
  gender?: number | null;
  birthday?: string | null;
  shirtSize?: number | null;
  height?: number | null;
  weight?: number | null;
  idProvince?: number | null;
  idDistrict?: number | null;
  idWard?: number | null;
  strAddress?: string | null;
  bib?: string | null;
  imageUrl?: string | null;
  status?: number | null;
  dateCreated?: string | null;
  dateUpdated?: string | null;
  userPosition?: IUsersPosition | null;
}

export const defaultValue: Readonly<IUsers> = {};
