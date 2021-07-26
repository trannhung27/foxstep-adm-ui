import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Modal } from 'reactstrap';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

export interface IParticipantApproveDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ParticipantApproveDialog = (props: IParticipantApproveDialogProps) => {
  const handleClose = () => {
    props.history.push(`/challenges/${props.match.params.id}/participants`);
  };

  return <Modal isOpen toggle={handleClose}></Modal>;
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantApproveDialog);
