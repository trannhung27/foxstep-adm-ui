export interface IUserCreated {
  id?: number;
  name?: string;
  email?: string;
}

export const defaultValue: Readonly<IUserCreated> = {};
