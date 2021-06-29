import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { INewsCategory } from 'app/shared/model/news-category.model';
import { getEntities as getNewsCategories } from 'app/modules/news-category/news-category.reducer';
import { getEntity, updateEntity, createEntity, reset } from './news.reducer';
import { INews } from 'app/shared/model/news.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import DateTime from 'react-datetime';
import moment from 'moment';

export interface INewsUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const NewsUpdate = (props: INewsUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { newsEntity, newsCategories, users, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/news' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getUsers();
    props.getNewsCategories();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.dateCreated = convertDateTimeToServer(values.dateCreated);
    values.dateUpdated = convertDateTimeToServer(values.dateUpdated);
    values.datePublished = convertDateTimeToServer(values.datePublished);

    if (errors.length === 0) {
      const entity = {
        ...newsEntity,
        ...values,
        user: users.find(it => it.id.toString() === values.userId.toString()),
        newsCategory: newsCategories.find(it => it.id.toString() === values.newsCategoryId.toString()),
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
          <h2 id="foxstep2AdminUiApp.news.home.createOrEditLabel" data-cy="NewsCreateUpdateHeading">
            Tạo hoặc sửa tin tức
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
                  <Label for="news-id">ID</Label>
                  <AvInput id="news-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="contentLabel" for="news-content">
                  Nội dung
                </Label>
                <AvField
                  id="news-content"
                  data-cy="content"
                  type="text"
                  name="content"
                  validate={{
                    required: { value: true, errorMessage: 'Không được để trống.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="news-description">
                  Tóm tắt
                </Label>
                <AvField
                  id="news-description"
                  data-cy="description"
                  type="text"
                  name="description"
                  validate={{
                    required: { value: true, errorMessage: 'Không được để trống.' },
                    maxLength: { value: 1000, errorMessage: 'Tối đa 1000 ký tự.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="titleLabel" for="news-title">
                  Tiêu đề
                </Label>
                <AvField
                  id="news-title"
                  data-cy="title"
                  type="text"
                  name="title"
                  validate={{
                    required: { value: true, errorMessage: 'Không được để trống.' },
                    maxLength: { value: 500, errorMessage: 'Tối đa 500 ký tự.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="imgUrlLabel" for="news-imgUrl">
                  Ảnh
                </Label>
                <AvField id="news-imgUrl" data-cy="imgUrl" type="text" name="imgUrl" />
              </AvGroup>
              <AvGroup>
                <Label id="datePublishedLabel" for="news-datePublished">
                  Thời gian đăng bài
                </Label>
                <AvInput
                  id="news-datePublished"
                  data-cy="datePublished"
                  type="datetime-local"
                  className="form-control"
                  name="datePublished"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.newsEntity.datePublished)}
                  validate={{
                    required: { value: true, errorMessage: 'Không được để trống.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="news-status">
                  Trạng thái
                </Label>
                <AvField
                  id="news-status"
                  data-cy="status"
                  type="string"
                  className="form-control"
                  name="status"
                  validate={{
                    required: { value: true, errorMessage: 'Không được để trống.' },
                    number: { value: true, errorMessage: 'Yêu cầu điền số.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="post-user">Người tạo</Label>
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
                <AvFeedback>Không được để trống.</AvFeedback>
              </AvGroup>
              <AvGroup>
                <Label for="news-newsCategory">Phân loại</Label>
                <AvInput
                  id="news-newsCategory"
                  data-cy="newsCategory"
                  type="select"
                  className="form-control"
                  name="newsCategoryId"
                  required
                >
                  <option value="" key="0" />
                  {newsCategories
                    ? newsCategories.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.name}
                        </option>
                      ))
                    : null}
                </AvInput>
                <AvFeedback>Không được để trống.</AvFeedback>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/news" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Quay lại</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Lưu
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
  newsCategories: storeState.newsCategory.entities,
  newsEntity: storeState.news.entity,
  loading: storeState.news.loading,
  updating: storeState.news.updating,
  updateSuccess: storeState.news.updateSuccess,
});

const mapDispatchToProps = {
  getUsers,
  getNewsCategories,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(NewsUpdate);
