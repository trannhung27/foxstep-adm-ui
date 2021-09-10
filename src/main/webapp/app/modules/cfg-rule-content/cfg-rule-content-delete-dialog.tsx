import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './cfg-rule-content.reducer';
import { CfgRuleContentDetail } from './cfg-rule-content-detail';

export interface ICfgRuleContentDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const CfgRuleContentDeleteDialog = (props: ICfgRuleContentDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/cfg-rule-content');
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.cfgRuleContentEntity.id);
  };

  const { cfgRuleContentEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="cfgRuleContentDeleteDialogHeading">
        Xác nhận xóa
      </ModalHeader>
      <ModalBody id="foxstep2AdminUiApp.cfgRuleContent.delete.question">Bạn có chắc muốn xóa bộ môn này?</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Hủy
        </Button>
        <Button id="jhi-confirm-delete-sport" data-cy="entityConfirmDeleteButton" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp; Xóa
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ cfgRuleContent }: IRootState) => ({
  cfgRuleContentEntity: cfgRuleContent.entity,
  updateSuccess: cfgRuleContent.updateSuccess,
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CfgRuleContentDeleteDialog);
