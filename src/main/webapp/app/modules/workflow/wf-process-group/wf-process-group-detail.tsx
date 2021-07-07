import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './wf-process-group.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IWfProcessGroupDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const WfProcessGroupDetail = (props: IWfProcessGroupDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { wfProcessGroupEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="wfProcessGroupDetailsHeading">WfProcessGroup</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{wfProcessGroupEntity.id}</dd>
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{wfProcessGroupEntity.name}</dd>
          <dt>
            <span id="status">Status</span>
          </dt>
          <dd>{wfProcessGroupEntity.status}</dd>
        </dl>
        <Button tag={Link} to="/wf-process-group" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/wf-process-group/${wfProcessGroupEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ wfProcessGroup }: IRootState) => ({
  wfProcessGroupEntity: wfProcessGroup.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WfProcessGroupDetail);
