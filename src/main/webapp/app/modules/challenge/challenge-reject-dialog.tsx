import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { WfProcessType, WfProcessGroup, WfActionType } from '../../config/constants';
import { Row } from 'reactstrap';
import { IRootState } from 'app/shared/reducers';
import { getEntity } from './challenge.reducer';
import { approveChallenge as reject } from './challenge.reducer';

export interface IChallengeRejectDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ChallengeRejectDialog = (props: IChallengeRejectDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/challenges/' + props.match.params.id);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const rejectChallenge = () => {
    const entity = {
      processGroupId: WfProcessGroup.CHALLENGE,
      processTypeId: WfProcessType.ADD,
      actionType: WfActionType.DENY,
      contentId: Number(challengeEntity.id),

      attachmentUrl: '',
      requestNote: '',
      requestData: '',
      actionNote: actionMessage,
    };
    props.reject(challengeEntity.id, entity);
  };
  const { challengeEntity } = props;
  const [actionMessage, setActionMessage] = useState('');
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="challengeRejectDialogHeading">
        Từ chối duyệt thử thách
      </ModalHeader>
      <ModalBody id="foxstep2AdminWebappApp.challenge.delete.question">
        <Row style={{ marginLeft: '1px' }}>Bạn có chắc muốn từ chối yêu cầu thử thách từ cá nhân?</Row>
        <Row style={{ marginLeft: '1px' }}>
          Lý do: <text style={{ color: 'red' }}>*</text>
        </Row>
        <Row>
          <input
            style={{ width: '500px', height: '180px', margin: '10px' }}
            type="string"
            onChange={event => {
              setActionMessage(event.target.value);
            }}
          ></input>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button id="jhi-confirm-delete-challenge" data-cy="entityConfirmDeleteButton" color="danger" onClick={rejectChallenge}>
          Xác nhận
        </Button>
        <Button color="secondary" onClick={handleClose}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ challenge, wfRequest }: IRootState) => ({
  challengeEntity: challenge.entity,
  updateSuccess: wfRequest.updateSuccess,
});

const mapDispatchToProps = { getEntity, reject };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeRejectDialog);
