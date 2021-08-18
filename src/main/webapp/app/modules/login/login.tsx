import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Alert, Button, Col, Label, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';

import { IRootState } from 'app/shared/reducers';
import { getOauth2Url, login, verifyOauth2Code } from 'app/shared/reducers/authentication';
import { getUrlParameter } from 'react-jhipster';

export interface ILoginProps extends StateProps, DispatchProps, RouteComponentProps<{ code: any }> {}

export const Login = (props: ILoginProps) => {
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    props.getOauth2Url();

    const code = getUrlParameter('code', props.location.search);
    if (code) props.verifyOauth2Code(code, rememberMe);
  }, []);

  const handleSubmit = (event, errors, { username, password, rememberMe }) => {
    props.login(username, password, rememberMe);
  };

  const { location, isAuthenticated, oauth2Url } = props;
  const { from } = (location.state as any) || { from: { pathname: '/', search: location.search } };
  if (isAuthenticated) {
    return <Redirect to={from} />;
  }

  return (
    <Row>
      <Col sm="12" md={{ size: 6, offset: 3 }} lg={{ size: 4, offset: 4 }}>
        <AvForm onSubmit={handleSubmit} className="rounded bg-white">
          <ModalHeader style={{ justifyContent: 'center' }}>Hệ Thống Quản Trị FoxSteps</ModalHeader>
          <ModalBody>
            <Row>
              <Col md="12">
                {props.loginError ? (
                  <Alert color="danger" data-cy="loginError">
                    <strong>Đăng nhập thất bại!</strong> Sai tên tài khoản hoặc mật khẩu.
                  </Alert>
                ) : null}
              </Col>
              <Col md="12">
                <AvField
                  name="username"
                  label="Tài khoản:*"
                  placeholder="Nhập tên tài khoản"
                  required
                  errorMessage="Chưa nhập tên tài khoản!"
                  data-cy="username"
                />
                <AvField
                  name="password"
                  type="password"
                  label="Mật khẩu:*"
                  placeholder="Nhập mật khẩu"
                  required
                  errorMessage="Chưa nhập mật khẩu!"
                  data-cy="password"
                />
                <AvGroup check inline>
                  <Label className="form-check-label">
                    <AvInput type="checkbox" name="rememberMe" value={rememberMe} onChange={e => setRememberMe(e.target.value)} /> Ghi nhớ
                    tài khoản
                  </Label>
                </AvGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit" data-cy="submit">
              Đăng nhập
            </Button>
          </ModalFooter>
        </AvForm>
        {oauth2Url && (
          <div className="mt-1 text-center">
            &nbsp;
            <Alert color="warning">
              <a href={oauth2Url}>Đăng nhập bằng tài khoản FPT</a>
            </Alert>
          </div>
        )}
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  isAuthenticated: authentication.isAuthenticated,
  loginError: authentication.loginError,
  oauth2Url: authentication.oauth2Url,
});

const mapDispatchToProps = { login, getOauth2Url, verifyOauth2Code };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Login);
