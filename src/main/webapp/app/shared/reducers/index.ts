import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';

import administration, { AdministrationState } from 'app/modules/administration/administration.reducer';
import userManagement, { UserManagementState } from 'app/modules/administration/user-management/user-management.reducer';
import register, { RegisterState } from 'app/modules/account/register/register.reducer';
import activate, { ActivateState } from 'app/modules/account/activate/activate.reducer';
import password, { PasswordState } from 'app/modules/account/password/password.reducer';
import settings, { SettingsState } from 'app/modules/account/settings/settings.reducer';
import passwordReset, { PasswordResetState } from 'app/modules/account/password-reset/password-reset.reducer';

import users, { UsersState } from 'app/modules/users/users.reducer';
import newsCategory, { NewsCategoryState } from 'app/modules/news-category/news-category.reducer';
import news, { NewsState } from 'app/modules/news/news.reducer';
import faqs, { FaqState } from 'app/modules/faq/faq.reducer';
import challenge, { ChallengeState } from 'app/modules/challenge/challenge.reducer';
import wfProcessGroup, { WfProcessGroupState } from 'app/modules/workflow/wf-process-group/wf-process-group.reducer';
import wfProcess, { WfProcessState } from 'app/modules/workflow/wf-process/wf-process.reducer';
import wfActionType, { WfActionTypeState } from 'app/modules/workflow/wf-action-type/wf-action-type.reducer';
import wfRequest, { WfRequestState } from 'app/modules/workflow/workflow-request.reducer';
import wfAction, { WfActionState } from 'app/modules/workflow/wf-action/wf-action-reducer';
import uploadImage, { UploadImageState } from 'app/modules/upload-image/upload-image-reducer';
import sport, { SportState } from 'app/modules/sport/sport.reducer';
import banner, { BannerState } from 'app/modules/banner/banner.reducer';

/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

export interface IRootState {
  readonly authentication: AuthenticationState;
  readonly applicationProfile: ApplicationProfileState;
  readonly administration: AdministrationState;
  readonly userManagement: UserManagementState;
  readonly register: RegisterState;
  readonly activate: ActivateState;
  readonly challenge: ChallengeState;
  readonly passwordReset: PasswordResetState;
  readonly password: PasswordState;
  readonly settings: SettingsState;
  readonly users: UsersState;
  readonly newsCategory: NewsCategoryState;
  readonly news: NewsState;
  readonly faqs: FaqState;
  readonly wfProcessGroup: WfProcessGroupState;
  readonly wfProcess: WfProcessState;
  readonly wfActionType: WfActionTypeState;
  readonly wfRequest: WfRequestState;
  readonly wfAction: WfActionState;
  readonly uploadImage: UploadImageState;
  readonly sport: SportState;
  readonly banner: BannerState;
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  applicationProfile,
  administration,
  userManagement,
  register,
  activate,
  passwordReset,
  password,
  challenge,
  settings,
  users,
  newsCategory,
  news,
  faqs,
  wfProcessGroup,
  wfProcess,
  wfActionType,
  wfRequest,
  wfAction,
  uploadImage,
  sport,
  banner,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar,
});

export default rootReducer;
