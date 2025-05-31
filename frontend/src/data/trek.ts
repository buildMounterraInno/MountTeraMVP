export interface Trek {
  id: number;
  destinationImage: string;
  placeName: string;
  state: string;
  coordinates: string;
  pageUrl: string;
}

export const treks: Trek[] = [
  {
    id: 1,
    destinationImage:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80',
    placeName: 'Hampta Pass Trek',
    state: 'Himachal Pradesh',
    coordinates: '32.2396° N, 77.1887° E',
    pageUrl: '/pages/HamptaPassTrek',
  },
  {
    id: 2,
    destinationImage:
      'https://images.unsplash.com/photo-1486911278844-a81c5267e227?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80',
    placeName: 'Kedarkantha Trek',
    state: 'Uttarakhand',
    coordinates: '31.0262° N, 78.2730° E',
    pageUrl: '/pages/KedarkanthaTrek',
  },
  {
    id: 3,
    destinationImage:
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80',
    placeName: 'Valley of Flowers Trek',
    state: 'Uttarakhand',
    coordinates: '30.7273° N, 79.6050° E',
    pageUrl: '/pages/ValleyOfFlowersTrek',
  },
  {
    id: 4,
    destinationImage:
      'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80',
    placeName: 'Kashmir Great Lakes Trek',
    state: 'Jammu & Kashmir',
    coordinates: '34.2668° N, 75.3412° E',
    pageUrl: '/pages/KashmirGreatLakesTrek',
  },
  {
    id: 5,
    destinationImage:
      'https://images.unsplash.com/photo-1485470733090-0aae1788d5af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80',
    placeName: 'Chadar Trek',
    state: 'Ladakh',
    coordinates: '33.9456° N, 77.6568° E',
    pageUrl: '/pages/ChadarTrek',
  },
  {
    id: 6,
    destinationImage:
      'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=crop&w=2940&q=80',
    placeName: 'Roopkund Trek',
    state: 'Uttarakhand',
    coordinates: '30.2620° N, 79.7320° E',
    pageUrl: '/pages/RoopkundTrek',
  },
];
