import React from 'react';
import { Switch } from 'react-router-dom';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import ChallengeParticipants from './challenge-participants';
import ParticipantUpdate from 'app/modules/challenge/challenge-participants/cp-update';
import ChallengeApproveDialog from 'app/modules/challenge/challenge-approve-dialog';
import ChallengeRejectDialog from 'app/modules/challenge/challenge-reject-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ParticipantUpdate} />
      <ErrorBoundaryRoute path={match.url} component={ChallengeParticipants} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/approve`} component={ChallengeApproveDialog} />
    <ErrorBoundaryRoute exact path={`${match.url}/:id/reject`} component={ChallengeRejectDialog} />
    <ErrorBoundaryRoute exact path={`${match.url}/:id/remove`} component={ChallengeRejectDialog} />
  </>
);

export default Routes;
