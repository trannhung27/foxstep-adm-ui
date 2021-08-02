import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Input, Label, Row } from 'reactstrap';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { IRootState } from 'app/shared/reducers';
import { getEntities as getNewsCategories } from 'app/modules/news-category/news-category.reducer';
import { reset as resetUploadImage } from '../upload-image/upload-image-reducer';
import { createEntity, getEntity, reset, updateEntity } from './news.reducer';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { NEWS_CATEGORY_TYPES, NEWS_STATUSES } from 'app/config/constants';
import { uploadImage } from 'app/modules/upload-image/upload-image-reducer';
import { PageHeader } from 'antd';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { UploadImageInput } from 'app/modules/upload-image/upload-image';
import axios from 'axios';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { uploadImageCallBack } from 'app/shared/util/editor-utils';

export interface INewsUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const NewsUpdate = (props: INewsUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorChanged, setEditorChanged] = useState(false);
  const [editorError, setEditorErrorState] = useState(false);

  const onEditorStateChange = editor => {
    setEditorChanged(true);
    setEditorErrorState(!editorState.getCurrentContent().hasText());
    setEditorState(editor);
  };

  const { adminUser, newsEntity, newsCategories, users, loading, updating } = props;

  const handleClose = () => {
    props.history.goBack();
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
    if (newsEntity.content && !isNew)
      setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(newsEntity.content))));
  }, [newsEntity]);

  useEffect(() => {
    if (props.updateSuccess) {
      props.history.push('/news');
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.dateCreated = convertDateTimeToServer(values.dateCreated);
    values.dateUpdated = convertDateTimeToServer(values.dateUpdated);
    values.datePublished = convertDateTimeToServer(values.datePublished);

    values.content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
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
      <PageHeader style={{ padding: '0 0' }} className="site-page-header" title={isNew ? 'Tạo tin tức' : 'Sửa tin tức'} />
      <hr />
      <Row>
        <Col>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? { status: 1 } : newsEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup hidden>
                  <Label for="news-id">ID</Label>
                  <AvInput id="news-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <Row className="justify-content-between">
                <Col>
                  <UploadImageInput
                    entity={props.uploadImageEntity}
                    upload={props.uploadImage}
                    loading={props.uploadingImage}
                    label="Ảnh:"
                    initImage={isNew ? null : newsEntity.imgUrl}
                    reset={props.resetUploadImage}
                  />
                  <AvField hidden id="news-imgUrl" data-cy="imgUrl" type="text" name="imgUrl" value={props.uploadImageEntity.url} />
                </Col>
                <Col>
                  <AvGroup>
                    <Label id="statusLabel" for="news-status">
                      Trạng thái:
                    </Label>
                    <AvInput id="news-status" data-cy="status" type="select" className="form-control" name="status">
                      <option value="" key="0">
                        --Chọn trạng thái--
                      </option>
                      <option value={NEWS_STATUSES[0].id} key="1">
                        {NEWS_STATUSES[0].name}
                      </option>
                      <option value={NEWS_STATUSES[1].id} key="2">
                        {NEWS_STATUSES[1].name}
                      </option>
                    </AvInput>
                  </AvGroup>
                </Col>
              </Row>
              <AvGroup>
                <Label id="titleLabel" for="news-title">
                  Tiêu đề:
                </Label>
                <AvField
                  id="news-title"
                  data-cy="title"
                  type="text"
                  name="title"
                  placeholder="Aa"
                  validate={{
                    required: { value: true, errorMessage: 'Không được để trống.' },
                    maxLength: { value: 255, errorMessage: 'Tối đa 255 ký tự.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="news-description">
                  Tóm tắt:
                </Label>
                <AvField
                  id="news-description"
                  data-cy="description"
                  type="textarea"
                  name="description"
                  placeholder="Aa"
                  validate={{
                    required: { value: true, errorMessage: 'Không được để trống.' },
                    maxLength: { value: 1000, errorMessage: 'Tối đa 1000 ký tự.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="contentLabel" for="news-content">
                  Nội dung:
                </Label>
                <AvField hidden id="news-content" data-cy="content" type="text" name="content" />
                <Editor
                  editorState={editorState}
                  onEditorStateChange={onEditorStateChange}
                  wrapperStyle={{ textDecoration: 'none !important' }}
                  editorStyle={{ border: '1px gainsboro solid', borderRadius: '2px', height: '250px' }}
                  placeholder="Aa"
                  toolbar={{
                    options: [
                      'inline',
                      'blockType',
                      'fontSize',
                      'list',
                      'textAlign',
                      'colorPicker',
                      'link',
                      'embedded',
                      'emoji',
                      'image',
                      'remove',
                      'history',
                    ],
                    image: {
                      uploadCallback: uploadImageCallBack,
                      previewImage: true,
                      inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                      alt: { present: true, mandatory: false },
                    },
                  }}
                />
                {editorChanged && editorError && <p className="invalid-feedback">Không được để trống.</p>}
              </AvGroup>
              <AvGroup hidden>
                <Label for="post-user">Người tạo:</Label>
                <AvInput id="post-user" data-cy="user" type="select" className="form-control" name="userId" value={adminUser.id}>
                  {users
                    ? users.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.login}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup hidden>
                <Label for="news-newsCategory">Phân loại:</Label>
                <AvInput
                  id="news-newsCategory"
                  data-cy="newsCategory"
                  type="select"
                  className="form-control"
                  name="newsCategoryId"
                  value={NEWS_CATEGORY_TYPES.NEWS.id}
                >
                  <option value={NEWS_CATEGORY_TYPES.NEWS.id} key="1">
                    {NEWS_CATEGORY_TYPES.NEWS.name}
                  </option>
                </AvInput>
              </AvGroup>
              <Row className="justify-content-between">
                <Col sm="6">
                  <AvGroup>
                    <Label id="datePublishedLabel" for="news-datePublished">
                      Thời gian đăng bài:
                    </Label>
                    <AvInput
                      id="news-datePublished"
                      data-cy="datePublished"
                      type="datetime-local"
                      className="form-control"
                      name="datePublished"
                      onKeyDown={e => e.preventDefault()}
                      value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.newsEntity.datePublished)}
                      validate={{
                        required: { value: true, errorMessage: 'Không được để trống.' },
                      }}
                    />
                  </AvGroup>
                </Col>
                <Col sm="3">
                  <Label for="save-entity">&nbsp;</Label>
                  <Button id="cancel-save" color="default" className="border-secondary" onClick={handleClose} block>
                    <FontAwesomeIcon icon={faWindowClose} />
                    &nbsp;
                    <span className="d-none d-md-inline">Hủy</span>
                  </Button>
                </Col>
                <Col sm="3">
                  <Label for="save-entity">&nbsp;</Label>
                  <Button
                    color="primary"
                    id="save-entity"
                    data-cy="entityCreateSaveButton"
                    type="submit"
                    disabled={updating || !editorState.getCurrentContent().hasText()}
                    block
                  >
                    <FontAwesomeIcon icon="save" />
                    &nbsp; Lưu
                  </Button>
                </Col>
              </Row>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  adminUser: storeState.authentication.account,
  users: storeState.userManagement.users,
  newsCategories: storeState.newsCategory.entities,
  newsEntity: storeState.news.entity,
  loading: storeState.news.loading,
  updating: storeState.news.updating,
  updateSuccess: storeState.news.updateSuccess,
  uploadImageEntity: storeState.uploadImage.entity,
  uploadingImage: storeState.uploadImage.loading,
});

const mapDispatchToProps = {
  getUsers,
  getNewsCategories,
  getEntity,
  updateEntity,
  createEntity,
  reset,
  uploadImage,
  resetUploadImage,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(NewsUpdate);
