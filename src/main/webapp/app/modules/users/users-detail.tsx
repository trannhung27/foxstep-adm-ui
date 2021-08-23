import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { TextFormat } from 'react-jhipster';

import { IRootState } from 'app/shared/reducers';
import { getEntity, lockUser } from './users.reducer';
import { APP_LOCAL_DATE_FORMAT, APP_USER_GENDER, APP_USER_STATUS } from 'app/config/constants';
import { PageHeader } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserLockModal } from 'app/modules/users/user-lock-modal';
import { UserUnlockModal } from 'app/modules/users/user-unlock-modal';

export interface IUsersDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UsersDetail = (props: IUsersDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { usersEntity } = props;

  const [showLockModal, setShowLockModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  return (
    <div>
      <UserLockModal
        showModal={showLockModal}
        onClose={() => {
          setShowLockModal(false);
        }}
        userEntity={props.usersEntity}
        getEntity={props.getEntity}
        lockUser={props.lockUser}
        updateSuccess={props.updateSuccess}
      />

      <UserUnlockModal
        showModal={showUnlockModal}
        onClose={() => {
          setShowUnlockModal(false);
        }}
        userEntity={props.usersEntity}
        getEntity={props.getEntity}
        lockUser={props.lockUser}
        updateSuccess={props.updateSuccess}
      />
      <PageHeader
        style={{ padding: '0 0' }}
        className="site-page-header"
        title="Thông tin khách hàng"
        extra={
          <>
            {usersEntity.status === 1 && (
              <Button
                color="danger"
                className="m-1"
                onClick={() => {
                  setShowLockModal(true);
                }}
              >
                Khóa
              </Button>
            )}

            {usersEntity.status === -2 && (
              <Button
                color="success"
                className="m-1"
                onClick={() => {
                  setShowUnlockModal(true);
                }}
              >
                Mở khóa
              </Button>
            )}

            <Button tag={Link} to={`/users/${usersEntity.id}/challenges-of-user`} color="info" className="m-1">
              Thử thách của KH
            </Button>
            {/*<Button color="info" className="m-1">*/}
            {/*  Hoạt động*/}
            {/*</Button>*/}
            {/*<Button tag={Link} to={`/users/${usersEntity.id}/edit`}  color="info" className="m-1">*/}
            {/*  Chỉnh sửa*/}
            {/*</Button>*/}
            <Button onClick={() => props.history.goBack()} color="default" className="border-secondary m-1">
              Quay lại
            </Button>
          </>
        }
      />
      {/*<hr />*/}
      <Row>
        <Col sm="12" md="6">
          <Table>
            <tbody>
              <tr>
                <th>Trạng thái:</th>
                <th>{APP_USER_STATUS.map(status => (usersEntity.status === status.id ? status.name : ''))}</th>
              </tr>
              <tr>
                <td>Họ và tên:</td>
                <td>{usersEntity.fullName}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>{usersEntity.email}</td>
              </tr>
              <tr>
                <td>Số giấy tờ:</td>
                <td>{usersEntity.nationalIdNumber}</td>
              </tr>
              <tr>
                <td>Số điện thoại:</td>
                <td>{usersEntity.mobilePhone}</td>
              </tr>
              <tr>
                <td>Giới tính</td>
                <td>{APP_USER_GENDER.map(gender => (usersEntity.gender === gender.id ? gender.name : ''))}</td>
              </tr>
              <tr>
                <td>Chiều cao:</td>
                <td>{usersEntity.height}</td>
              </tr>
              <tr>
                <td>BIB:</td>
                <td>{usersEntity.bib}</td>
              </tr>
              <tr>
                <td>Địa chỉ:</td>
                <td>{usersEntity.strAddress}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col sm="12" md="6">
          <Table>
            <tbody>
              <tr>
                <td>Avatar:</td>
                <td>
                  <img src={usersEntity.imageUrl} />
                </td>
              </tr>
              <tr>
                <td>Ngày sinh:</td>
                <td>
                  {usersEntity.birthday ? <TextFormat value={usersEntity.birthday} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}
                </td>
              </tr>
              <tr>
                <td>Cỡ áo:</td>
                <td>{usersEntity.shirtSize}</td>
              </tr>
              <tr>
                <td>Cân nặng:</td>
                <td>{usersEntity.weight} (kg)</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = ({ users }: IRootState) => ({
  usersEntity: users.entity,
  updateSuccess: users.updateSuccess,
});

const mapDispatchToProps = { getEntity, lockUser };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UsersDetail);
