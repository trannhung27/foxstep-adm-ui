import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink as Link, RouteComponentProps } from 'react-router-dom';
import { Button, Table } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './banner.reducer';
import { PageHeader } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

export interface IBannerProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Banner = (props: IBannerProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const handleSyncList = () => {
    props.getEntities();
  };

  const { bannerList, match, loading } = props;
  const ids = [1, 2, 3, 4, 5];
  return (
    <div>
      <PageHeader style={{ padding: '0 0' }} className="site-page-header" title="Quản lý banner" />
      <div className="table-responsive">
        {!loading && (
          <Table responsive>
            <tbody>
              {ids.map((id, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td width="100px">Banner {id}:</td>
                  <td>
                    &nbsp;
                    {bannerList && bannerList[i] && bannerList[i].title ? (
                      <span>
                        <Link
                          to={
                            bannerList[i].bannerTypeId === 1 ? `/challenges/${bannerList[i].contentId}` : `/news/${bannerList[i].contentId}`
                          }
                        >
                          {bannerList[i].title}
                        </Link>
                        &nbsp;
                        <Button tag={Link} to={`${match.url}/${id}/delete`} color="default" data-cy="entityEditButton">
                          <FontAwesomeIcon icon={faWindowClose} />
                        </Button>
                      </span>
                    ) : (
                      <Button tag={Link} to={`${match.url}/${id}`} color="primary" data-cy="entityEditButton">
                        {' '}
                        Chọn{' '}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ banner }: IRootState) => ({
  bannerList: banner.entities,
  loading: banner.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Banner);
