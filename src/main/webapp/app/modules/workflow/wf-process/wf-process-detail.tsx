import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './wf-process.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IWfProcessDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const WfProcessDetail = (props: IWfProcessDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { wfProcessEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="wfProcessDetailsHeading">WfProcess</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{wfProcessEntity.id}</dd>
          <dt>
            <span id="type">Type</span>
          </dt>
          <dd>{wfProcessEntity.type}</dd>
          <dt>
            <span id="status">Status</span>
          </dt>
          <dd>{wfProcessEntity.status}</dd>
          <dt>Wf Process Group</dt>
          <dd>{wfProcessEntity.wfProcessGroup ? wfProcessEntity.wfProcessGroup.name : ''}</dd>
          <dt>Authority</dt>
          <dd>{wfProcessEntity.authority ? wfProcessEntity.authority.name : ''}</dd>
        </dl>
        <Button tag={Link} to="/wf-process" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/wf-process/${wfProcessEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ wfProcess }: IRootState) => ({
  wfProcessEntity: wfProcess.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WfProcessDetail);
