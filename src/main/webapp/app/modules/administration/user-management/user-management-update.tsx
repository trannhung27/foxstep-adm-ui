import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Label, Row } from 'reactstrap';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { createUser, getRoles, getUser, reset, updateUser } from './user-management.reducer';
import { IRootState } from 'app/shared/reducers';
import { USER_STATUS } from 'app/config/constants';
import { PageHeader } from 'antd';

export interface IUserManagementUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ login: string }> {}

export const UserManagementUpdate = (props: IUserManagementUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.login);

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getUser(props.match.params.login);
    }
    props.getRoles();
    return () => {
      props.reset();
    };
  }, []);

  const handleClose = () => {
    props.history.push('/admin/user-management');
  };

  const saveUser = (event, values) => {
    if (isNew) {
      props.createUser(values);
    } else {
      props.updateUser(values);
    }
    handleClose();
  };

  const isInvalid = false;
  const { user, loading, updating, roles } = props;

  return (
    <div>
      <PageHeader style={{ padding: '0 0' }} className="site-page-header" title={isNew ? 'Thêm người dùng' : 'Sửa người dùng'} />
      <hr />
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm onValidSubmit={saveUser}>
              {user.id ? (
                <AvGroup>
                  <Label for="id">ID</Label>
                  <AvField type="text" className="form-control" name="id" required readOnly value={user.id} />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label for="login">Tên đăng nhập</Label>
                <AvField
                  type="text"
                  className="form-control"
                  name="login"
                  placeholder={'Aa'}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: 'Giá trị bắt buộc.',
                    },
                    pattern: {
                      value: '^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$',
                      errorMessage: 'Không hợp lệ.',
                    },
                    minLength: {
                      value: 1,
                      errorMessage: 'Tối thiểu 1 kí tự.',
                    },
                    maxLength: {
                      value: 50,
                      errorMessage: 'Tối đa 50 kí tự.',
                    },
                  }}
                  value={user.login}
                />
              </AvGroup>
              <AvGroup>
                <Label for="firstName">Họ tên</Label>
                <AvField
                  type="text"
                  className="form-control"
                  name="firstName"
                  placeholder={'Aa'}
                  validate={{
                    maxLength: {
                      value: 50,
                      errorMessage: 'Tối đa 50 kí tự.',
                    },
                  }}
                  value={user.firstName}
                />
              </AvGroup>
              <AvGroup>
                <AvField
                  name="email"
                  label="Email"
                  placeholder={'Aa@company.com'}
                  type="email"
                  validate={{
                    required: {
                      value: true,
                      errorMessage: 'Giá trị bắt buộc.',
                    },
                    email: {
                      errorMessage: 'Không hợp lệ.',
                    },
                    minLength: {
                      value: 5,
                      errorMessage: 'Tối thiểu 5 kí tự.',
                    },
                    maxLength: {
                      value: 254,
                      errorMessage: 'Tối đa 50 kí tự.',
                    },
                  }}
                  value={user.email}
                />
              </AvGroup>
              <AvGroup check>
                <Label>
                  <AvInput
                    type="checkbox"
                    name="status"
                    value={user.status}
                    checked={user.status === USER_STATUS.ACTIVATED}
                    trueValue={USER_STATUS.ACTIVATED}
                    falseValue={USER_STATUS.INACTIVE}
                    // disabled={!user.id}
                  />{' '}
                  Hoạt động
                </Label>
              </AvGroup>
              <AvGroup>
                <Label for="authorities">Nhóm quyền</Label>
                <AvInput type="select" className="form-control" name="authorities" value={user.authorities} multiple>
                  {roles.map(role => (
                    <option value={role} key={role}>
                      {role}
                    </option>
                  ))}
                </AvInput>
              </AvGroup>
              <Button tag={Link} to="/admin/user-management" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Hủy</span>
              </Button>
              &nbsp;
              <Button color="primary" type="submit" disabled={isInvalid || updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Lưu
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  user: storeState.userManagement.user,
  roles: storeState.userManagement.authorities,
  loading: storeState.userManagement.loading,
  updating: storeState.userManagement.updating,
});

const mapDispatchToProps = { getUser, getRoles, updateUser, createUser, reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserManagementUpdate);
