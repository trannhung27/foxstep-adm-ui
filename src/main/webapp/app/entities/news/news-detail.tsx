import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './news.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface INewsDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const NewsDetail = (props: INewsDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { newsEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="postDetailsHeading">News</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{newsEntity.id}</dd>
          <dt>
            <span id="title">Title</span>
          </dt>
          <dd>{newsEntity.title}</dd>
          <dt>
            <span id="content">Content</span>
          </dt>
          <dd>{newsEntity.content}</dd>
          <dt>
            <span id="content">Desc</span>
          </dt>
          <dd>{newsEntity.desc}</dd>
          <dt>
            <span id="content">Type</span>
          </dt>
          <dd>{newsEntity.typeId}</dd>
          <dt>
            <span id="creationDate">Creation Date</span>
          </dt>
          <dd>
            {newsEntity.dateCreated ? <TextFormat value={newsEntity.dateCreated} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}
          </dd>

          <dt>
            <span id="creationDate">Updated Date</span>
          </dt>
          <dd>
            {newsEntity.dateUpdated ? <TextFormat value={newsEntity.dateUpdated} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}
          </dd>
          <dt>User</dt>
          <dd>{newsEntity.user ? newsEntity.user.login : ''}</dd>
          <dt>Category</dt>
          <dd>{newsEntity.category ? newsEntity.category.name : ''}</dd>
        </dl>
        <Button tag={Link} to="/entity/news" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/entity/news/${newsEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
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
