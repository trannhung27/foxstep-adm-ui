import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './cfg-rule-content.reducer';
import { ICfgRuleContent } from 'app/shared/model/cfg-rule-content.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { PageHeader } from 'antd';

export interface ICfgRuleContentProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const CfgRuleContent = (props: ICfgRuleContentProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const handleSyncList = () => {
    props.getEntities();
  };

  const { cfgRuleContentList, match, loading } = props;
  return (
    <div>
      <PageHeader style={{ padding: '0 0' }} className="site-page-header" title="Quản lý điều khoản" />
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
        {cfgRuleContentList && cfgRuleContentList.length > 0 ? (
          <Table responsive hover striped>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nội dung</th>
                <th>Kiểu</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {cfgRuleContentList.map((cfgRuleContent, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`${match.url}/${cfgRuleContent.id}`} color="link" size="sm">
                      {cfgRuleContent.id}
                    </Button>
                  </td>
                  <td>{cfgRuleContent.content}</td>
                  <td>{cfgRuleContent.type===1?"Điều khoản":
                      (cfgRuleContent.type===2?"Chính sách bảo mật":"")}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${cfgRuleContent.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Sửa</span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${cfgRuleContent.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
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

const mapStateToProps = ({ cfgRuleContent }: IRootState) => ({
  cfgRuleContentList: cfgRuleContent.entities,
  loading: cfgRuleContent.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CfgRuleContent);
