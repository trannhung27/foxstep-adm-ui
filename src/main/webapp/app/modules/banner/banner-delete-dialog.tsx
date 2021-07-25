import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { createEntity } from './banner.reducer';

export interface IBannerDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const BannerDeleteDialog = (props: IBannerDeleteDialogProps) => {
  const handleClose = () => {
    props.history.push('/banner');
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = () => {
    const entity = {
      id: parseInt(props.match.params.id, 10),
    };
    props.createEntity(entity);
  };

  const { updating } = props;

  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="bannerDeleteDialogHeading">
        Xác nhận xóa
      </ModalHeader>
      <ModalBody id="foxstep2AdminUiApp.banner.delete.question">Bạn có chắc muốn gỡ Banner này?</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Hủy
        </Button>
        <Button id="jhi-confirm-delete-banner" color="danger" onClick={saveEntity} disabled={updating}>
          <FontAwesomeIcon icon="trash" />
          &nbsp; Gỡ
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ banner }: IRootState) => ({
  updating: banner.updating,
  updateSuccess: banner.updateSuccess,
});

const mapDispatchToProps = { createEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BannerDeleteDialog);
