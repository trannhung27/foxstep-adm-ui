const config = {
  VERSION: process.env.VERSION,
};

export default config;

export const SERVER_API_URL = process.env.SERVER_API_URL;

export const AUTHORITIES = {
  USER: { id: 1, name: 'ROLE_USER' },
  ADMIN: { id: 2, name: 'ROLE_ADMIN' },
};

export const USER_STATUS = {
  ACTIVATED: 1,
  INACTIVE: 0,
};

export const APP_USER_STATUS = [
  { id: 1, name: 'Hoạt động' },
  { id: 0, name: 'Chưa kích hoạt' },
];

export const APP_USER_GENDER = [
  { id: 1, name: 'Nam' },
  { id: 0, name: 'Nữ' },
];

export const messages = {
  DATA_ERROR_ALERT: 'Internal Error',
};

export const APP_DATE_FORMAT = 'DD/MM/YY HH:mm';
export const APP_TIMESTAMP_FORMAT = 'DD/MM/YYYY HH:mm:ss';
export const APP_LOCAL_DATE_FORMAT = 'DD/MM/YYYY';
export const APP_LOCAL_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm';
export const APP_LOCAL_DATETIME_FORMAT_Z = 'YYYY-MM-DDTHH:mm Z';
export const APP_WHOLE_NUMBER_FORMAT = '0,0';
export const APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT = '0,0.[00]';

export const NEWS_CATEGORY_TYPES = {
  NEWS: { id: 1, name: 'Tin tức' },
  FAQ: { id: 2, name: 'Câu hỏi thường gặp' },
  TUTORIAL: { id: 3, name: 'Hướng dẫn' },
};

export const NEWS_STATUSES = [
  { id: 1, name: 'Hoạt động' },
  { id: 0, name: 'Không hoạt động' },
];

export const WfProcessGroup = {
  CHALLENGE: 1,
};

export const WfProcessType = {
  ADD: 1,
  EDIT: 2,
};

export const WfActionType = {
  REQ: 0,
  APPV: 1,
  DENY: -1,
};

export const ChallengeTypes = {
  ORGANIZATION: 0,
  INDIVIDUAL: 1,
};

export const ChallengeStatuses = [
  { id: 0, name: 'Chờ duyệt' },
  { id: 1, name: 'Đã duyệt' },
  { id: 2, name: 'Kết thúc' },
  { id: 12, name: 'Đang diễn ra' },
  { id: -1, name: 'Bị từ chối' },
  { id: -2, name: 'Hủy' },
];

export const ChallengeUserStatuses = [
  { id: 0, name: 'Chờ duyệt tham gia' },
  { id: 1, name: 'Đã tham gia' },
  { id: -1, name: 'Bị từ chối tham gia' },
];
