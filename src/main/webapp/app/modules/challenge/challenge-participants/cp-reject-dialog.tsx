import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { matchPath } from 'react-router';
import { IWfRequest } from 'app/shared/model/workflow/wf-request.model';
import { WfActionType, WfProcessGroup, WfProcessType } from 'app/config/constants';
import { approveJoinRequest } from 'app/modules/challenge/challenge-participants/cp-reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

export interface IParticipantRejectDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string; requestId: string }> {}

export const ParticipantRejectDialog = (props: IParticipantRejectDialogProps) => {
  const currentMatch = matchPath<{ challengesId: string; requestId: string }>(props.location.pathname, {
    path: '/challenges/:challengesId/participants/:requestId/reject',
    exact: true,
    strict: false,
  });

  const handleClose = () => {
    props.history.goBack();
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const [actionMessage, setActionMessage] = useState('');

  const reject = () => {
    const entity: IWfRequest = {
      processGroupId: WfProcessGroup.CHALLENGE_USER,
      processTypeId: WfProcessType.ADD,
      actionType: WfActionType.DENY,
      contentId: parseInt(currentMatch.params.requestId, 10),
      requestNote: actionMessage,
    };
    props.approveJoinRequest(entity, { challengeId: currentMatch.params.challengesId });
  };

  const { updating } = props;

  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="rejectDialogHeading">
        Từ chối yêu cầu
      </ModalHeader>
      <ModalBody id="approveQuestion">
        <p>Từ chối yêu cầu tham gia này?</p>
        <FormGroup>
          <Label>Lý do:</Label>
          <Input type="textarea" placeholder="Aa" onChange={e => setActionMessage(e.target.value)} />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Hủy
        </Button>
        <Button id="jhi-confirm" color="danger" onClick={reject} disabled={updating}>
          <FontAwesomeIcon icon={faCheck} />
          &nbsp; Từ chối
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ challengeParticipant }: IRootState) => ({
  updating: challengeParticipant.updating,
  updateSuccess: challengeParticipant.updateSuccess,
});

const mapDispatchToProps = {
  approveJoinRequest,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantRejectDialog);
