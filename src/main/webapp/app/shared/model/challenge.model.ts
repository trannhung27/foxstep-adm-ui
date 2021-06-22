export interface IChallenge {
  id?: number;
  title?: string | null;
  content?: string | null;
  img_url?: string | null;
  date_regis?: string | null;
  date_start?: string | null;
  date_finish?: string | null;
  num_of_participant?: number | null;
  num_of_regis?: number | null;
  user_id_created?: number | null;
}

export const defaultValue: Readonly<IChallenge> = {};
