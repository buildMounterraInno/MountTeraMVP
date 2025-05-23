import MockExpPic from '../assets/CategoryImages/Experiences/MockExp.jpg';

export interface Experience {
  id: number;
  destinationImage: string;
  catchPhrase: string;
  state: string;
  price: string;
}

export const experiences: Experience[] = [
  {
    id: 1,
    destinationImage: MockExpPic,
    catchPhrase: 'Visit the Wonderful Taj Mahal',
    state: 'Uttar Pradesh',
    price: '₹5,600 / guest',
  },
  {
    id: 2,
    destinationImage: MockExpPic,
    catchPhrase: 'Explore the Backwaters of Kerala',
    state: 'Kerala',
    price: '₹4,500 / guest',
  },
  {
    id: 3,
    destinationImage: MockExpPic,
    catchPhrase: 'Experience the Royal Palaces of Jaipur',
    state: 'Rajasthan',
    price: '₹6,200 / guest',
  },
  {
    id: 4,
    destinationImage: MockExpPic,
    catchPhrase: 'Discover the Beaches of Goa',
    state: 'Goa',
    price: '₹5,000 / guest',
  },
  {
    id: 5,
    destinationImage: MockExpPic,
    catchPhrase: 'Trek through the Mountains of Himachal',
    state: 'Himachal Pradesh',
    price: '₹7,000 / guest',
  },
  {
    id: 6,
    destinationImage: MockExpPic,
    catchPhrase: 'Witness the Beauty of Dal Lake',
    state: 'Jammu and Kashmir',
    price: '₹4,800 / guest',
  },
  {
    id: 7,
    destinationImage: MockExpPic,
    catchPhrase: 'Marvel at the Temples of Tamil Nadu',
    state: 'Tamil Nadu',
    price: '₹5,300 / guest',
  },
];
