import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Banner from './banner';
import BannerUpdate from './banner-update';
import BannerDeleteDialog from 'app/modules/banner/banner-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute path={match.url} component={Banner} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={BannerUpdate} />
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={BannerDeleteDialog} />
  </>
);

export default Routes;
