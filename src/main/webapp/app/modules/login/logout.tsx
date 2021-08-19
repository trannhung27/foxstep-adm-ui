import React, { useLayoutEffect } from 'react';
import { connect } from 'react-redux';

import { IRootState } from 'app/shared/reducers';
import { logout } from 'app/shared/reducers/authentication';
import { useHistory, Link } from 'react-router-dom';
import { Storage } from 'react-jhipster';
import { AUTH_LOGOUT_URL } from 'app/config/constants';

export interface ILogoutProps extends StateProps, DispatchProps {
  idToken: string;
  logoutUrl: string;
}

export const Logout = (props: ILogoutProps) => {
  const history = useHistory();

  useLayoutEffect(() => {
    const logoutUrl = props.logoutUrl || Storage.local.get(AUTH_LOGOUT_URL) || Storage.session.get(AUTH_LOGOUT_URL);
    props.logout();
    if (logoutUrl) {
      window.location.href = logoutUrl;
    } else history.push('/login');
  });

  return (
    <div className="p-5 bg-white">
      <h4>Đã đăng xuất!</h4>
      <span>
        <Link to="/login">Đăng nhập</Link>
      </span>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  logoutUrl: storeState.authentication.logoutUrl,
  idToken: storeState.authentication.idToken,
});

const mapDispatchToProps = { logout };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
