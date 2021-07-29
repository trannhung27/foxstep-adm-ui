import axios from 'axios';
import { cleanEntity } from 'app/shared/util/entity-utils';

export const uploadImageCallBack = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      const base64 = (<string>reader.result).split(',')[1];
      const imageEntity = {
        content: base64,
        imageName: file.name,
        url: file.src,
      };
      axios.post('api/upload', cleanEntity(imageEntity)).then(r =>
        resolve({
          data: {
            link: r.data.url,
          },
        })
      );
    };
    reader.onerror = function () {
      // eslint-disable-next-line no-console
      console.log('Upload Image Failed');
    };
  });
