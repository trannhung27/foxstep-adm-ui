import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './users.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IUsersDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UsersDetail = (props: IUsersDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { usersEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="usersDetailsHeading">Users</h2>
        <dl>
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{usersEntity.id}</dd>
          <dt>
            <span id="email">Email</span>
          </dt>
          <dd>{usersEntity.email}</dd>
          <dt>
            <span id="fullName">Full Name</span>
          </dt>
          <dd>{usersEntity.fullName}</dd>
          <dt>
            <span id="firstName">First Name</span>
          </dt>
          <dd>{usersEntity.firstName}</dd>
          <dt>
            <span id="lastName">Last Name</span>
          </dt>
          <dd>{usersEntity.lastName}</dd>
          <dt>
            <span id="nickName">Nick Name</span>
          </dt>
          <dd>{usersEntity.nickName}</dd>
          <dt>
            <span id="nationalIdNumber">National Id Number</span>
          </dt>
          <dd>{usersEntity.nationalIdNumber}</dd>
          <dt>
            <span id="mobilePhone">Mobile Phone</span>
          </dt>
          <dd>{usersEntity.mobilePhone}</dd>
          <dt>
            <span id="gender">Gender</span>
          </dt>
          <dd>{usersEntity.gender}</dd>
          <dt>
            <span id="birthday">Birthday</span>
          </dt>
          <dd>{usersEntity.birthday ? <TextFormat value={usersEntity.birthday} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="shirtSize">Shirt Size</span>
          </dt>
          <dd>{usersEntity.shirtSize}</dd>
          <dt>
            <span id="height">Height</span>
          </dt>
          <dd>{usersEntity.height}</dd>
          <dt>
            <span id="weight">Weight</span>
          </dt>
          <dd>{usersEntity.weight}</dd>
          <dt>
            <span id="idProvince">Id Province</span>
          </dt>
          <dd>{usersEntity.idProvince}</dd>
          <dt>
            <span id="idDistrict">Id District</span>
          </dt>
          <dd>{usersEntity.idDistrict}</dd>
          <dt>
            <span id="idWard">Id Ward</span>
          </dt>
          <dd>{usersEntity.idWard}</dd>
          <dt>
            <span id="strAddress">Str Address</span>
          </dt>
          <dd>{usersEntity.strAddress}</dd>
          <dt>
            <span id="bib">Bib</span>
          </dt>
          <dd>{usersEntity.bib}</dd>
          <dt>
            <span id="imageUrl">Image Url</span>
          </dt>
          <dd>{usersEntity.imageUrl}</dd>
          <dt>
            <span id="status">Status</span>
          </dt>
          <dd>{usersEntity.status}</dd>
          <dt>
            <span id="dateCreated">Date Created</span>
          </dt>
          <dd>{usersEntity.dateCreated ? <TextFormat value={usersEntity.dateCreated} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="dateUpdated">Date Updated</span>
          </dt>
          <dd>{usersEntity.dateUpdated ? <TextFormat value={usersEntity.dateUpdated} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>User Position</dt>
          <dd>{usersEntity.userPosition ? usersEntity.userPosition.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/users" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        {/*<Button tag={Link} to={`/users/${usersEntity.id}/edit`} replace color="primary">*/}
        {/*  <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>*/}
        {/*</Button>*/}
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ users }: IRootState) => ({
  usersEntity: users.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UsersDetail);
