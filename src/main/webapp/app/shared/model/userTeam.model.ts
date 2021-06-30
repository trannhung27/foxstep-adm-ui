export interface IUserTeam {
  status?: number | null;
  team_id?: number | null;
  user_id?: number | null;
}

export const defaultValue: Readonly<IUserTeam> = {};
