import MockSocialImg from '../assets/socialProfiles/MockSocialPic.jpg';

export interface Social {
  id: number;
  backgroundImage: string;
  profileName: string;
  city: string;
  country: string;
}

export const socials: Social[] = [
  {
    id: 1,
    backgroundImage: MockSocialImg,
    profileName: '@travelwithgyan',
    city: 'Thimphu',
    country: 'Bhutan',
  },
  {
    id: 2,
    backgroundImage:
      'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    profileName: '@mayankhikes',
    city: 'Gangtok',
    country: 'India',
  },
  {
    id: 3,
    backgroundImage: MockSocialImg,
    profileName: '@nairtrails',
    city: 'Srinagar',
    country: 'India',
  },
  {
    id: 4,
    backgroundImage:
      'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80',
    profileName: '@wanderlustana',
    city: 'Kathmandu',
    country: 'Nepal',
  },
  {
    id: 5,
    backgroundImage:
      'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80',
    profileName: '@explorewithsam',
    city: 'Colombo',
    country: 'Sri Lanka',
  },
  {
    id: 6,
    backgroundImage:
      'https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80',
    profileName: '@adventurealex',
    city: 'Pokhara',
    country: 'Nepal',
  },
];
