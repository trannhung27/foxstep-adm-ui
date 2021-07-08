import { getEntity, deleteEntity } from './CfgLevelInfo.reducer';
import { IRootState } from 'app/shared/reducers';
import { RouteComponentProps } from 'react-router-dom';

import React, { useEffect } from 'react';

import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';

export interface ICfgLevelInfoDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

const mapStateToProps = ({ cfgLevelInfo }: IRootState) => ({
  cfgLevelInfoEntity: cfgLevelInfo.entity,
  updateSuccess: cfgLevelInfo.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export const CfgLevelInfoDeleteDialog = (props: ICfgLevelInfoDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/entity/cfglevelinfo');
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.cfgLevelInfoEntity.id);
  };

  const { cfgLevelInfoEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="cfgLevelInfoDeleteDialogHeading">
        Confirm delete operation
      </ModalHeader>
      <ModalBody id="foxstep2AdminApp.cfgLevelInfo.delete.question">Are you sure you want to delete this CFG Level Info?</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Cancel
        </Button>
        <Button id="jhi-confirm-delete-cfgLevelInfo" data-cy="entityConfirmDeleteButton" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp; Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CfgLevelInfoDeleteDialog);