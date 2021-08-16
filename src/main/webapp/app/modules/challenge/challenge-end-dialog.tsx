import React, { useEffect } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { endChallenge } from 'app/modules/challenge/challenge.reducer';

export interface IChallengeEndDialogProps extends StateProps, DispatchProps {
  showModal: boolean;
  onClose: () => void;
}

export const ChallengeEndDialog = (props: IChallengeEndDialogProps) => {
  const handleClose = () => {
    props.onClose();
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const end = () => {
    props.endChallenge(props.challengeEntity.id);
  };

  const { updating } = props;

  return (
    <Modal isOpen={props.showModal} toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="approveDialogHeading">
        Hủy
      </ModalHeader>
      <ModalBody id="approveQuestion">Bạn có chắc muốn kết thúc sớm thử thách?</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Không
        </Button>
        <Button id="jhi-confirm" color="primary" onClick={end} disabled={updating}>
          <FontAwesomeIcon icon={faCheck} />
          &nbsp; Có
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ challenge }: IRootState) => ({
  challengeEntity: challenge.entity,
  updateSuccess: challenge.updateSuccess,
  updating: challenge.updating,
});

const mapDispatchToProps = {
  endChallenge,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeEndDialog);
