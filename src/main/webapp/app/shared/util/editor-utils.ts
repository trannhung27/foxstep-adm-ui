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

export const convert = src => {
  const img = new Image();
  img.src = src;

  const canvas = convertImageToCanvas(img);
  const pngImage = convertCanvasToImage(canvas);
  // console.log(pngImage.src);
  return pngImage.src;
};

export const convertImageToCanvas = image => {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 240;
  canvas.getContext('2d').drawImage(image, 0, 0, 300, 240);
  return canvas;
};

export const convertCanvasToImage = canvas => {
  const image = new Image();
  image.src = canvas.toDataURL('image/png');
  return image;
};
