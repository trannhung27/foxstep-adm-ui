import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { createEntity, reset, searchBanners } from './banner.reducer';
import { APP_TIMESTAMP_FORMAT, ChallengeStatuses, NEWS_STATUSES } from 'app/config/constants';
import { JhiPagination, TextFormat } from 'react-jhipster';
import { PaginationItemCount } from 'app/shared/util/pagination-item-count';

export interface IBannerUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const BannerUpdate = (props: IBannerUpdateProps) => {
  const { updating, banners, loading, totalItems } = props;

  const [paginationState, setPaginationState] = useState({
    itemsPerPage: 10,
    sort: 'dateStart',
    order: 'desc',
    activePage: 1,
  });

  const [searchState, setSearchState] = useState({
    title: 'dontSearchThis',
  });

  const handleClose = () => {
    props.history.push('/banner');
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const onSubmit = (event, errors, values) => {
    if (errors.length === 0) {
      setSearchState(values);
    }
  };

  const search = () => {
    props.searchBanners(searchState, paginationState.activePage - 1, paginationState.itemsPerPage, paginationState.sort);
  };

  useEffect(() => {
    search();
  }, [paginationState.activePage, searchState]);

  const saveEntity = (contentId, bannerTypeId) => {
    const entity = {
      id: parseInt(props.match.params.id, 10),
      contentId,
      bannerTypeId,
    };
    props.createEntity(entity);
  };

  const handlePagination = currentPage => {
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });
    search();
  };

  return (
    <Modal isOpen size="xl" toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Chọn Thử thách/Tin tức</ModalHeader>
      <ModalBody>
        <AvForm onSubmit={onSubmit}>
          <Row>
            <Col sm="10">
              <AvField
                id="titleSearch"
                type="string"
                className="form-control"
                name="title"
                placeHolder="Nhập tên thử thách/tin tức"
                validate={{
                  required: { value: true, errorMessage: 'This field is required.' },
                }}
              />
            </Col>
            <Col sm="2">
              <Button color="primary" type="submit" disabled={loading} block>
                <FontAwesomeIcon icon="search" />
              </Button>
            </Col>
          </Row>
        </AvForm>
        {banners && banners.length > 0 ? (
          <Table responsive hover striped>
            <thead>
              <tr>
                <th className="hand">STT</th>
                <th className="hand">Tên Thử thách/Tin tức</th>
                <th className="hand">Thời gian</th>
                <th className="hand">Loại</th>
                <th className="hand">Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {banners.map((b, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    {(paginationState.activePage - 1) * paginationState.itemsPerPage === 0
                      ? 1 + i
                      : (paginationState.activePage - 1) * paginationState.itemsPerPage + 1 + i}
                  </td>
                  <td>{b.title}</td>
                  <td>
                    {b.bannerTypeId === 1 ? (
                      b.dateStart && b.dateFinish ? (
                        <span>
                          <TextFormat type="date" value={b.dateStart} format={APP_TIMESTAMP_FORMAT} />
                          - <TextFormat type="date" value={b.dateFinish} format={APP_TIMESTAMP_FORMAT} />
                        </span>
                      ) : null
                    ) : b.datePublished ? (
                      <TextFormat type="date" value={b.datePublished} format={APP_TIMESTAMP_FORMAT} />
                    ) : null}
                  </td>
                  <td>{b.bannerTypeId === 1 ? 'Thử thách' : 'Tin tức'}</td>
                  <td>
                    {b.bannerTypeId === 1
                      ? ChallengeStatuses.map(status => (status.id === b.status ? status.name : ''))
                      : NEWS_STATUSES.map(status => (status.id === b.status ? status.name : ''))}
                  </td>
                  <td>
                    <Button onClick={() => saveEntity(b.contentId, b.bannerTypeId)}>Chọn</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">Không tìm thấy dữ liệu</div>
        )}
        {props.totalItems ? (
          <div className={banners && banners.length > 0 ? 'px-4' : 'd-none'}>
            <Row className="justify-content-between">
              <PaginationItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} />
              <JhiPagination
                activePage={paginationState.activePage}
                onSelect={handlePagination}
                maxButtons={5}
                itemsPerPage={paginationState.itemsPerPage}
                totalItems={props.totalItems}
              />
            </Row>
          </div>
        ) : (
          ''
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="default" className="border-secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  updating: storeState.banner.updating,
  updateSuccess: storeState.banner.updateSuccess,
  loading: storeState.banner.loading,
  banners: storeState.banner.searchList,
  totalItems: storeState.banner.totalItems,
});

const mapDispatchToProps = {
  createEntity,
  searchBanners,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BannerUpdate);
