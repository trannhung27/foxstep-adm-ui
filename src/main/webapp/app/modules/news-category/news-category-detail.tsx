import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './news-category.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface INewsCategoryDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const NewsCategoryDetail = (props: INewsCategoryDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { newsCategoryEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="newsCategoryDetailsHeading">Phân loại tin tức</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{newsCategoryEntity.id}</dd>
          <dt>
            <span id="name">Tên</span>
          </dt>
          <dd>{newsCategoryEntity.name}</dd>
          <dt>
            <span id="dateCreated">Ngày tạo</span>
          </dt>
          <dd>
            {newsCategoryEntity.dateCreated ? (
              <TextFormat value={newsCategoryEntity.dateCreated} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
        </dl>
        <Button tag={Link} to="/news-category" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Quay lại</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/news-category/${newsCategoryEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Sửa</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ newsCategory }: IRootState) => ({
  newsCategoryEntity: newsCategory.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(NewsCategoryDetail);
