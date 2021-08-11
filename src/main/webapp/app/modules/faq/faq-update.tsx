import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, FormGroup, Label, Row } from 'reactstrap';
import { AvFeedback, AvField, AvForm, AvGroup } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { NEWS_CATEGORY_TYPES, NEWS_STATUSES } from 'app/config/constants';
import { IRootState } from 'app/shared/reducers';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { reset as resetUploadImage } from '../upload-image/upload-image-reducer';
import { createEntity, getEntity, reset, updateEntity } from 'app/modules/faq/faq.reducer';
import { getEntities as getNewsCategories } from 'app/modules/news-category/news-category.reducer';
import { connect } from 'react-redux';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { PageHeader } from 'antd';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { UploadImageInput } from 'app/modules/upload-image/upload-image';
import { uploadImageCallBack } from 'app/shared/util/editor-utils';
import { uploadImage } from 'app/modules/upload-image/upload-image-reducer';

export interface IFaqUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const FaqUpdate = (props: IFaqUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorChanged, setEditorChanged] = useState(false);
  const [editorError, setEditorErrorState] = useState(false);
  const [datePublishedState, setDatePublishedState] = useState(displayDefaultDateTime());

  const onEditorStateChange = editor => {
    setEditorChanged(true);
    setEditorErrorState(!editorState.getCurrentContent().hasText());
    setEditorState(editor);
  };

  const { adminUser, faqEntity, newsCategories, users, loading, updating } = props;

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
    if (faqEntity.content && !isNew)
      setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(faqEntity.content))));
    if (faqEntity.datePublished && !isNew) setDatePublishedState(convertDateTimeFromServer(props.faqEntity.datePublished));
  }, [faqEntity]);

  useEffect(() => {
    if (props.updateSuccess) {
      props.history.push('/faqs');
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.datePublished = convertDateTimeToServer(datePublishedState);

    values.content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    if (errors.length === 0) {
      const entity = {
        ...faqEntity,
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
      <PageHeader
        style={{ padding: '0 0' }}
        onBack={() => props.history.goBack()}
        className="site-page-header"
        title={isNew ? 'Tạo Câu hỏi thường gặp/Hướng dẫn' : 'Sửa Câu hỏi thường gặp/Hướng dẫn'}
      />
      <hr />
      <Row>
        <Col>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? { status: 1 } : faqEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup hidden>
                  <Label for="faqs-id">ID</Label>
                  <AvField id="faqs-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <Row className="justify-content-between">
                <Col>
                  <UploadImageInput
                    entity={props.uploadImageEntity}
                    upload={props.uploadImage}
                    loading={props.uploadingImage}
                    label="Ảnh:"
                    reset={props.resetUploadImage}
                    initImage={isNew ? null : faqEntity.imgUrl}
                    required={isNew ? true : !faqEntity.imgUrl}
                  />
                  <AvField
                    hidden
                    id="news-imgUrl"
                    data-cy="imgUrl"
                    type="text"
                    name="imgUrl"
                    value={props.uploadImageEntity.url}
                    validate={{
                      required: { value: true, errorMessage: 'Chưa upload ảnh' },
                    }}
                  />
                </Col>
                <Col>
                  <AvGroup>
                    <Label id="statusLabel" for="faq-status">
                      Trạng thái:
                    </Label>
                    <AvField
                      id="faq-status"
                      data-cy="status"
                      type="select"
                      className="form-control"
                      name="status"
                      validate={{
                        required: { value: true, errorMessage: 'Giá trị bắt buộc.' },
                      }}
                    >
                      <option value={NEWS_STATUSES[0].id} key="1">
                        {NEWS_STATUSES[0].name}
                      </option>
                      <option value={NEWS_STATUSES[1].id} key="2">
                        {NEWS_STATUSES[1].name}
                      </option>
                    </AvField>
                  </AvGroup>
                </Col>
              </Row>
              <AvGroup>
                <Label id="titleLabel" for="faq-title">
                  Tiêu đề:
                </Label>
                <AvField
                  id="faq-title"
                  data-cy="title"
                  type="text"
                  name="title"
                  placeholder="Aa"
                  validate={{
                    required: { value: true, errorMessage: 'Giá trị bắt buộc.' },
                    maxLength: { value: 255, errorMessage: 'Tối đa 255 ký tự.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="news-newsCategory">Loại</Label>
                <AvField
                  id="news-newsCategory"
                  data-cy="newsCategory"
                  type="select"
                  className="form-control"
                  name="newsCategoryId"
                  value={isNew ? 0 : faqEntity.newsCategory ? faqEntity.newsCategory.id : 0}
                  required
                >
                  <option value="" key="0">
                    --Chọn--
                  </option>
                  {newsCategories
                    ? newsCategories.map(
                        otherEntity =>
                          otherEntity.id !== NEWS_CATEGORY_TYPES.NEWS.id && (
                            <option value={otherEntity.id} key={otherEntity.id}>
                              {otherEntity.name}
                            </option>
                          )
                      )
                    : null}
                </AvField>
                <AvFeedback>Giá trị bắt buộc.</AvFeedback>
              </AvGroup>
              <AvGroup>
                <Label id="contentLabel" for="faq-content">
                  Nội dung:
                </Label>
                <AvField hidden id="faq-content" data-cy="content" type="text" name="content" />
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
                {editorChanged && editorError && <p className="invalid-feedback">Giá trị bắt buộc.</p>}
              </AvGroup>
              <AvGroup hidden>
                <Label for="post-user">Người tạo:</Label>
                <AvField id="post-user" data-cy="user" type="select" className="form-control" name="userId" value={adminUser.id}>
                  {users
                    ? users.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.login}
                        </option>
                      ))
                    : null}
                </AvField>
              </AvGroup>
              <Row className="justify-content-between">
                <Col sm="6">
                  <FormGroup>
                    <Label id="datePublishedLabel" for="faq-datePublished">
                      Thời gian đăng bài:
                    </Label>
                    <input
                      id="faq-datePublished"
                      data-cy="datePublished"
                      type="datetime-local"
                      className="form-control"
                      name="datePublished"
                      onKeyDown={e => e.preventDefault()}
                      min={displayDefaultDateTime()}
                      disabled={!isNew && new Date() > new Date(props.faqEntity.datePublished)}
                      value={datePublishedState}
                      onChange={e => setDatePublishedState(e.target.value)}
                    />
                  </FormGroup>
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
  faqEntity: storeState.faqs.entity,
  loading: storeState.faqs.loading,
  updating: storeState.faqs.updating,
  updateSuccess: storeState.faqs.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(FaqUpdate);
