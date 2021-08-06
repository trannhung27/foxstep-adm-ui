import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Row } from 'reactstrap';
import { WfProcessType, WfProcessGroup, WfActionType } from '../../config/constants';
import { IRootState } from 'app/shared/reducers';
import { getEntity, lockUser } from './users.reducer';

export interface IUserUnlockModalProps extends StateProps, DispatchProps {
  showModal: boolean;
  onClose: () => void;
}

export const UserUnlockModal = (props: IUserUnlockModalProps) => {
  const handleClose = () => {
    props.onClose();
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const { userEntity } = props;
  const [actionMessage, setActionMessage] = useState('');
  const sendUnlockUserRequest = () => {
    const unlockRequest = {
      activity: 2,
      reason: actionMessage,
      userId: userEntity.id,
    };
    props.lockUser(unlockRequest);
  };

  return (
    <Modal isOpen={props.showModal} toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="userUnlockModalHeading">
        Mở khoá khách hàng
      </ModalHeader>
      <ModalBody id="foxstep2AdminWebappApp.users.unlock.question">
        <Row style={{ marginLeft: '1px' }}>
          Bạn có chắc muốn mở khóa khách hàng? Sau khi mở khóa, khách hàng sẽ được truy cập được ứng dụng.
        </Row>
        <Row style={{ marginLeft: '1px' }}>
          Lý do: <text style={{ color: 'red' }}>*</text>
        </Row>
        <Row>
          <input
            style={{ width: '500px', height: '180px', margin: '10px' }}
            type="string"
            required
            onChange={event => {
              setActionMessage(event.target.value);
            }}
          ></input>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button id="jhi-confirm-lock-user" data-cy="entityLockUserButton" color="danger" onClick={sendUnlockUserRequest}>
          &nbsp; Có
        </Button>
        <Button color="secondary" onClick={handleClose}>
          &nbsp; Không
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ users }: IRootState) => ({
  userEntity: users.entity,
  updateSuccess: users.updateSuccess,
});

const mapDispatchToProps = { getEntity, lockUser };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserUnlockModal);
