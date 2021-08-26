import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { matchPath } from 'react-router';
import { cancelJoinRequest } from 'app/modules/challenge/challenge-participants/cp-reducer';
import { IWfRequest } from 'app/shared/model/workflow/wf-request.model';
import { WfActionType, WfProcessGroup, WfProcessType } from 'app/config/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export interface IParticipantRemoveDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string; requestId: string }> {}

export const ParticipantRemoveDialog = (props: IParticipantRemoveDialogProps) => {
  const currentMatch = matchPath<{ challengesId: string; requestId: string }>(props.location.pathname, {
    path: '/challenges/:challengesId/participants/:requestId/remove',
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

  const remove = () => {
    const entity: IWfRequest = {
      processGroupId: WfProcessGroup.CHALLENGE_USER,
      processTypeId: WfProcessType.ADD,
      actionType: WfActionType.CANCEL,
      contentId: parseInt(currentMatch.params.requestId, 10),
    };
    props.cancelJoinRequest(entity, { challengeId: currentMatch.params.challengesId });
  };

  const { updating } = props;

  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="removeDialogHeading">
        Hủy tham gia
      </ModalHeader>
      <ModalBody id="removeQuestion">Xóa thành viên này?</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Hủy
        </Button>
        <Button id="jhi-confirm" color="danger" onClick={remove} disabled={updating}>
          <FontAwesomeIcon icon={faCheck} />
          &nbsp; Xóa
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
  cancelJoinRequest,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantRemoveDialog);
