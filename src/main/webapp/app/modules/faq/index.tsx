import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Faqs from './faqs';
import FaqDetail from './faq-detail';
import FaqUpdate from './faq-update';
import FaqDeleteDialog from './faq-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={FaqUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={FaqUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={FaqDetail} />
      <ErrorBoundaryRoute path={match.url} component={Faqs} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={FaqDeleteDialog} />
  </>
);

export default Routes;
