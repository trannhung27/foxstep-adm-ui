import 'app/config/dayjs.ts';
import 'react-toastify/dist/ReactToastify.css';
import '../../../../node_modules/antd/dist/antd.css';
import './app.scss';

import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';

import { Layout } from 'antd';
import LayoutHeader from 'app/shared/layout/header/header';
import LayoutFooter from 'app/shared/layout/footer/footer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { AUTHORITIES } from 'app/config/constants';
import Sidebar from 'app/shared/layout/sidebar/sidebar';

import { toast, ToastContainer } from 'react-toastify';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import NavPath from 'app/shared/layout/navpath/navpath';
import AppRoutes from 'app/routes';
import LoadingBar from 'react-redux-loading-bar';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');
const { Content } = Layout;

export interface IAppProps extends StateProps, DispatchProps {}

export const App = (props: IAppProps) => {
  useEffect(() => {
    props.getSession();
    props.getProfile();
  }, []);

  return (
    <Router basename={baseHref}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar
          isAuthenticated={props.isAuthenticated}
          isAdmin={props.isAdmin}
          // ribbonEnv={props.ribbonEnv}
          isInProduction={props.isInProduction}
          isOpenAPIEnabled={props.isOpenAPIEnabled}
        />
        <Layout className="site-layout">
          <LoadingBar />
          <ToastContainer position={toast.POSITION.TOP_RIGHT} className="toastify-container" toastClassName="toastify-toast" />
          <LayoutHeader isAuthenticated={props.isAuthenticated} username={props.login} />
          <NavPath />
          <Content style={{ background: '#fff', margin: '0px 16px', padding: 24, minHeight: 280 }}>
            <AppRoutes />
          </Content>
          <LayoutFooter />
        </Layout>
      </Layout>
    </Router>
  );
};

const mapStateToProps = ({ authentication, applicationProfile }: IRootState) => ({
  isAuthenticated: authentication.isAuthenticated,
  isAdmin: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.ADMIN]),
  login: authentication.account.login,
  ribbonEnv: applicationProfile.ribbonEnv,
  isInProduction: applicationProfile.inProduction,
  isOpenAPIEnabled: applicationProfile.isOpenAPIEnabled,
});

const mapDispatchToProps = { getSession, getProfile };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(hot(module)(App));
