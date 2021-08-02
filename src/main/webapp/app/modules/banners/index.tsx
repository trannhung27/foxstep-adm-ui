import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Banners from './banners';
import BannersUpdate from './banners-update';
import BannersDeleteDialog from './banners-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute path={`${match.url}/select`} component={BannersUpdate} />
      <ErrorBoundaryRoute path={`${match.url}`} component={Banners} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={BannersDeleteDialog} />
  </>
);

export default Routes;
