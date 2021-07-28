import React from 'react';
import { Switch } from 'react-router-dom';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import ChallengeParticipants from 'app/modules/challenge/challenge-participants/challenge-participants';
import ParticipantUpdate from 'app/modules/challenge/challenge-participants/cp-update';
import ParticipantApproveDialog from 'app/modules/challenge/challenge-participants/cp-approve-dialog';
import ParticipantRejectDialog from 'app/modules/challenge/challenge-participants/cp-reject-dialog';
import ParticipantRemoveDialog from 'app/modules/challenge/challenge-participants/cp-remove-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute path={`${match.url}`} component={ChallengeParticipants} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ParticipantUpdate} />
    <ErrorBoundaryRoute exact path={`${match.url}/:requestId/approve`} component={ParticipantApproveDialog} />
    <ErrorBoundaryRoute exact path={`${match.url}/:requestId/reject`} component={ParticipantRejectDialog} />
    <ErrorBoundaryRoute exact path={`${match.url}/:requestId/remove`} component={ParticipantRemoveDialog} />
  </>
);

export default Routes;
