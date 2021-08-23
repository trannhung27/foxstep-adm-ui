import { IUsers } from 'app/shared/model/users.model';
export interface ITeam {
  id?: number;
  name?: string | null;
  users?: IUsers[];
}

export const defaultValue: Readonly<ITeam> = {};
