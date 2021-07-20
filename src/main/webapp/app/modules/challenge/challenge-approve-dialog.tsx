import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { WfProcessType, WfProcessGroup, WfActionType } from '../../config/constants';
import { IRootState } from 'app/shared/reducers';
import { getEntity } from './challenge.reducer';
import { approveChallenge as approve } from './challenge.reducer';

export interface IChallengeApproveDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ChallengeApproveDialog = (props: IChallengeApproveDialogProps) => {
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

  const { challengeEntity } = props;

  const approveChallenge = () => {
    const entity = {
      processGroupId: WfProcessGroup.CHALLENGE,
      processTypeId: WfProcessType.ADD,
      actionType: WfActionType.APPV,
      contentId: Number(challengeEntity.id),

      attachmentUrl: '',
      requestNote: '',
      requestData: '',
      actionNote: '',
    };
    props.approve(challengeEntity.id, entity);
  };

  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="challengeApproveDialogHeading">
        Duyệt thử thách
      </ModalHeader>
      <ModalBody id="foxstep2AdminWebappApp.challenge.delete.question">
        Bạn có chắc muốn duyệt yêu cầu thử thách từ cá nhân? Sau khi duyệt thử thách, thử thách sẽ được công khai.
      </ModalBody>
      <ModalFooter>
        <Button id="jhi-confirm-delete-challenge" data-cy="entityApproveChallengeButton" color="danger" onClick={approveChallenge}>
          &nbsp; Có
        </Button>
        <Button color="secondary" onClick={handleClose}>
          &nbsp; Không
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ challenge, wfRequest }: IRootState) => ({
  challengeEntity: challenge.entity,
  updateSuccess: challenge.updateSuccess,
});

const mapDispatchToProps = { getEntity, approve };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeApproveDialog);
