import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Col, Row, Table } from 'reactstrap';
import { Translate, getSortState, IPaginationBaseState, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import { getEntities, reset } from 'app/entities/news/news.reducer';
import { ICategory } from 'app/shared/model/category.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT, APP_LOCAL_DATETIME_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';

export interface INewsProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const News = (props: INewsProps) => {
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'id'), props.location.search)
  );
  const [sorting, setSorting] = useState(false);

  const getAllEntities = () => {
    props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
  };

  const resetAll = () => {
    props.reset();
    setPaginationState({
      ...paginationState,
      activePage: 1,
    });
    props.getEntities();
  };

  useEffect(() => {
    resetAll();
  }, []);

  const handleClose = () => {
    props.history.push('/banners');
  };

  useEffect(() => {
    if (props.updateSuccess) {
      resetAll();
    }
  }, [props.updateSuccess]);

  useEffect(() => {
    getAllEntities();
  }, [paginationState.activePage]);

  useEffect(() => {
    if (sorting) {
      getAllEntities();
      setSorting(false);
    }
  }, [sorting]);

  const { newsList, match, loading } = props;
  return (
    <Modal isOpen size="xl" toggle={handleClose}>
      <ModalHeader id="category-heading" data-cy="CategoryHeading" style={{ backgroundColor: 'rgb(30, 122, 150)' }}>
        <h2 style={{ color: 'white' }}>Chọn Thử thách/Tin tức</h2>
      </ModalHeader>
      <ModalBody>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            aria-label="Nhập tên thử thách/tin tức"
            aria-describedby="basic-addon1"
          />
          <div className="input-group-append">
            <button className="btn" type="button">
              <FontAwesomeIcon icon="search" />
            </button>
          </div>
        </div>
        <div className="table-responsive" style={{ marginTop: '-17px' }}>
          {newsList && newsList.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th className="hand">STT</th>
                  <th className="hand">Tên Thử thách/Tin tức</th>
                  <th className="hand">Thời gian</th>
                  <th className="hand">Loại</th>
                  <th className="hand">Trạng thái</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {newsList.map((news, i) => (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>
                      <Button tag={Link} to={`${match.url}/${news.id}`} color="link" size="sm">
                        {news.id}
                      </Button>
                    </td>
                    <td>{news.title}</td>
                    <td>
                      {news.dateCreated ? <TextFormat type="date" value={news.dateCreated} format={APP_LOCAL_DATETIME_FORMAT} /> : null} -{' '}
                      {news.dateUpdated ? <TextFormat type="date" value={news.dateUpdated} format={APP_LOCAL_DATETIME_FORMAT} /> : null}
                    </td>
                    <td>News Category</td>
                    <td>{news.status === 0 ? 'Chưa diễn ra' : 'Đang diễn ra'}</td>
                    <td>
                      <Button tag={Link} to={`/banners/${news.id}/select`} color="link" size="sm">
                        Select
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            !loading && <div className="alert alert-warning">No Posts found</div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="default"
          className="border-secondary"
          onClick={handleClose}
          style={{ border: '1px solid rgb(155, 152, 152)', padding: '10px 50px', margin: '10px 45%' }}
        >
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ news }: IRootState) => ({
  newsList: news.entities,
  loading: news.loading,
  totalItems: news.totalItems,
  entity: news.entity,
  updateSuccess: news.updateSuccess,
});

const mapDispatchToProps = {
  getEntities,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(News);
