import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntity, updateEntity, createEntity, reset } from './banners.reducer';
import { convertDateTimeToServer, convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { getEntity as getNews, updateEntity as updateNews } from 'app/entities/news/news.reducer';
import { getEntities as getCategories } from 'app/entities/news_categories/news_categories.reducer';

export interface INewsUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const NewsUpdate = (props: INewsUpdateProps) => {
  // const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { bannersEntity, users, categories, newsEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/banners' + props.location.search);
  };

  useEffect(() => {
    resetAll();
  }, []);

  useEffect(() => {
    props.getNews(props.match.params.id);

    props.getUsers();
    props.getCategories();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const resetAll = () => {
    props.getNews(props.match.params.id);
    props.reset();
  };

  const saveBannersEntity = (event, errors, values) => {
    values.date_created = convertDateTimeToServer(values.date_created);
    values.date_updated = convertDateTimeToServer(values.date_updated);

    values.dateCreated = convertDateTimeToServer(values.dateCreated);
    values.dateUpdated = convertDateTimeToServer(values.dateUpdated);

    const state1 = {
      content_id: values.content_id,
      date_created: values.date_created,
      date_updated: values.date_updated,
    };

    if (errors.length === 0) {
      const entitybanners = {
        ...bannersEntity,
        ...state1,
      };

      props.createEntity(entitybanners);

      const entitynews = {
        ...newsEntity,
        ...values,
      };
      props.updateNews(entitynews);
    }
  };
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="postDeleteDialogHeading">
        Confirm select operation
      </ModalHeader>
      <ModalBody id="foxstep2AdminApp.post.delete.question">Are you sure you want to delete this News?</ModalBody>
      <ModalFooter>
        <div>
          <Row className="justify-content-center"></Row>
          <Row className="justify-content-center">
            <Col md="8">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <AvForm model={newsEntity} onSubmit={saveBannersEntity}>
                  <AvGroup>
                    <AvField
                      id="post-creationDate"
                      data-cy="content_id"
                      value={props.match.params.id}
                      type="hidden"
                      className="form-control"
                      name="content_id"
                    />
                  </AvGroup>
                  <AvGroup>
                    <AvField
                      id="post-creationDate"
                      data-cy="date_created"
                      type="hidden"
                      className="form-control"
                      name="date_created"
                      value={Date.now()}
                      validate={{
                        required: { value: true, errorMessage: 'This field is required.' },
                      }}
                    />
                  </AvGroup>
                  <AvGroup>
                    <AvField
                      id="post-creationDate"
                      data-cy="date_updated"
                      type="hidden"
                      className="form-control"
                      name="date_updated"
                      value={Date.now()}
                      validate={{
                        required: { value: true, errorMessage: 'This field is required.' },
                      }}
                    />
                  </AvGroup>
                  <AvGroup>
                    <AvInput id="post-id" type="hidden" className="form-control" name="id" required readOnly />
                  </AvGroup>
                  <AvGroup>
                    <AvField id="post-title" data-cy="title" type="hidden" name="title" />
                  </AvGroup>
                  <AvGroup>
                    <AvInput id="post-id" value="1" type="hidden" className="form-control" name="status" required readOnly />
                  </AvGroup>
                  <AvGroup>
                    <AvField id="post-title" data-cy="desc" type="hidden" name="desc" />
                  </AvGroup>
                  <AvGroup>
                    <AvField id="post-content" data-cy="content" type="hidden" name="content" />
                  </AvGroup>
                  <AvGroup>
                    <AvField
                      id="post-creationDate"
                      data-cy="dateCreated"
                      type="hidden"
                      className="form-control"
                      name="dateCreated"
                      value={convertDateTimeFromServer(newsEntity.dateCreated)}
                      validate={{
                        required: { value: true, errorMessage: 'This field is required.' },
                      }}
                    />
                  </AvGroup>
                  <AvGroup>
                    <AvField
                      id="post-creationDate"
                      data-cy="dateUpdated"
                      type="hidden"
                      className="form-control"
                      name="dateUpdated"
                      value={convertDateTimeFromServer(newsEntity.dateUpdated)}
                      validate={{
                        required: { value: true, errorMessage: 'This field is required.' },
                      }}
                    />
                  </AvGroup>
                  <AvGroup>
                    <AvField id="post-title" data-cy="user" type="hidden" value={newsEntity.user} name="userId" />
                  </AvGroup>
                  <AvGroup>
                    <AvField id="post-title" data-cy="user" type="hidden" value={newsEntity.category} name="userId" />
                  </AvGroup>
                  <Button tag={Link} id="cancel-save" to="/banners/select" replace color="info">
                    <FontAwesomeIcon icon="arrow-left" />
                    &nbsp;
                    <span className="d-none d-md-inline">Back</span>
                  </Button>
                  &nbsp;
                  <Button color="primary" type="submit">
                    <FontAwesomeIcon icon="save" />
                    &nbsp; Save
                  </Button>
                </AvForm>
              )}
            </Col>
          </Row>
        </div>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  bannersEntity: storeState.banners.entity,
  categories: storeState.news_categories.entities,
  users: storeState.userManagement.users,
  newsEntity: storeState.news.entity,
  loading: storeState.news.loading,
  updating: storeState.news.updating,
  updateSuccess: storeState.news.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  getNews,
  getUsers,
  updateNews,
  updateEntity,
  getCategories,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(NewsUpdate);
