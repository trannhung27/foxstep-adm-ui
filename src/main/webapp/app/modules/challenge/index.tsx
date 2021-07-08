import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Challenge from './challenge';
import ChallengeDetail from './challenge-detail';
import ChallengeUpdate from './challenge-update';
import ChallengeDeleteDialog from './challenge-delete-dialog';
import ChallengeApproveDialog from './challenge-approve-dialog';
import ChallengeRejectDialog from './challenge-reject-dialog';
const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ChallengeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ChallengeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ChallengeDetail} />
      <ErrorBoundaryRoute path={match.url} component={Challenge} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ChallengeDeleteDialog} />
    <ErrorBoundaryRoute exact path={`${match.url}/:id/approve`} component={ChallengeApproveDialog} />
    <ErrorBoundaryRoute exact path={`${match.url}/:id/reject`} component={ChallengeRejectDialog} />
  </>
);

export default Routes;
