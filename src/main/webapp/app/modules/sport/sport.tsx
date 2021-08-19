import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './sport.reducer';
import { ISport } from 'app/shared/model/sport.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { PageHeader } from 'antd';

export interface ISportProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Sport = (props: ISportProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const handleSyncList = () => {
    props.getEntities();
  };

  const { sportList, match, loading } = props;
  return (
    <div>
      <PageHeader style={{ padding: '0 0' }} className="site-page-header" title="Quản lý bộ môn" />
      <hr />
      <div className="d-flex justify-content-end p-1">
        <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
          <FontAwesomeIcon icon="sync" spin={loading} /> Làm mới
        </Button>
        <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
          <FontAwesomeIcon icon="plus" />
          &nbsp; Tạo mới
        </Link>
      </div>
      <div className="table-responsive">
        {sportList && sportList.length > 0 ? (
          <Table responsive hover striped>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {sportList.map((sport, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`${match.url}/${sport.id}`} color="link" size="sm">
                      {sport.id}
                    </Button>
                  </td>
                  <td>{sport.name}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${sport.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Sửa</span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${sport.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Xóa</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">Không có dữ liệu</div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ sport }: IRootState) => ({
  sportList: sport.entities,
  loading: sport.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Sport);
