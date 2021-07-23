import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import parse from 'html-react-parser';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './news.reducer';
import { APP_TIMESTAMP_FORMAT, NEWS_STATUSES } from 'app/config/constants';
import { Descriptions, PageHeader, Tag } from 'antd';
import { TextFormat } from 'react-jhipster';

export interface INewsDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const NewsDetail = (props: INewsDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { newsEntity } = props;

  return (
    <div>
      <PageHeader
        style={{ padding: '0 0' }}
        title={newsEntity.title}
        className="site-page-header"
        extra={[
          <Button key="0" tag={Link} to={`/news/${newsEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Sửa</span>
          </Button>,
          <Button key="1" tag={Link} to="/news" replace color="info" data-cy="entityDetailsBackButton">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Quay lại</span>
          </Button>,
        ]}
      >
        <Descriptions size="small" column={1}>
          <Descriptions.Item label="Người tạo">{newsEntity.user ? newsEntity.user.firstName : ''}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {NEWS_STATUSES.map(status =>
              status.id === newsEntity.status ? <Tag color={status.id === 1 ? 'green' : 'red'}>{status.name}</Tag> : null
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian đăng">
            <TextFormat type="date" value={newsEntity.datePublished} format={APP_TIMESTAMP_FORMAT} />
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <div>
        <div className="text-center">{newsEntity.imgUrl ? <img src={newsEntity.imgUrl} alt="" width="40%" /> : ''}</div>
        <p className="m-4 text-muted text-center">
          <i>{newsEntity.description}</i>
        </p>
        <div>{newsEntity.content && parse(newsEntity.content)}</div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ news }: IRootState) => ({
  newsEntity: news.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(NewsDetail);
