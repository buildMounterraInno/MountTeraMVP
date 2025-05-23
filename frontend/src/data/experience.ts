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
    destinationImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80',
    catchPhrase: 'Explore the Beaches of Andaman',
    state: 'Andaman and Nicobar',
    price: '₹4,500 / guest',
  },
  {
    id: 3,
    destinationImage:
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80',
    catchPhrase: 'Enjoy Goan Sands',
    state: 'Goa',
    price: '₹6,200 / guest',
  },
  {
    id: 4,
    destinationImage:
      'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80',
    catchPhrase: 'Discover the dunes of Rajasthan',
    state: 'Rajasthan',
    price: '₹5,000 / guest',
  },
  {
    id: 5,
    destinationImage:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=crop&w=2940&q=80',
    catchPhrase: 'Trek through the Mountains of Himachal',
    state: 'Himachal Pradesh',
    price: '₹7,000 / guest',
  },
  {
    id: 6,
    destinationImage:
      'https://images.unsplash.com/photo-1498855926480-d98e83099315?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fEVufDB8fHx8&auto=format&fit=crop&w=2940&q=80',
    catchPhrase: 'Witness the Beauty of Dal Lake',
    state: 'Jammu and Kashmir',
    price: '₹4,800 / guest',
  },
];
