import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Col, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import { getUrlParameter } from 'react-jhipster';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import { handlePasswordResetFinish, reset } from '../password-reset.reducer';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';

export interface IPasswordResetFinishProps extends DispatchProps, RouteComponentProps<{ key: string }> {}

export const PasswordResetFinishPage = (props: IPasswordResetFinishProps) => {
  const [password, setPassword] = useState('');
  const [key] = useState(getUrlParameter('key', props.location.search));
  const history = useHistory();

  useEffect(
    () => () => {
      props.reset();
    },
    []
  );

  const handleValidSubmit = (event, values) => {
    props.handlePasswordResetFinish(key, values.newPassword);
    history.push('/login');
  };

  const updatePassword = event => setPassword(event.target.value);

  const getResetForm = () => {
    return (
      <AvForm onValidSubmit={handleValidSubmit}>
        <ModalBody>
          <AvField
            name="newPassword"
            label="Mật khẩu mới"
            placeholder={'Nhập mật khẩu mới'}
            type="password"
            validate={{
              required: { value: true, errorMessage: 'Chưa nhập mật khẩu.' },
              minLength: { value: 4, errorMessage: 'Ít nhất 4 ký tự.' },
              maxLength: { value: 50, errorMessage: 'Tối đa 50 ký tự.' },
            }}
            onChange={updatePassword}
            data-cy="resetPassword"
          />
          <PasswordStrengthBar password={password} />
          <AvField
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            placeholder="Nhập lại mật khẩu mới"
            type="password"
            validate={{
              required: { value: true, errorMessage: 'Chưa nhập xác nhận mật khẩu mới.' },
              minLength: {
                value: 4,
                errorMessage: 'Ít nhất 4 ký tự.',
              },
              maxLength: {
                value: 50,
                errorMessage: 'Tối đa 50 ký tự.',
              },
              match: { value: 'newPassword', errorMessage: 'Mật khẩu không khớp!' },
            }}
            data-cy="confirmResetPassword"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="success" type="submit" data-cy="submit">
            Lưu mật khẩu mới
          </Button>
        </ModalFooter>
      </AvForm>
    );
  };

  return (
    <div>
      <Row>
        <Col sm="12" md={{ size: 6, offset: 3 }} className="rounded bg-white p-2">
          <ModalHeader>Đối mới mật khẩu</ModalHeader>
          <div>{key ? getResetForm() : 'Địa chỉ không hợp lệ!'}</div>
        </Col>
      </Row>
    </div>
  );
};

const mapDispatchToProps = { handlePasswordResetFinish, reset };

type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(PasswordResetFinishPage);
