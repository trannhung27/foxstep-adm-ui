import { Link, RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { getEntity } from './CfgVo2ChallengeRule.reducer';

import React, { useEffect } from 'react';
import { Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';

export interface ICfgVo2ChallengeRuleDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

const mapStateToProps = ({ cfgVo2ChallengeRule }: IRootState) => ({
  cfgVo2ChallengeRuleEntity: cfgVo2ChallengeRule.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export const CfgVo2ChallengeRuleDetail = (props: ICfgVo2ChallengeRuleDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { cfgVo2ChallengeRuleEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="cfgVo2ChallengeRuleDetailsHeading">CFG VO2 Challenge Rule</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{cfgVo2ChallengeRuleEntity.id}</dd>
          <dt>
            <span id="minParticipant">Min Participant</span>
          </dt>
          <dd>{cfgVo2ChallengeRuleEntity.minParticipant}</dd>
          <dt>
            <span id="minComplete">Min Complete</span>
          </dt>
          <dd>{cfgVo2ChallengeRuleEntity.minComplete}</dd>
          <dt>
            <span id="calType">Cal Type</span>
          </dt>
          <dd>{cfgVo2ChallengeRuleEntity.calType}</dd>
        </dl>
        <Button tag={Link} to="/entity/cfgvo2challengerule" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/entity/cfgvo2challengerule/${cfgVo2ChallengeRuleEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CfgVo2ChallengeRuleDetail);
