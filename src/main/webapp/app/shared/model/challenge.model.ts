import { ISport } from 'app/shared/model/sport.model';
import { IChallengeValidity } from './challengeValidity,model';
import { IChallengeDistance } from './challengeDistance.model';
import { ITeam } from './team.model';
export interface IChallenge {
  id?: number;
  title?: string | null;
  calType?: number | null;
  objectType?: number | null;
  content?: string | null;
  status?: number | null;
  imgUrl?: string | null;
  price?: number | null;
  dateRegisDeadline?: string | null;
  dateStart?: string | null;
  dateFinish?: string | null;
  numOfParticipant?: number | null;
  numOfRegis?: number | null;
  userIdCreated?: number | null;
  challengeType?: number | null;
  sport?: ISport;
  challengeValidity?: IChallengeValidity | null;
  challengeDistance?: IChallengeDistance[] | [];
  teams?: ITeam[] | [];
}

export const defaultValue: Readonly<IChallenge> = {};
