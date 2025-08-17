import image1 from '../assets/CategoryImages/Events/image1.jpg';
import image2 from '../assets/CategoryImages/Events/image2.jpg';
import image3 from '../assets/CategoryImages/Events/image3.jpg';

export interface Event {
  id: number;
  destinationImage: string;
  catchPhrase: string;
  state: string;
  price: number;
}

export const events: Event[] = [
  {
    id: 1,
    destinationImage: image1,
    catchPhrase: 'Heritage Walk at Hyderabad',
    state: 'Telangana',
    price: 1000
  },
  {
    id: 2,
    destinationImage: image2,
    catchPhrase: 'Morning Yoga Retreat',
    state: 'Goa',
     price: 800
  },
  {
    id: 3,
    destinationImage: image3,
    catchPhrase: 'Food Festival at Golconda Fort',
    state: 'Telangana',
     price: 1200
  },
];

