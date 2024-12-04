import { BackgroundImage } from '../types';

export enum BackgroundImages {
  CloudySky = 'CLOUDY_SKY',
  Forrest = 'FORREST',
  Mountains = 'MOUNTAINS',
  Sea = 'SEA'
}

export const BACKGROUND_IMAGES: Record<BackgroundImages, BackgroundImage> = {
  [BackgroundImages.CloudySky]: {
    fullSizeSrc: '/images/backgrounds/cloudy-sky.jpg',
    smallSizeSrc: '/images/backgrounds/cloudy-sky_small.jpg'
  },
  [BackgroundImages.Forrest]: {
    fullSizeSrc: '/images/backgrounds/forrest.jpg',
    smallSizeSrc: '/images/backgrounds/forrest_small.jpg'
  },
  [BackgroundImages.Mountains]: {
    fullSizeSrc: '/images/backgrounds/mountains.jpg',
    smallSizeSrc: '/images/backgrounds/mountains_small.jpg'
  },
  [BackgroundImages.Sea]: {
    fullSizeSrc: '/images/backgrounds/sea.jpg',
    smallSizeSrc: '/images/backgrounds/sea_small.jpg'
  }
};
