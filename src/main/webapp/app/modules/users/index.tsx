import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Users from './users';
import UsersDetail from './users-detail';
import ChallengesOfUser from 'app/modules/users/challenges-of-user/challenges-of-user';
import FaqUpdate from 'app/modules/faq/faq-update';
import { UsersUpdate } from 'app/modules/users/users-update';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={UsersUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={UsersDetail} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/challenges-of-user`} component={ChallengesOfUser} />
      <ErrorBoundaryRoute path={match.url} component={Users} />
    </Switch>
  </>
);

export default Routes;
