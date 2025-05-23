import MockSocialPic from '../assets/socialProfiles/MockSocialPic.jpg';

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
    backgroundImage: MockSocialPic,
    profileName: '@travelwithgyan',
    city: 'Thimphu',
    country: 'Bhutan',
  },
  {
    id: 2,
    backgroundImage: MockSocialPic,
    profileName: '@mayankhikes',
    city: 'Gangtok',
    country: 'India',
  },
  {
    id: 3,
    backgroundImage: MockSocialPic,
    profileName: '@nairtrails',
    city: 'Srinagar',
    country: 'India',
  },
  {
    id: 4,
    backgroundImage: MockSocialPic,
    profileName: '@wanderlustana',
    city: 'Kathmandu',
    country: 'Nepal',
  },
  {
    id: 5,
    backgroundImage: MockSocialPic,
    profileName: '@explorewithsam',
    city: 'Colombo',
    country: 'Sri Lanka',
  },
  {
    id: 6,
    backgroundImage: MockSocialPic,
    profileName: '@adventurealex',
    city: 'Pokhara',
    country: 'Nepal',
  },
];
