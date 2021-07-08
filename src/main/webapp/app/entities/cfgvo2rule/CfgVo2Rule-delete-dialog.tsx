import { getEntity, deleteEntity } from './CfgVo2Rule.reducer';
import { IRootState } from 'app/shared/reducers';
import { RouteComponentProps } from 'react-router-dom';

import React, { useEffect } from 'react';

import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';

export interface ICfgVo2RuleDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

const mapStateToProps = ({ cfgVo2Rule }: IRootState) => ({
  cfgVo2RuleEntity: cfgVo2Rule.entity,
  updateSuccess: cfgVo2Rule.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export const CfgVo2RuleDeleteDialog = (props: ICfgVo2RuleDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/entity/cfgvo2rule');
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.cfgVo2RuleEntity.id);
  };

  const { cfgVo2RuleEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="cfgVo2RuleDeleteDialogHeading">
        Confirm delete operation
      </ModalHeader>
      <ModalBody id="foxstep2AdminApp.cfgVo2Rule.delete.question">Are you sure you want to delete this CFG VO2 Rule?</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Cancel
        </Button>
        <Button id="jhi-confirm-delete-cfgVo2Rule" data-cy="entityConfirmDeleteButton" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp; Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CfgVo2RuleDeleteDialog);