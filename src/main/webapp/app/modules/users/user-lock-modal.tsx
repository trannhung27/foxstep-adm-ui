import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { WfProcessType, WfProcessGroup, WfActionType } from '../../config/constants';
import { IRootState } from 'app/shared/reducers';
import { getEntity } from './users.reducer';

export interface IUserLockModalProps extends StateProps, DispatchProps {
  showModal: boolean;
  onClose: () => void;
}

export const UserLockModal = (props: IUserLockModalProps) => {
  const handleClose = () => {
    props.onClose();
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const { userEntity } = props;

  const lockUser = () => {};

  return (
    <Modal isOpen={props.showModal} toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="userLockModalHeading">
        Khoá khách hàng
      </ModalHeader>
      <ModalBody id="foxstep2AdminWebappApp.users.lock.question">
        Bạn có chắc muốn khóa khách hàng? Sau khi khóa, khách hàng sẽ không thể truy cập được ứng dụng.
      </ModalBody>
      <ModalFooter>
        <Button id="jhi-confirm-lock-user" data-cy="entityLockUserButton" color="danger" onClick={lockUser}>
          &nbsp; Có
        </Button>
        <Button color="secondary" onClick={handleClose}>
          &nbsp; Không
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ users, wfRequest }: IRootState) => ({
  userEntity: users.entity,
  updateSuccess: users.updateSuccess,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserLockModal);
