import { FoodImage } from '../types';

export enum FoodImages {
  Apple = 'APPLE',
  Grapevine = 'GRAPEVINE'
}

export const FOOD_IMAGES: Record<FoodImages, FoodImage> = {
  [FoodImages.Apple]: {
    fullSizeSrc: '/images/food/apple.png',
    cursorSizeSrc: '/images/food/apple_cursor.png'
  },
  [FoodImages.Grapevine]: {
    fullSizeSrc: '/images/food/grapevine.png',
    cursorSizeSrc: '/images/food/grapevine_cursor.png'
  }
};
