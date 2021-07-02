import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Badge, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactHtmlParser from 'react-html-parser';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './news.reducer';
import { APP_TIMESTAMP_FORMAT, NEWS_STATUSES } from 'app/config/constants';
import { Col, Row } from 'antd';
import { TextFormat } from 'react-jhipster';

export interface INewsDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const NewsDetail = (props: INewsDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { newsEntity } = props;

  return (
    <div>
      <div className="text-center">{newsEntity.imgUrl ? <img src={newsEntity.imgUrl} alt="" width="100%" /> : ''}</div>
      <div>
        <h2 style={{ display: 'inline' }}>{newsEntity.title}</h2>
        {newsEntity.status === NEWS_STATUSES.ACTIVE ? (
          <Badge color="success">Đang hoạt động</Badge>
        ) : (
          <Badge color="danger">Không hoạt động</Badge>
        )}
        <p className="mb-2 text-muted">
          <TextFormat type="date" value={newsEntity.datePublished} format={APP_TIMESTAMP_FORMAT} />
        </p>
      </div>
      <div>
        <i className="mb-2">{newsEntity.description}</i>
        <div>{ReactHtmlParser(newsEntity.content)}</div>
        <Row className="justify-content-end">
          <Col>
            <h6>{newsEntity.user ? newsEntity.user.email : ''}</h6>
          </Col>
        </Row>
      </div>
      <Button tag={Link} to="/news" replace color="info" data-cy="entityDetailsBackButton">
        <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Quay lại</span>
      </Button>
      &nbsp;
      <Button tag={Link} to={`/news/${newsEntity.id}/edit`} replace color="primary">
        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Sửa</span>
      </Button>
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
