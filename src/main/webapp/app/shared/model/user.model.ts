import { USER_STATUS } from 'app/config/constants';

/*AdminUser model*/
export interface IUser {
  id?: any;
  login?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  status?: number;
  langKey?: string;
  authorities?: any[];
  createdBy?: string;
  createdDate?: Date | null;
  lastModifiedBy?: string;
  lastModifiedDate?: Date | null;
  password?: string;
}

export const defaultValue: Readonly<IUser> = {
  id: '',
  login: '',
  firstName: '',
  lastName: '',
  fullName: '',
  email: '',
  status: USER_STATUS.ACTIVATED,
  langKey: '',
  authorities: [],
  createdBy: '',
  createdDate: null,
  lastModifiedBy: '',
  lastModifiedDate: null,
  password: '',
};
