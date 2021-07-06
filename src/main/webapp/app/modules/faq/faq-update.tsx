import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Label, Row } from 'reactstrap';
import { AvFeedback, AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { NEWS_CATEGORY_TYPES, NEWS_STATUSES } from 'app/config/constants';
import { IRootState } from 'app/shared/reducers';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { createEntity, getEntity, reset, updateEntity } from 'app/modules/faq/faq.reducer';
import { getEntities as getNewsCategories } from 'app/modules/news-category/news-category.reducer';
import { connect } from 'react-redux';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

export interface IFaqUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const FaqUpdate = (props: IFaqUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = editor => {
    setEditorState(editor);
  };

  const { adminUser, faqEntity, newsCategories, users, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/faqs' + props.location.search);
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
    if (faqEntity.content) setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(faqEntity.content))));
  }, [faqEntity]);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.dateCreated = convertDateTimeToServer(values.dateCreated);
    values.dateUpdated = convertDateTimeToServer(values.dateUpdated);
    values.datePublished = convertDateTimeToServer(values.datePublished);

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
      <Row>
        <Col>
          <h2 id="faqcreateOrEditLabel" data-cy="FaqsCreateUpdateHeading">
            Tạo hoặc sửa FAQ, Hướng dẫn
          </h2>
        </Col>
      </Row>
      <Row>
        <Col>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : faqEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="faqs-id">ID</Label>
                  <AvInput id="faqs-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <Row className="justify-content-between">
                <Col>
                  <AvGroup>
                    <Label id="imgUrlLabel" for="faq-imgUrl">
                      Ảnh:*
                    </Label>
                    <AvField id="faq-imgUrl" data-cy="imgUrl" type="text" name="imgUrl" />
                  </AvGroup>
                </Col>
                <Col>
                  <AvGroup>
                    <Label id="statusLabel" for="faq-status">
                      Trạng thái:
                    </Label>
                    <AvInput id="faq-status" data-cy="status" type="select" className="form-control" name="status">
                      <option value="" key="0">
                        --Chọn trạng thái--
                      </option>
                      <option value={NEWS_STATUSES.ACTIVE} key="1">
                        Hoạt động
                      </option>
                      <option value={NEWS_STATUSES.INACTIVE} key="2">
                        Không Hoạt động
                      </option>
                    </AvInput>
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
                  validate={{
                    required: { value: true, errorMessage: 'Không được để trống.' },
                    maxLength: { value: 500, errorMessage: 'Tối đa 500 ký tự.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="news-newsCategory">Loại</Label>
                <AvInput
                  id="news-newsCategory"
                  data-cy="newsCategory"
                  type="select"
                  className="form-control"
                  name="newsCategoryId"
                  value={isNew ? '0' : faqEntity.newsCategory.id}
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
                </AvInput>
                <AvFeedback>Không được để trống.</AvFeedback>
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
                />
                {!editorState.getCurrentContent().hasText() && <p className="invalid-feedback">Không được để trống.</p>}
              </AvGroup>
              <Row>
                <Col>
                  <AvGroup>
                    <Label id="datePublishedLabel" for="faq-datePublished">
                      Thời gian đăng bài:
                    </Label>
                    <AvInput
                      id="faq-datePublished"
                      data-cy="datePublished"
                      type="datetime-local"
                      className="form-control"
                      name="datePublished"
                      placeholder={'YYYY-MM-DD HH:mm'}
                      value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.faqEntity.datePublished)}
                      validate={{
                        required: { value: true, errorMessage: 'Không được để trống.' },
                      }}
                    />
                  </AvGroup>
                </Col>
                <Col>
                  <AvGroup>
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
                </Col>
              </Row>
              <Button tag={Link} id="cancel-save" to="/faqs" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Quay lại</span>
              </Button>
              &nbsp;
              <Button
                color="primary"
                id="save-entity"
                data-cy="entityCreateSaveButton"
                type="submit"
                disabled={updating || !editorState.getCurrentContent().hasText()}
              >
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
  adminUser: storeState.authentication.account,
  users: storeState.userManagement.users,
  newsCategories: storeState.newsCategory.entities,
  faqEntity: storeState.faqs.entity,
  loading: storeState.faqs.loading,
  updating: storeState.faqs.updating,
  updateSuccess: storeState.faqs.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(FaqUpdate);
