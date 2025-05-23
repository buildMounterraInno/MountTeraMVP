import MockPicEvents from '../assets/CategoryImages/Events/MockPicEvents.jpg';

export interface Event {
  id: number;
  destinationImage: string;
  catchPhrase: string;
  state: string;
}

export const events: Event[] = [
  {
    id: 1,
    destinationImage: MockPicEvents,
    catchPhrase: 'Thrissur Puram',
    state: 'Kerala',
  },
  {
    id: 2,
    destinationImage: MockPicEvents,
    catchPhrase: 'Goa Carnival',
    state: 'Goa',
  },
  {
    id: 3,
    destinationImage: MockPicEvents,
    catchPhrase: 'Pushkar Camel Fair',
    state: 'Rajasthan',
  },
  {
    id: 4,
    destinationImage: MockPicEvents,
    catchPhrase: 'Durga Puja',
    state: 'West Bengal',
  },
  {
    id: 5,
    destinationImage: MockPicEvents,
    catchPhrase: 'Ganesh Chaturthi',
    state: 'Maharashtra',
  },
  {
    id: 6,
    destinationImage: MockPicEvents,
    catchPhrase: 'Kumbh Mela',
    state: 'Uttar Pradesh',
  },
  {
    id: 7,
    destinationImage: MockPicEvents,
    catchPhrase: 'Hornbill Festival',
    state: 'Nagaland',
  },
];
