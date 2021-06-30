import { IUserTeam } from './userTeam.model';
export interface ITeam {
  id?: number;
  name?: string | null;
  user_teams?: IUserTeam[];
}

export const defaultValue: Readonly<ITeam> = {};
