import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Users from './users';
import UsersDetail from './users-detail';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={UsersDetail} />
      <ErrorBoundaryRoute path={match.url} component={Users} />
    </Switch>
  </>
);

export default Routes;
