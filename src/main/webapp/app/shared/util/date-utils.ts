import dayjs from 'dayjs';

import {
  APP_LOCAL_DATE_FORMAT,
  APP_LOCAL_DATE_FORMAT_REVERSE,
  APP_LOCAL_DATETIME_FORMAT,
  APP_LOCAL_DATETIME_FORMAT_Z,
  APP_TIMESTAMP_FORMAT,
} from 'app/config/constants';

export const convertDateTimeFromServer = date => (date ? dayjs(date).format(APP_LOCAL_DATETIME_FORMAT) : null);

export const convertDateFromServer = date => (date ? dayjs(date).format(APP_LOCAL_DATE_FORMAT_REVERSE) : null);

export const convertDateTimeToServer = date => (date ? dayjs(date).toDate() : null);

export const displayDefaultDateTime = () => dayjs().startOf('minute').format(APP_LOCAL_DATETIME_FORMAT);

export const displayDefaultTimeStamp = () => dayjs().startOf('day').format(APP_TIMESTAMP_FORMAT);

export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
