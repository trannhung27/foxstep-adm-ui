import { Link, RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { getEntity } from './CfgVo2Rule.reducer';

import React, { useEffect } from 'react';
import { Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';

export interface ICfgVo2RuleDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

const mapStateToProps = ({ cfgVo2Rule }: IRootState) => ({
  cfgVo2RuleEntity: cfgVo2Rule.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export const CfgVo2RuleDetail = (props: ICfgVo2RuleDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { cfgVo2RuleEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="cfgVo2RuleDetailsHeading">CFG VO2 Rule</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{cfgVo2RuleEntity.id}</dd>
          <dt>
            <span id="calType">Cal Type</span>
          </dt>
          <dd>{cfgVo2RuleEntity.calType}</dd>
          <dt>
            <span id="fromDistance">From Distance</span>
          </dt>
          <dd>{cfgVo2RuleEntity.fromDistance}</dd>
          <dt>
            <span id="toDistance">To Distance</span>
          </dt>
          <dd>{cfgVo2RuleEntity.toDistance}</dd>
          <dt>
            <span id="point">Point</span>
          </dt>
          <dd>{cfgVo2RuleEntity.point}</dd>
        </dl>
        <Button tag={Link} to="/entity/cfgvo2rule" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/entity/cfgvo2rule/${cfgVo2RuleEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CfgVo2RuleDetail);
