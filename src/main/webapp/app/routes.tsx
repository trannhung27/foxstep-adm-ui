import React from 'react';
import Loadable from 'react-loadable';
import { Switch } from 'react-router-dom';

import { AUTHORITIES } from 'app/config/constants';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PrivateRoute from 'app/shared/auth/private-route';
import Login from 'app/modules/login/login';
import Register from 'app/modules/account/register/register';
import Activate from 'app/modules/account/activate/activate';
import PasswordResetInit from 'app/modules/account/password-reset/init/password-reset-init';
import PasswordResetFinish from 'app/modules/account/password-reset/finish/password-reset-finish';
import Logout from 'app/modules/login/logout';
import Home from 'app/modules/home/home';
import PageNotFound from 'app/shared/error/page-not-found';
import Users from 'app/modules/users';
import NewsCategory from 'app/modules/news-category';
import News from 'app/modules/news';
import Faqs from 'app/modules/faq';
import Challenge from 'app/modules/challenge';
import WfProcessGroup from 'app/modules/workflow/wf-process-group';
import WfActionType from 'app/modules/workflow/wf-action-type';
import WfProcess from 'app/modules/workflow/wf-process';
import Sport from 'app/modules/sport';

const Account = Loadable({
  loader: () => import(/* webpackChunkName: "account" */ 'app/modules/account'),
  loading: () => <div>loading ...</div>,
});

const Admin = Loadable({
  loader: () => import(/* webpackChunkName: "administration" */ 'app/modules/administration'),
  loading: () => <div>loading ...</div>,
});

const Routes = () => (
  <div className="view-routes">
    <Switch>
      <ErrorBoundaryRoute path="/login" component={Login} />
      <ErrorBoundaryRoute path="/logout" component={Logout} />
      {/*<ErrorBoundaryRoute path="/register" component={Register} />*/}
      {/*<ErrorBoundaryRoute path="/activate/:key?" component={Activate} />*/}
      {/*<ErrorBoundaryRoute path="/reset/request" component={PasswordResetInit} />*/}
      {/*<ErrorBoundaryRoute path="/reset/finish/:key?" component={PasswordResetFinish} />*/}
      <PrivateRoute path="/admin" component={Admin} hasAnyAuthorities={[AUTHORITIES.ADMIN.name]} />
      <PrivateRoute path="/" component={Home} exact hasAnyAuthorities={[AUTHORITIES.ADMIN.name, AUTHORITIES.USER.name]} />
      <PrivateRoute path="/account" component={Account} hasAnyAuthorities={[AUTHORITIES.ADMIN.name, AUTHORITIES.USER.name]} />
      <PrivateRoute path="/users" component={Users} hasAnyAuthorities={[AUTHORITIES.ADMIN.name, AUTHORITIES.USER.name]} />
      <PrivateRoute path="/news-category" component={NewsCategory} hasAnyAuthorities={[AUTHORITIES.ADMIN.name]} />
      <PrivateRoute path="/wf-process-group" component={WfProcessGroup} hasAnyAuthorities={[AUTHORITIES.ADMIN.name]} />
      <PrivateRoute path="/wf-process" component={WfProcess} hasAnyAuthorities={[AUTHORITIES.ADMIN.name]} />
      <PrivateRoute path="/wf-action-type" component={WfActionType} hasAnyAuthorities={[AUTHORITIES.ADMIN.name]} />
      <PrivateRoute path="/sport" component={Sport} hasAnyAuthorities={[AUTHORITIES.ADMIN.name]} />
      <PrivateRoute path="/news" component={News} hasAnyAuthorities={[AUTHORITIES.ADMIN.name, AUTHORITIES.USER.name]} />
      <PrivateRoute path="/challenges" component={Challenge} hasAnyAuthorities={[AUTHORITIES.ADMIN.name, AUTHORITIES.USER.name]} />
      <PrivateRoute path="/faqs" component={Faqs} hasAnyAuthorities={[AUTHORITIES.ADMIN.name, AUTHORITIES.USER.name]} />
      {/*<PrivateRoute path="/entity" component={Entities} hasAnyAuthorities={[AUTHORITIES.ADMIN.name, AUTHORITIES.USER.name]} />*/}
      <ErrorBoundaryRoute path="*" component={PageNotFound} />
    </Switch>
  </div>
);

export default Routes;
