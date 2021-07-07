export interface IAuthority {
  id?: number;
  code?: string;
  name?: string;
  status?: number;
}

export const defaultValue: Readonly<IAuthority> = {};
