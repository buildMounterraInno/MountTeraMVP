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
    destinationImage:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80',
    placeName: 'Grand Canyon',
    state: 'Arizona',
    coordinates: '36.1069° N, 112.1129° W',
  },
  {
    id: 3,
    destinationImage:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=crop&w=2940&q=80',
    placeName: 'Mount Kilimanjaro',
    state: 'Tanzania',
    coordinates: '3.0674° S, 37.3556° E',
  },
  {
    id: 4,
    destinationImage:
      'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=crop&w=2940&q=80',
    placeName: 'Inca Trail',
    state: 'Peru',
    coordinates: '13.1631° S, 72.5450° W',
  },
  {
    id: 5,
    destinationImage:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=crop&w=2940&q=80',
    placeName: 'Banff National Park',
    state: 'Alberta',
    coordinates: '51.4968° N, 115.9281° W',
  },
  {
    id: 6,
    destinationImage:
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=crop&w=2940&q=80',
    placeName: 'Torres del Paine',
    state: 'Chile',
    coordinates: '51.1216° S, 73.0695° W',
  },
  {
    id: 7,
    destinationImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=crop&w=2940&q=80',
    placeName: 'Zion National Park',
    state: 'Utah',
    coordinates: '37.2982° N, 113.0263° W',
  },
];
