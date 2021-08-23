import { convertDateTimeToServer } from 'app/shared/util/date-utils';

export const fromDateSmallerThanToDate = (value, context) => {
  if (context.fromDate && context.toDate && convertDateTimeToServer(context.fromDate) > convertDateTimeToServer(context.toDate))
    return 'Từ ngày không được lớn hơn đến ngày';
  else return true;
};

export const fromDateSmallerThanToDate_DatePublished = (value, context) => {
  if (
    context.datePublished.greaterThanOrEqual &&
    context.datePublished.lessThanOrEqual &&
    convertDateTimeToServer(context.datePublished.greaterThanOrEqual) > convertDateTimeToServer(context.datePublished.lessThanOrEqual)
  )
    return 'Từ ngày không được lớn hơn đến ngày';
  else return true;
};
