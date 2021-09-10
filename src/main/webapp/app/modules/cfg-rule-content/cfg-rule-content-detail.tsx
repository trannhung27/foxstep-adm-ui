import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './cfg-rule-content.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { Descriptions, PageHeader } from 'antd';

export interface ICfgRuleContentDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const CfgRuleContentDetail = (props: ICfgRuleContentDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { cfgRuleContentEntity } = props;
  return (
    <div>
      <PageHeader style={{ padding: '0 0' }} className="site-page-header" title="Chi tiết điều khoản" onBack={() => props.history.goBack()}>
        <Descriptions size="default" column={1}>
          <Descriptions.Item label="ID">{cfgRuleContentEntity.id}</Descriptions.Item>
          <Descriptions.Item label="Nội dung">{cfgRuleContentEntity.content}</Descriptions.Item>
          <Descriptions.Item label="Kiểu">{cfgRuleContentEntity.type===1?"Điều khoản":
                      (cfgRuleContentEntity.type===2?"Chính sách bảo mật":"")}</Descriptions.Item>
        </Descriptions>
      </PageHeader>

      <Button tag={Link} to={`/cfg-rule-content/${cfgRuleContentEntity.id}/edit`} replace color="primary">
        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Sửa</span>
      </Button>
    </div>
  );
};

const mapStateToProps = ({ cfgRuleContent }: IRootState) => ({
  cfgRuleContentEntity: cfgRuleContent.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CfgRuleContentDetail);
