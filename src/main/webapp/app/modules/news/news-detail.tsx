import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './news.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT, APP_TIMESTAMP_FORMAT } from 'app/config/constants';

export interface INewsDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const NewsDetail = (props: INewsDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { newsEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="newsDetailsHeading">Tin tức</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{newsEntity.id}</dd>
          <dt>
            <span id="content">Nội dung</span>
          </dt>
          <dd>{newsEntity.content}</dd>
          <dt>
            <span id="description">Tóm tắt</span>
          </dt>
          <dd>{newsEntity.description}</dd>
          <dt>
            <span id="title">Tiêu đề</span>
          </dt>
          <dd>{newsEntity.title}</dd>
          <dt>
            <span id="imgUrl">Ảnh</span>
          </dt>
          <dd>{newsEntity.imgUrl}</dd>
          <dt>
            <span id="datePublished">Thời gian đăng bài</span>
          </dt>
          <dd>{newsEntity.datePublished ? <TextFormat value={newsEntity.datePublished} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="status">Trạng thái</span>
          </dt>
          <dd>{newsEntity.status}</dd>
          <dt>Phân loại</dt>
          <dd>{newsEntity.newsCategory ? newsEntity.newsCategory.name : ''}</dd>
          <dt>Người tạo</dt>
          <dd>{newsEntity.user ? newsEntity.user.email : ''}</dd>
        </dl>
        <Button tag={Link} to="/news" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Quay lại</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/news/${newsEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Sửa</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ news }: IRootState) => ({
  newsEntity: news.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(NewsDetail);
