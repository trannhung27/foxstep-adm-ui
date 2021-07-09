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
import { getEntities as getCategories } from 'app/entities/category/category.reducer';
import { getEntity, updateEntity, createEntity, reset } from './news.reducer';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface INewsUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const NewsUpdate = (props: INewsUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { newsEntity, users, categories, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/entity/news' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUsers();
    props.getCategories();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...newsEntity,
        ...values,
        user: users.find(it => it.id.toString() === values.userId.toString()),
        category: categories.find(it => it.id.toString() === values.categoryId.toString()),
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
                <Label id="titleLabel" for="post-title">
                  Title
                </Label>
                <AvField
                  id="post-title"
                  data-cy="title"
                  type="text"
                  name="title"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="titleLabel" for="post-title">
                  Type
                </Label>
                <AvField
                  id="post-title"
                  data-cy="typeId"
                  type="text"
                  name="typeId"
                />
              </AvGroup>

              <AvGroup>
                <Label id="titleLabel" for="post-title">
                  Desc
                </Label>
                <AvField
                  id="post-title"
                  data-cy="desc"
                  type="text"
                  name="desc"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="contentLabel" for="post-content">
                  Content
                </Label>
                <AvField
                  id="post-content"
                  data-cy="content"
                  type="text"
                  name="content"
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
                  data-cy="creationDate"
                  type="datetime-local"
                  className="form-control"
                  name="dateCreated"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="creationDateLabel" for="post-creationDate">
                  Updated Date
                </Label>
                <AvField
                  id="post-creationDate"
                  data-cy="creationDate"
                  type="datetime-local"
                  className="form-control"
                  name="dateUpdated"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="post-user">User</Label>
                <AvInput id="post-user" data-cy="user" type="select" className="form-control" name="userId" required>
                  <option value="" key="0" />
                  {users
                    ? users.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.login}
                        </option>
                      ))
                    : null}
                </AvInput>
                <AvFeedback>This field is required.</AvFeedback>
              </AvGroup>
              <AvGroup>
                <Label for="post-category">Category</Label>
                <AvInput id="post-category" data-cy="category" type="select" className="form-control" name="categoryId" required>
                  <option value="" key="0" />
                  {categories
                    ? categories.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.name}
                        </option>
                      ))
                    : null}
                </AvInput>
                <AvFeedback>This field is required.</AvFeedback>
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
  users: storeState.userManagement.users,
  categories: storeState.category.entities,
  newsEntity: storeState.news.entity,
  loading: storeState.news.loading,
  updating: storeState.news.updating,
  updateSuccess: storeState.news.updateSuccess,
});

const mapDispatchToProps = {
  getUsers,
  getCategories,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(NewsUpdate);
