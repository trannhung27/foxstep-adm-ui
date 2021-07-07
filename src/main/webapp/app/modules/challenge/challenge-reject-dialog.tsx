import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { WfProcessGroup, WfProcessType, WfActionType } from 'app/config/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row } from 'reactstrap';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './challenge.reducer';
import { update as updateWorkflow } from '../workflow/workflow-request.reducer';

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
      contentId: Number(props.match.params.id),
      actionNote: actionMessage,
    };
    props.updateWorkflow(entity);
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
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Cancel
        </Button>
        <Button id="jhi-confirm-delete-challenge" data-cy="entityConfirmDeleteButton" color="danger" onClick={rejectChallenge}>
          <FontAwesomeIcon icon="trash" />
          &nbsp; Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ challenge, wfRequest }: IRootState) => ({
  challengeEntity: challenge.entity,
  updateSuccess: wfRequest.updateSuccess,
});

const mapDispatchToProps = { getEntity, updateWorkflow };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeRejectDialog);
