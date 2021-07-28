import React, { useEffect } from 'react';
import { matchPath } from 'react-router';

import { RouteComponentProps } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { approveJoinRequest } from 'app/modules/challenge/challenge-participants/cp-reducer';
import { WfActionType, WfProcessGroup, WfProcessType } from 'app/config/constants';
import { IWfRequest } from 'app/shared/model/workflow/wf-request.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export interface IParticipantApproveDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string; requestId: string }> {}

export const ParticipantApproveDialog = (props: IParticipantApproveDialogProps) => {
  const currentMatch = matchPath<{ challengesId: string; requestId: string }>(props.location.pathname, {
    path: '/challenges/:challengesId/participants/:requestId/approve',
    exact: true,
    strict: false,
  });

  const handleClose = () => {
    props.history.push(`/challenges/${currentMatch.params.challengesId}/participants`);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const approve = () => {
    const entity: IWfRequest = {
      processGroupId: WfProcessGroup.CHALLENGE_USER,
      processTypeId: WfProcessType.ADD,
      actionType: WfActionType.APPV,
      contentId: parseInt(currentMatch.params.requestId, 10),
    };
    props.approveJoinRequest(entity, { challengeId: currentMatch.params.challengesId });
  };

  const { updating } = props;

  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="approveDialogHeading">
        Duyệt tham gia
      </ModalHeader>
      <ModalBody id="approveQuestion">Duyệt yêu cầu tham gia này?</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Hủy
        </Button>
        <Button id="jhi-confirm" color="primary" onClick={approve} disabled={updating}>
          <FontAwesomeIcon icon={faCheck} />
          &nbsp; Duyệt
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

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantApproveDialog);
