import 'app/config/dayjs.ts';
import 'react-toastify/dist/ReactToastify.css';
import '../../../../node_modules/antd/dist/antd.css';
import '../../../../node_modules/react-datetime/css/react-datetime.css';
import './app.scss';
import 'react-datetime/css/react-datetime.css';

import React, { useEffect } from 'react';
import { Storage } from 'react-jhipster';
import { BrowserRouter as Router } from 'react-router-dom';
import { getSession, logout } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import jwtDecode from 'jwt-decode';

import { Layout } from 'antd';
import LayoutHeader from 'app/shared/layout/header/header';
import LayoutFooter from 'app/shared/layout/footer/footer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import Sidebar from 'app/shared/layout/sidebar/sidebar';

import { toast, ToastContainer } from 'react-toastify';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import AppRoutes from 'app/routes';
import LoadingBar from 'react-redux-loading-bar';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');
const { Content } = Layout;

const AUTH_TOKEN_KEY = 'jhi-authenticationToken';

export interface IAppProps extends StateProps, DispatchProps {}
export const App = (props: IAppProps) => {
  useEffect(() => {
    if (Storage.local.get(AUTH_TOKEN_KEY)) {
      // @ts-ignore
      if (jwtDecode(Storage.local.get(AUTH_TOKEN_KEY)).exp < Date.now() / 1000) props.logout();
    }
    if (Storage.session.get(AUTH_TOKEN_KEY)) {
      // @ts-ignore
      if (jwtDecode(Storage.session.get(AUTH_TOKEN_KEY)).exp < Date.now() / 1000) props.logout();
    }
    props.getSession();
    props.getProfile();
  }, []);

  return (
    <Router basename={baseHref}>
      <Layout style={{ minHeight: '100vh', background: 'aliceblue' }}>
        {props.isAuthenticated && (
          <Sidebar
            isAuthenticated={props.isAuthenticated}
            isAdmin={props.isAdmin}
            // ribbonEnv={props.ribbonEnv}
            isInProduction={props.isInProduction}
            isOpenAPIEnabled={props.isOpenAPIEnabled}
          />
        )}
        <Layout style={{ background: 'aliceblue' }}>
          <LoadingBar />
          <ToastContainer position={toast.POSITION.TOP_RIGHT} className="toastify-container" toastClassName="toastify-toast" />
          {props.isAuthenticated && <LayoutHeader isAuthenticated={props.isAuthenticated} username={props.login} />}
          {/*{props.isAuthenticated && <NavPath />}*/}
          <Content
            style={{
              padding: '16px 16px',
              margin: '16px 16px',
              borderRadius: '5px',
              background: props.isAuthenticated ? 'white' : 'aliceblue',
            }}
          >
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
  isAdmin: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.ADMIN.name]),
  login: authentication.account.login,
  ribbonEnv: applicationProfile.ribbonEnv,
  isInProduction: applicationProfile.inProduction,
  isOpenAPIEnabled: applicationProfile.isOpenAPIEnabled,
});

const mapDispatchToProps = { getSession, getProfile, logout };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(hot(module)(App));
