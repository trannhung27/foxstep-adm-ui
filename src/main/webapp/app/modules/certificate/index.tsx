import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Certificate from './certificate';
import CertificateUpdate from './certificate-update';
import { News } from 'app/modules/news/news';

const Routes = ({ match }) => (
  <>
    <Switch>
      {/*<ErrorBoundaryRoute exact path={`${match.url}/new`} component={NewsUpdate} />*/}
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={CertificateUpdate} />
      <ErrorBoundaryRoute path={match.url} component={Certificate} />
    </Switch>
    {/*<ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={NewsDeleteDialog} />*/}
  </>
);

export default Routes;
