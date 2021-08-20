import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './sport.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { Descriptions, PageHeader } from 'antd';

export interface ISportDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SportDetail = (props: ISportDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { sportEntity } = props;
  return (
    <div>
      <PageHeader style={{ padding: '0 0' }} className="site-page-header" title="Chi tiết bộ môn" onBack={() => props.history.goBack()}>
        <Descriptions size="default" column={1}>
          <Descriptions.Item label="ID">{sportEntity.id}</Descriptions.Item>
          <Descriptions.Item label="Tên">{sportEntity.name}</Descriptions.Item>
        </Descriptions>
      </PageHeader>

      <Button tag={Link} to={`/sport/${sportEntity.id}/edit`} replace color="primary">
        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Sửa</span>
      </Button>
    </div>
  );
};

const mapStateToProps = ({ sport }: IRootState) => ({
  sportEntity: sport.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SportDetail);
