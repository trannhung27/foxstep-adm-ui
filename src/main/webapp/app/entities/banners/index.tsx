import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import BannersUpdate from './banners-update';
import Magane from './magane';
import BannersSelect from './banners-select';
import BannersDeleteDialog from './banners-dialog';
const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute  path={`${match.url}/select`} component={BannersSelect} />
      <ErrorBoundaryRoute  path={`${match.url}/new`} component={BannersUpdate} />
      <ErrorBoundaryRoute  path={`${match.url}`} component={Magane} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/select/:id`} component={BannersDeleteDialog} />
  </>
);

export default Routes;
