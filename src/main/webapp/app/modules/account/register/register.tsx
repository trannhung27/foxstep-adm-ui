import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import { Alert, Button, Col, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { handleRegister, reset } from './register.reducer';
import { Link } from 'react-router-dom';

export type IRegisterProps = DispatchProps;

export const RegisterPage = (props: IRegisterProps) => {
  const [password, setPassword] = useState('');

  useEffect(
    () => () => {
      props.reset();
    },
    []
  );

  const handleValidSubmit = (event, values) => {
    props.handleRegister(values.username, values.email, values.firstPassword);
    event.preventDefault();
  };

  const updatePassword = event => setPassword(event.target.value);

  return (
    <Row>
      <Col sm="12" md={{ size: 6, offset: 3 }} lg={{ size: 4, offset: 4 }}>
        <AvForm id="register-form" onValidSubmit={handleValidSubmit} className="rounded bg-white">
          <ModalHeader>Đăng ký</ModalHeader>
          <ModalBody>
            <AvField
              name="username"
              label="Tên tài khoản"
              placeholder={'Nhập tên tài khoản'}
              validate={{
                required: { value: true, errorMessage: 'Chưa nhập tên tài khoản.' },
                pattern: {
                  value: '^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$',
                  errorMessage: 'Tên tài khoản không hợp lệ.',
                },
                minLength: { value: 1, errorMessage: 'Ít nhất 1 kí tự.' },
                maxLength: { value: 50, errorMessage: 'Tối đa 50 kí tự.' },
              }}
              data-cy="username"
            />
            <AvField
              name="email"
              label="Email"
              placeholder={'Nhập email'}
              type="email"
              validate={{
                required: { value: true, errorMessage: 'Chưa nhập email.' },
                minLength: { value: 5, errorMessage: 'Ít nhất 5 kí tự.' },
                maxLength: { value: 254, errorMessage: 'Tối đa 254 kí tự.' },
              }}
              data-cy="email"
            />
            <AvField
              name="firstPassword"
              label="Mật khẩu"
              placeholder={'Nhập mật khẩu'}
              type="password"
              onChange={updatePassword}
              validate={{
                required: { value: true, errorMessage: 'Chưa nhập mật khẩu.' },
                minLength: { value: 4, errorMessage: 'Ít nhất 4 kí tự.' },
                maxLength: { value: 50, errorMessage: 'Tối đa 50 kí tự.' },
              }}
              data-cy="firstPassword"
            />
            <PasswordStrengthBar password={password} />
            <AvField
              name="secondPassword"
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu"
              type="password"
              validate={{
                required: { value: true, errorMessage: 'Chưa nhập xác nhận mật khẩu.' },
                minLength: {
                  value: 4,
                  errorMessage: 'Ít nhất 4 kí tự.',
                },
                maxLength: {
                  value: 50,
                  errorMessage: 'Tối đa 50 kí tự.',
                },
                match: { value: 'firstPassword', errorMessage: 'Mật khẩu không khớp!' },
              }}
              data-cy="secondPassword"
            />
          </ModalBody>
          <ModalFooter>
            <Button id="register-submit" color="primary" type="submit" data-cy="submit">
              Đăng ký
            </Button>
          </ModalFooter>
        </AvForm>
        <p>&nbsp;</p>
        <Alert color="warning">
          <span>Nếu bạn muốn </span>
          <Link to="/login">Đăng nhập</Link>
          <span>
            , có thể dùng tài khoản mặc định:
            <br />- Administrator (admin / admin)
            <br />- User (use / user)
          </span>
        </Alert>
      </Col>
    </Row>
  );
};

const mapDispatchToProps = { handleRegister, reset };
type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(RegisterPage);
