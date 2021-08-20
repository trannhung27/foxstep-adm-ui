import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Badge, Col, Table } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, USER_STATUS } from 'app/config/constants';

import { getUser } from './user-management.reducer';
import { IRootState } from 'app/shared/reducers';
import { Descriptions, PageHeader } from 'antd';

export interface IUserManagementDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ login: string }> {}

export const UserManagementDetail = (props: IUserManagementDetailProps) => {
  useEffect(() => {
    props.getUser(props.match.params.login);
  }, []);

  const { user } = props;

  return (
    <div>
      <PageHeader
        style={{ padding: '0 0' }}
        className="site-page-header"
        title="Chi tiết người dùng"
        onBack={() => props.history.goBack()}
      ></PageHeader>
      <Row>
        <Col sm="12" md="6">
          <Table responsive striped hover>
            <tbody>
              <tr>
                <td>Tên đăng nhập</td>
                <td>{user.login}</td>
              </tr>
              <tr>
                <td>Trạng thái</td>
                <td>
                  {user.status === USER_STATUS.ACTIVATED ? (
                    <Badge color="success">Hoạt động</Badge>
                  ) : (
                    <Badge color="danger">Không hoạt động</Badge>
                  )}
                </td>
              </tr>
              <tr>
                <td>Họ tên</td>
                <td>{user.firstName}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{user.email}</td>
              </tr>
              <tr>
                <td>Nhóm quyền</td>
                <td>
                  <ul className="list-unstyled">
                    {user.authorities
                      ? user.authorities.map((authority, i) => (
                          <li key={`user-auth-${i}`}>
                            <Badge color="info">{authority}</Badge>
                          </li>
                        ))
                      : null}
                  </ul>
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col sm="12" md="6">
          <Table responsive striped hover>
            <tbody>
              <tr>
                <td>Tạo bởi</td>
                <td>{user.createdBy}</td>
              </tr>
              <tr>
                <td>Thời gian tạo</td>
                <td>
                  {user.createdDate ? <TextFormat value={user.createdDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid /> : null}
                </td>
              </tr>
              <tr>
                <td>Cập nhật bởi</td>
                <td>{user.lastModifiedBy}</td>
              </tr>
              <tr>
                <td>Thời gian cập nhật</td>
                <td>
                  {user.lastModifiedDate ? (
                    <TextFormat value={user.lastModifiedDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
                  ) : null}
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  user: storeState.userManagement.user,
});

const mapDispatchToProps = { getUser };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserManagementDetail);
