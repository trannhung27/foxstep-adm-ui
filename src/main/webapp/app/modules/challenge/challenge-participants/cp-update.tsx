import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';

export interface IParticipantUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ParticipantUpdate = (props: IParticipantUpdateProps) => {
  const handleClose = () => {
    props.history.push(`/challenges/${props.match.params.id}/participants`);
  };

  return <Modal isOpen toggle={handleClose}></Modal>;
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantUpdate);
