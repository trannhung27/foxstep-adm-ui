import { getUrlParameter } from 'react-jhipster';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface IPaginationBaseState {
  itemsPerPage: number;
  sort: string;
  order: string;
  activePage: number;
}

export const getSortStateCustom = (location, idField, fieldOder): IPaginationBaseState => {
  const pageParam = getUrlParameter('page', location.search);
  const sortParam = getUrlParameter('sort', location.search);
  const sizeParam = getUrlParameter('size', location.search);
  let sort = idField || 'id';
  let order = fieldOder || 'asc';
  let activePage = 1;
  let itemsPerPage = ITEMS_PER_PAGE;
  if (pageParam !== '' && !isNaN(parseInt(pageParam, 10))) {
    activePage = parseInt(pageParam, 10);
  }
  if (sortParam !== '') {
    sort = sortParam.split(',')[0];
    order = sortParam.split(',')[1];
  }
  if (sizeParam !== '' && !isNaN(parseInt(sizeParam, 10))) {
    itemsPerPage = parseInt(sizeParam, 10);
  }
  return { itemsPerPage, sort, order, activePage };
};
