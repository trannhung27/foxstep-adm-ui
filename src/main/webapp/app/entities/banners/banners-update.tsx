import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { ICategory } from 'app/shared/model/category.model';
import { getEntities as getCategories } from 'app/entities/news_categories/news_categories.reducer';
import { getEntity, updateEntity, createEntity, reset } from './banners.reducer';
import { mapIdList } from 'app/shared/util/entity-utils';
import { convertDateTimeToServer, convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { getEntities as getNews} from '../news/news.reducer';

export interface INewsUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const NewsUpdate = (props: INewsUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { newsEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/entity/news' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.date_created = convertDateTimeToServer(values.date_created);
    values.date_updated = convertDateTimeToServer(values.date_updated);
    if (errors.length === 0) {
      const entity = {
        ...newsEntity,
        ...values,
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="foxstep2AdminApp.post.home.createOrEditLabel" data-cy="PostCreateUpdateHeading">
            Create or edit a News
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : newsEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="post-id">ID</Label>
                  <AvInput id="post-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}

              <AvGroup>
                <Label id="creationDateLabel" for="post-creationDate">
                  content
                </Label>
                <AvField
                  id="post-creationDate"
                  data-cy="content_id"
                  type="datetime-local"
                  className="form-control"
                  name="content_id"
                />
              </AvGroup>
              <AvGroup>
                <Label id="creationDateLabel" for="post-creationDate">
                  Creation Date
                </Label>
                <AvField
                  id="post-creationDate"
                  data-cy="date_created"
                  type="datetime-local"
                  className="form-control"
                  name="date_created"
                  value={isNew ?'':convertDateTimeFromServer(newsEntity.date_created)}
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                  }}
                />
              </AvGroup>

              <AvGroup>
                <Label id="creationDateLabel" for="post-creationDate">
                  Creation Date
                </Label>
                <AvField
                  id="post-creationDate"
                  data-cy="date_updated"
                  type="datetime-local"
                  className="form-control"
                  name="date_updated"
                  value={isNew ?'':convertDateTimeFromServer(newsEntity.date_updated)}
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/entity/news" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  newsEntity: storeState.banners.entity,
  loading: storeState.banners.loading,
  updating: storeState.banners.updating,
  updateSuccess: storeState.banners.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(NewsUpdate);
