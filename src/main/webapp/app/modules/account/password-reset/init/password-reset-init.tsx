import React from 'react';

import { connect } from 'react-redux';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import { Alert, Button, Col, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

import { handlePasswordResetInit, reset } from '../password-reset.reducer';
import { Link } from 'react-router-dom';

export type IPasswordResetInitProps = DispatchProps;

export class PasswordResetInit extends React.Component<IPasswordResetInitProps> {
  componentWillUnmount() {
    this.props.reset();
  }

  handleValidSubmit = (event, values) => {
    this.props.handlePasswordResetInit(values.email);
    event.preventDefault();
  };

  render() {
    return (
      <Row>
        <Col sm="12" md={{ size: 6, offset: 3 }}>
          <AvForm onValidSubmit={this.handleValidSubmit} className="rounded bg-white">
            <ModalHeader>
              <h4>Quên mật khẩu</h4>
            </ModalHeader>
            <ModalBody>
              <Alert color="warning">
                <p>Nhập địa chỉ email đã đăng ký</p>
              </Alert>
              <AvField
                name="email"
                label="Email"
                placeholder={'Nhập email'}
                type="email"
                validate={{
                  required: { value: true, errorMessage: 'Chưa nhập email.' },
                  minLength: { value: 5, errorMessage: 'Ít nhất 5 kí tự.' },
                  maxLength: { value: 254, errorMessage: 'Tối đa 50 kí tự.' },
                }}
                data-cy="emailResetPassword"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit" data-cy="submit">
                Đối mới mật khẩu
              </Button>
            </ModalFooter>
          </AvForm>
          <p>&nbsp;</p>
          <Alert color="warning">
            <span>Quay lại trang </span>
            <Link to="/login">Đăng nhập</Link>
          </Alert>
        </Col>
      </Row>
    );
  }
}

const mapDispatchToProps = { handlePasswordResetInit, reset };

type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(PasswordResetInit);
