import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './faq.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT, APP_TIMESTAMP_FORMAT } from 'app/config/constants';

export interface IFaqDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const FaqDetail = (props: IFaqDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { faqEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="FAQDetailsHeading">Faq/Hướng dẫn</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{faqEntity.id}</dd>
          <dt>
            <span id="content">Nội dung</span>
          </dt>
          <dd>{faqEntity.content}</dd>
          <dt>
            <span id="description">Tóm tắt</span>
          </dt>
          <dd>{faqEntity.description}</dd>
          <dt>
            <span id="title">Tiêu đề</span>
          </dt>
          <dd>{faqEntity.title}</dd>
          <dt>
            <span id="imgUrl">Ảnh</span>
          </dt>
          <dd>{faqEntity.imgUrl}</dd>
          <dt>
            <span id="datePublished">Thời gian đăng bài</span>
          </dt>
          <dd>{faqEntity.datePublished ? <TextFormat value={faqEntity.datePublished} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="status">Trạng thái</span>
          </dt>
          <dd>{faqEntity.status}</dd>
          <dt>Phân loại</dt>
          <dd>{faqEntity.newsCategory ? faqEntity.newsCategory.name : ''}</dd>
          <dt>Người tạo</dt>
          <dd>{faqEntity.user ? faqEntity.user.email : ''}</dd>
        </dl>
        <Button tag={Link} to="/faq" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Quay lại</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/faq/${faqEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Sửa</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ news }: IRootState) => ({
  faqEntity: news.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(FaqDetail);
