import { Link, RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { getEntity } from './CfgLevelInfo.reducer';

import React, { useEffect } from 'react';
import { Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';

export interface ICfgLevelInfoDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

const mapStateToProps = ({ cfgLevelInfo }: IRootState) => ({
  cfgLevelInfoEntity: cfgLevelInfo.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export const CfgLevelInfoDetail = (props: ICfgLevelInfoDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { cfgLevelInfoEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="cfgLevelInfoDetailsHeading">CFG Level Info</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{cfgLevelInfoEntity.id}</dd>
          <dt>
            <span id="minPoint">Min Point</span>
          </dt>
          <dd>{cfgLevelInfoEntity.minPoint}</dd>
          <dt>
            <span id="maxPoint">Max Point</span>
          </dt>
          <dd>{cfgLevelInfoEntity.maxPoint}</dd>
          <dt>
            <span id="level">Level</span>
          </dt>
          <dd>{cfgLevelInfoEntity.level}</dd>
        </dl>
        <Button tag={Link} to="/entity/cfglevelinfo" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/entity/cfglevelinfo/${cfgLevelInfoEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CfgLevelInfoDetail);
