import 'app/config/dayjs.ts';
import 'react-toastify/dist/ReactToastify.css';
import '../../../../node_modules/antd/dist/antd.css';
import '../../../../node_modules/react-datetime/css/react-datetime.css';
import './app.scss';

import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';

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
        {props.isAuthenticated && (
          <Sidebar
            isAuthenticated={props.isAuthenticated}
            isAdmin={props.isAdmin}
            // ribbonEnv={props.ribbonEnv}
            isInProduction={props.isInProduction}
            isOpenAPIEnabled={props.isOpenAPIEnabled}
          />
        )}
        <Layout>
          <LoadingBar />
          <ToastContainer position={toast.POSITION.TOP_RIGHT} className="toastify-container" toastClassName="toastify-toast" />
          {props.isAuthenticated && <LayoutHeader isAuthenticated={props.isAuthenticated} username={props.login} />}
          {props.isAuthenticated && <NavPath />}
          <Content className={props.isAuthenticated ? 'bg-white' : 'bg-light-gray'} style={{ padding: 24, margin: '0 16px' }}>
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
