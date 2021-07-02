import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactHtmlParser from 'react-html-parser';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './faq.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT, APP_TIMESTAMP_FORMAT, NEWS_STATUSES } from 'app/config/constants';
import { TextFormat } from 'react-jhipster';
import { Col, Row } from 'antd';

export interface IFaqDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const FaqDetail = (props: IFaqDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { faqEntity } = props;
  return (
    <div>
      <div className="text-center">{faqEntity.imgUrl ? <img src={faqEntity.imgUrl} alt="" width="100%" /> : ''}</div>
      <div>
        <h2 style={{ display: 'inline' }}>{faqEntity.title}</h2>
        {faqEntity.status === NEWS_STATUSES.ACTIVE ? (
          <Badge color="success">Đang hoạt động</Badge>
        ) : (
          <Badge color="danger">Không hoạt động</Badge>
        )}
        <p className="mb-2 text-muted">
          <TextFormat type="date" value={faqEntity.datePublished} format={APP_TIMESTAMP_FORMAT} />
        </p>
      </div>
      <div>
        <i className="mb-2">{faqEntity.description}</i>
        <div>{ReactHtmlParser(faqEntity.content)}</div>
        <Row className="justify-content-end">
          <Col>
            <h6>{faqEntity.user ? faqEntity.user.email : ''}</h6>
          </Col>
        </Row>
      </div>
      <Button tag={Link} to="/faqs" replace color="info" data-cy="entityDetailsBackButton">
        <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Quay lại</span>
      </Button>
      &nbsp;
      <Button tag={Link} to={`/faqs/${faqEntity.id}/edit`} replace color="primary">
        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Sửa</span>
      </Button>
    </div>
  );
};

const mapStateToProps = ({ faqs }: IRootState) => ({
  faqEntity: faqs.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(FaqDetail);
