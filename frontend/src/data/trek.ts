import MockPic from '../assets/CategoryImages/Treks/MockPic.jpg';

export interface Trek {
  id: number;
  destinationImage: string;
  placeName: string;
  state: string;
  coordinates: string;
}

export const treks: Trek[] = [
  {
    id: 1,
    destinationImage: MockPic,
    placeName: 'Everest Base Camp',
    state: 'Nepal',
    coordinates: '27.9881° N, 86.9250° E',
  },
  {
    id: 2,
    destinationImage: MockPic,
    placeName: 'Grand Canyon',
    state: 'Arizona',
    coordinates: '36.1069° N, 112.1129° W',
  },
  {
    id: 3,
    destinationImage: MockPic,
    placeName: 'Mount Kilimanjaro',
    state: 'Tanzania',
    coordinates: '3.0674° S, 37.3556° E',
  },
  {
    id: 4,
    destinationImage: MockPic,
    placeName: 'Inca Trail',
    state: 'Peru',
    coordinates: '13.1631° S, 72.5450° W',
  },
  {
    id: 5,
    destinationImage: MockPic,
    placeName: 'Banff National Park',
    state: 'Alberta',
    coordinates: '51.4968° N, 115.9281° W',
  },
  {
    id: 6,
    destinationImage: MockPic,
    placeName: 'Torres del Paine',
    state: 'Chile',
    coordinates: '51.1216° S, 73.0695° W',
  },
  {
    id: 7,
    destinationImage: MockPic,
    placeName: 'Zion National Park',
    state: 'Utah',
    coordinates: '37.2982° N, 113.0263° W',
  },
];
