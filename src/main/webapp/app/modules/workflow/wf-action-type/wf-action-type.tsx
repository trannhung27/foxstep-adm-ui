import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './wf-action-type.reducer';
import { PageHeader } from 'antd';

export interface IWfActionTypeProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const WfActionType = (props: IWfActionTypeProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const handleSyncList = () => {
    props.getEntities();
  };

  const { wfActionTypeList, match, loading } = props;
  return (
    <div>
      <PageHeader style={{ padding: '0 0' }} className="site-page-header" title="Loại hành động" />
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
        {wfActionTypeList && wfActionTypeList.length > 0 ? (
          <Table responsive hover striped>
            <thead>
              <tr>
                <th>ID</th>
                <th>Mã</th>
                <th>Tên</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {wfActionTypeList.map((wfActionType, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`${match.url}/${wfActionType.id}`} color="link" size="sm">
                      {wfActionType.id}
                    </Button>
                  </td>
                  <td>{wfActionType.code}</td>
                  <td>{wfActionType.name}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${wfActionType.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Sửa</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${wfActionType.id}/delete`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Xóa</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">No Wf Action Types found</div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ wfActionType }: IRootState) => ({
  wfActionTypeList: wfActionType.entities,
  loading: wfActionType.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WfActionType);
