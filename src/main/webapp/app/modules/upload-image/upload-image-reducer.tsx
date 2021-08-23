import { IUploadImage } from 'app/shared/model/upload-image/upload-image.model';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import axios from 'axios';
import { ICrudGetAllWithCriteriaAction, cleanEntity, ICrudPutImageRequest } from 'app/shared/util/entity-utils';
import { defaultValue, IUploadImageResponse } from 'app/shared/model/upload-image/upload-image-response';
import { ICrudGetAction } from 'react-jhipster';
import { IUploadImageRequest } from 'app/shared/model/upload-image/upload-image-request.model';
import { IChallenge } from 'app/shared/model/challenge.model';

export const ACTION_TYPES = {
  FETCH_UPLOAD_IMAGES: 'upload-image/FETCH_UPLOAD_IMAGES',
  RESET: 'upload-image/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entity: defaultValue,
};

export type UploadImageState = Readonly<typeof initialState>;

// Reducer
export default (state: UploadImageState = initialState, action): UploadImageState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_UPLOAD_IMAGES):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_UPLOAD_IMAGES):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_UPLOAD_IMAGES):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/upload';

// Actions
export const uploadImage: ICrudPutImageRequest<IUploadImageRequest> = entity => {
  const requestUrl = `${apiUrl}`;
  return {
    type: ACTION_TYPES.FETCH_UPLOAD_IMAGES,
    payload: axios.post(requestUrl, cleanEntity(entity)),
  };
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
