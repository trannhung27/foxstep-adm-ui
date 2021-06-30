import { ISport } from 'app/shared/model/sport.model';
import { IChallengeValidity } from './challengeValidity,model';
import { IChallengeDistance } from './challengeDistance.model';
import { ITeam } from './team.model';
export interface IChallenge {
  id?: number;
  title?: string | null;
  cal_type?: number | null;
  object_type?: number | null;
  content?: string | null;
  status?: number | null;
  img_url?: string | null;
  price?: number | null;
  date_regis?: string | null;
  date_regis_dead_line?: string | null;
  date_start?: string | null;
  date_finish?: string | null;
  num_of_participant?: number | null;
  num_of_regis?: number | null;
  user_id_created?: number | null;
  challenge_type?: number | null;
  sport?: ISport;
  challenge_validity?: IChallengeValidity;
}

export const defaultValue: Readonly<IChallenge> = {};
