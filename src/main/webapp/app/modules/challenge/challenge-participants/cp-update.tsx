import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { matchPath } from 'react-router';
import { createJoinRequest } from 'app/modules/challenge/challenge-participants/cp-reducer';
import { getEntity } from 'app/modules/challenge/challenge.reducer';
import { IChallengeUserStatistic } from 'app/shared/model/join-challenge/challenge-user-statistic.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export interface IParticipantUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ParticipantUpdate = (props: IParticipantUpdateProps) => {
  const currentMatch = matchPath<{ challengesId: string }>(props.location.pathname, {
    path: '/challenges/:challengesId/participants/new',
    exact: true,
    strict: false,
  });

  useEffect(() => {
    props.getEntity(currentMatch.params.challengesId);
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const handleClose = () => {
    props.history.push(`/challenges/${currentMatch.params.challengesId}/participants`);
  };

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity: IChallengeUserStatistic = {
        distanceTarget: values.distanceTarget,
        teamId: values.teamId,
        challenge: {
          id: challenge.id,
        },
        user: {
          email: values.email,
        },
      };
      props.createJoinRequest(entity);
    }
  };

  const { challenge, updating } = props;

  return (
    <Modal isOpen toggle={handleClose}>
      <AvForm onSubmit={saveEntity}>
        <ModalHeader toggle={handleClose}>Thêm thành viên</ModalHeader>
        <ModalBody>
          <AvGroup>
            <Label id="emailLabel" for="email">
              Email:
            </Label>
            <AvField
              id="email"
              type="email"
              name="email"
              placeholder="email@address.com"
              validate={{
                required: { value: true, errorMessage: 'Không được để trống.' },
              }}
            />
          </AvGroup>
          <AvGroup>
            <Label for="distanceTarget">Hạng mục:</Label>
            <AvInput
              id="distanceTarget"
              type="select"
              className="form-control"
              name="distanceTarget"
              validate={{
                required: { value: true, errorMessage: 'Không được để trống.' },
              }}
            >
              <option value="" key="0">
                --Chọn hạng mục--
              </option>
              {challenge && challenge.challengeDistance
                ? challenge.challengeDistance.map(otherEntity => (
                    <option value={otherEntity.distance} key={otherEntity.id}>
                      {otherEntity.distance / 1000}&nbsp;km
                    </option>
                  ))
                : null}
            </AvInput>
          </AvGroup>
          <AvGroup>
            <Label for="teamId">Nhóm:</Label>
            <AvInput
              id="teamId"
              type="select"
              className="form-control"
              name="teamId"
              validate={{
                required: { value: true, errorMessage: 'Không được để trống.' },
              }}
            >
              <option value="" key="0">
                --Chọn nhóm--
              </option>
              {challenge && challenge.teams
                ? challenge.teams.map(otherEntity => (
                    <option
                      value={otherEntity.id}
                      key={otherEntity.id}
                      disabled={challenge.numPerTeam && otherEntity.users.length >= challenge.numPerTeam}
                    >
                      {otherEntity.name}&nbsp; ({otherEntity.users.length}
                      {challenge.numPerTeam ? '/' + challenge.numPerTeam : ''})
                    </option>
                  ))
                : null}
            </AvInput>
          </AvGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleClose}>
            <FontAwesomeIcon icon="ban" />
            &nbsp; Hủy
          </Button>
          <Button id="jhi-confirm" color="primary" type="submit" disabled={updating}>
            <FontAwesomeIcon icon={faCheck} />
            &nbsp; Thêm
          </Button>
        </ModalFooter>
      </AvForm>
    </Modal>
  );
};

const mapStateToProps = ({ challengeParticipant, challenge }: IRootState) => ({
  updating: challengeParticipant.updating,
  updateSuccess: challengeParticipant.updateSuccess,
  challenge: challenge.entity,
});

const mapDispatchToProps = {
  createJoinRequest,
  getEntity,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantUpdate);
