import { getEntity, deleteEntity } from './CfgVo2ChallengeRule.reducer';
import { IRootState } from 'app/shared/reducers';
import { RouteComponentProps } from 'react-router-dom';

import React, { useEffect } from 'react';

import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';

export interface ICfgVo2ChallengeRuleDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

const mapStateToProps = ({ cfgVo2ChallengeRule }: IRootState) => ({
  cfgVo2ChallengeRuleEntity: cfgVo2ChallengeRule.entity,
  updateSuccess: cfgVo2ChallengeRule.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export const CfgVo2ChallengeRuleDeleteDialog = (props: ICfgVo2ChallengeRuleDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/entity/cfgvo2challengerule');
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.cfgVo2ChallengeRuleEntity.id);
  };

  const { cfgVo2ChallengeRuleEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="cfgVo2ChallengeRuleDeleteDialogHeading">
        Confirm delete operation
      </ModalHeader>
      <ModalBody id="foxstep2AdminApp.cfgVo2ChallengeRule.delete.question">Are you sure you want to delete this CFG VO2 Challenge Rule?</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Cancel
        </Button>
        <Button id="jhi-confirm-delete-cfgVo2ChallengeRule" data-cy="entityConfirmDeleteButton" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp; Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CfgVo2ChallengeRuleDeleteDialog);