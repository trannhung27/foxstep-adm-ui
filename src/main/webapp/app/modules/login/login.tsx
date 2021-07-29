import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, RouteComponentProps } from 'react-router-dom';
import { Alert, Button, Col, Label, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';

import { IRootState } from 'app/shared/reducers';
import { login } from 'app/shared/reducers/authentication';

export interface ILoginProps extends StateProps, DispatchProps, RouteComponentProps<any> {}

export const Login = (props: ILoginProps) => {
  const handleSubmit = (event, errors, { username, password, rememberMe }) => {
    props.login(username, password, rememberMe);
  };

  const { location, isAuthenticated } = props;
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
                  autoFocus
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
                    <AvInput type="checkbox" name="rememberMe" /> Ghi nhớ tài khoản
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
        {/*<div className="mt-1">&nbsp;</div>*/}
        {/*<Alert color="warning">*/}
        {/*  <Link to="/reset/request" data-cy="forgetYourPasswordSelector">*/}
        {/*    Quên mật khẩu?*/}
        {/*  </Link>*/}
        {/*</Alert>*/}
        {/*<Alert color="warning">*/}
        {/*  <span>Chưa có tài khoản?</span> <Link to="/register">Đăng ký</Link>*/}
        {/*</Alert>*/}
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  isAuthenticated: authentication.isAuthenticated,
  loginError: authentication.loginError,
});

const mapDispatchToProps = { login };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Login);
