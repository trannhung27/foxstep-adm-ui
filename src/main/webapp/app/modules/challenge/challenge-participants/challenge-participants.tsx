import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ChallengeDetail, IChallengeDetailProps } from 'app/modules/challenge/challenge-detail';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';

export interface IChallengeParticipantsProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ChallengeParticipants = (props: IChallengeDetailProps) => {
  return <p>challenge participants</p>;
};

const mapStateToProps = (storeState: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeParticipants);
