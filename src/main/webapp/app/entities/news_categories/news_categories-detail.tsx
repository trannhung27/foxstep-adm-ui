import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate,TextFormat, getSortState, IPaginationBaseState } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { getEntity } from './news_categories.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface INewsCategoriesDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const NewsCategoriesDetail = (props: INewsCategoriesDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { newscategoriesEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="categoryDetailsHeading">News Categories</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{newscategoriesEntity.id}</dd>
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{newscategoriesEntity.name}</dd>
          <dt>
            <span id="description">Creation Date </span>
          </dt>
          <dd>{newscategoriesEntity.creationDate? <TextFormat type="date" value={newscategoriesEntity.creationDate} format={APP_LOCAL_DATE_FORMAT} /> : null}</dd>
        </dl>
        <Button tag={Link} to="/entity/news_categories" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/entity/news_categories/${newscategoriesEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ news_categories }: IRootState) => ({
  newscategoriesEntity: news_categories.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(NewsCategoriesDetail);
