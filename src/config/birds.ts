import { Bird } from '../types';

export enum Birds {
  Black = 'BLACK',
  White = 'WHITE',
  Eagle = 'EAGLE',
  Parrot = 'PARROT'
}

export const BIRDS: Record<Birds, Bird> = {
  [Birds.White]: {
    name: 'Bílý pták',
    imageLeft: '/images/birds/white_left.gif',
    imageRight: '/images/birds/white_right.gif'
  },
  [Birds.Black]: {
    name: 'Černý pták',
    imageLeft: '/images/birds/black_left.gif',
    imageRight: '/images/birds/black_right.gif'
  },
  [Birds.Eagle]: {
    name: 'Orel',
    imageLeft: '/images/birds/eagle_left.gif',
    imageRight: '/images/birds/eagle_right.gif'
  },
  [Birds.Parrot]: {
    name: 'Papoušek',
    imageLeft: '/images/birds/parrot_left.gif',
    imageRight: '/images/birds/parrot_right.gif'
  }
};
