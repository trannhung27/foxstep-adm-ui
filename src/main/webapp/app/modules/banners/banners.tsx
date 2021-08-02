import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, getSortState, IPaginationBaseState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities, reset } from './banners.reducer';
import { ICategory } from 'app/shared/model/category.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { getEntities as getNews } from 'app/entities/news/news.reducer';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

export interface IBannersProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Banners = (props: IBannersProps) => {
  const { bannersList, newsList, match, loading } = props;

  const banner = [];

  const titles = [''];

  for (let index = 0; index < 5 - bannersList.length; index++) {
    banner.push('');
  }

  const colors = [];

  const resetAll = () => {
    props.getEntities();
    props.getNews();
    props.reset();
  };

  useEffect(() => {
    resetAll();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      resetAll();
    }
  }, [props.updateSuccess]);

  return (
    <div>
      <h1>Quản lý banner</h1>
      <hr />

      <div style={{ marginTop: '30px' }}>
        <h1 style={{ display: 'none' }}>{newsList.map((news, i) => titles.push(news.id + ' ' + news.title))}</h1>
        {bannersList.map((b, i) => (
          <div key={`entity-${i}`} style={{ display: 'flex' }}>
            <p style={{ marginRight: '30px' }}>Banner {i + 1}: </p>
            {titles.map((title, j) => (
              <div key={`entity-${j}`} style={{}}>
                <u>{b.content_id === Number(title.slice(0, 1)) ? title.slice(1, title.length) : ''}</u>
              </div>
            ))}
            <Button color={'btn'} tag={Link} to={`${match.url}/${b.id}/delete`}>
              <FontAwesomeIcon icon={faWindowClose} />
            </Button>
          </div>
        ))}
        {banner.map((x, i) => (
          <div key={`entity-${i}`}>
            {banner.length === 0 ? (
              ''
            ) : (
              <div style={{ display: 'flex' }}>
                <p style={{ marginRight: '30px' }}>Banner {i + bannersList.length + 1}: </p>
                <Button
                  tag={Link}
                  to={`${match.url}/select`}
                  style={{ padding: '0px 30px', height: '28px', backgroundColor: 'white', color: 'black' }}
                >
                  <span className="d-md-inline" style={{ fontSize: '14px' }}>
                    <b>Chọn</b>
                  </span>
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  newsList: storeState.news.entities,
  bannersList: storeState.banners.entities,
  loading: storeState.banners.loading,
  totalItems: storeState.banners.totalItems,
  links: storeState.banners.links,
  entity: storeState.banners.entity,
  updateSuccess: storeState.banners.updateSuccess,
});

const mapDispatchToProps = {
  getNews,
  getEntities,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Banners);