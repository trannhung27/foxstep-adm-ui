import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './banners.reducer';
import { mapIdList } from 'app/shared/util/entity-utils';
import { convertDateTimeToServer, convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { getEntities as getNews} from '../news/news.reducer';

export interface INewsUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const NewsUpdate = (props: INewsUpdateProps) => {
  // const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { newsEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/entity/banners' + props.location.search);
  };

  useEffect(() => {
      props.reset();
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
      props.createEntity(entity);
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
      <Row className="justify-content-center">
        {/*  */}
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={newsEntity} onSubmit={saveEntity}>
              <AvGroup>
                <AvField
                  id="post-creationDate"
                  data-cy="content_id"
                  value = {props.match.params.id}
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

                  value = {Date.now()}
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
              <Button tag={Link} id="cancel-save" to="/entity/banners/select" replace color="info">
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
