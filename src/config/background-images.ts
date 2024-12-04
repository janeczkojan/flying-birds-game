import { BackgroundImage } from '../types';

export enum BackgroundImages {
  CloudSky = 'CLOUD_SKY',
  Forrest = 'FORREST',
  Mountains = 'MOUNTAINS',
  Sea = 'SEA'
}

export const BACKGROUND_IMAGES: Record<BackgroundImages, BackgroundImage> = {
  [BackgroundImages.CloudSky]: {
    fullSizeSrc: '/images/backgrounds/cloud-sky.jpg',
    smallSrc: '/images/backgrounds/cloud-sky_small.jpg'
  },
  [BackgroundImages.Forrest]: {
    fullSizeSrc: '/images/backgrounds/forrest.jpg',
    smallSrc: '/images/backgrounds/forrest_small.jpg'
  },
  [BackgroundImages.Mountains]: {
    fullSizeSrc: '/images/backgrounds/mountains.jpg',
    smallSrc: '/images/backgrounds/mountains_small.jpg'
  },
  [BackgroundImages.Sea]: {
    fullSizeSrc: '/images/backgrounds/sea.jpg',
    smallSrc: '/images/backgrounds/sea_small.jpg'
  }
};
