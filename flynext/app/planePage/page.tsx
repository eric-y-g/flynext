'use client';

import { useState } from 'react';
import { useNotification } from '@/components/NotificationContext';
import Header from '@/components/header';

const cities = [{ city: 'Atlanta', country: 'United States' },
    { city: 'Beijing', country: 'China' },
    { city: 'Los Angeles', country: 'United States' },
    { city: 'Dubai', country: 'United Arab Emirates' },
    { city: 'Tokyo', country: 'Japan' },
    { city: 'Chicago', country: 'United States' },
    { city: 'London', country: 'United Kingdom' },
    { city: 'Houston', country: 'United States' },
    { city: 'Dallas', country: 'United States' },
    { city: 'Guangzhou', country: 'China' },
    { city: 'Amsterdam', country: 'Netherlands' },
    { city: 'Frankfurt', country: 'Germany' },
    { city: 'New York', country: 'United States' },
    { city: 'Singapore', country: 'Singapore' },
    { city: 'Toronto', country: 'Canada' },
    { city: 'Madrid', country: 'Spain' },
    { city: 'Seoul', country: 'South Korea' },
    { city: 'Sydney', country: 'Australia' },
    { city: 'Melbourne', country: 'Australia' },
    { city: 'Bangkok', country: 'Thailand' },
    { city: 'Brussels', country: 'Belgium' },
    { city: 'Zurich', country: 'Switzerland' },
    { city: 'Munich', country: 'Germany' },
    { city: 'Vienna', country: 'Austria' },
    { city: 'Istanbul', country: 'Turkey' },
    { city: 'Barcelona', country: 'Spain' },
    { city: 'Paris', country: 'France' },
    { city: 'Rome', country: 'Italy' },
    { city: 'Seattle', country: 'United States' },
    { city: 'Miami', country: 'United States' },
    { city: 'Boston', country: 'United States' },
    { city: 'Vancouver', country: 'Canada' },
    { city: 'Phoenix', country: 'United States' },
    { city: 'São Paulo', country: 'Brazil' },
    { city: 'Buenos Aires', country: 'Argentina' },
    { city: 'Moscow', country: 'Russia' },
    { city: 'New Delhi', country: 'India' },
    { city: 'Jakarta', country: 'Indonesia' },
    { city: 'Mexico City', country: 'Mexico' },
    { city: 'Kuala Lumpur', country: 'Malaysia' },
    { city: 'Manila', country: 'Philippines' },
    { city: 'Mumbai', country: 'India' },
    { city: 'Cape Town', country: 'South Africa' },
    { city: 'Dublin', country: 'Ireland' },
    { city: 'Helsinki', country: 'Finland' },
    { city: 'Oslo', country: 'Norway' },
    { city: 'Stockholm', country: 'Sweden' },
    { city: 'Copenhagen', country: 'Denmark' },
    { city: 'Lisbon', country: 'Portugal' },
    { city: 'Prague', country: 'Czech Republic' },
    { city: 'Warsaw', country: 'Poland' },
    { city: 'Budapest', country: 'Hungary' },
    { city: 'Bucharest', country: 'Romania' },
    { city: 'Athens', country: 'Greece' },
    { city: 'Montreal', country: 'Canada' },
    { city: 'Edmonton', country: 'Canada' },
    { city: 'Winnipeg', country: 'Canada' },
    { city: 'Ottawa', country: 'Canada' },
    { city: 'Halifax', country: 'Canada' },
    { city: 'Québec City', country: 'Canada' },
    { city: 'Victoria', country: 'Canada' },
    { city: 'Kelowna', country: 'Canada' },
    { city: 'Saskatoon', country: 'Canada' },
    { city: 'Regina', country: 'Canada' },
    { city: 'Moncton', country: 'Canada' },
    { city: 'Abbotsford', country: 'Canada' },
    { city: 'Yellowknife', country: 'Canada' },
    { city: 'Whitehorse', country: 'Canada' },
    { city: 'Doha', country: 'Qatar' },
    { city: 'Hong Kong', country: 'Hong Kong' },
    { city: 'Shanghai', country: 'China' },
    { city: 'Narita', country: 'Japan' },
    { city: 'Abu Dhabi', country: 'United Arab Emirates' },
    { city: 'Santiago', country: 'Chile' },
    { city: 'Bogotá', country: 'Colombia' },
    { city: 'Ho Chi Minh City', country: 'Vietnam' },
    { city: 'Auckland', country: 'New Zealand' },
    { city: 'Jeddah', country: 'Saudi Arabia' },
    { city: 'Tel Aviv', country: 'Israel' },
    { city: 'Honolulu', country: 'United States' },
    { city: 'Colombo', country: 'Sri Lanka' }];

const airports = [{
    id: '98b57d5f-ebd6-4102-864d-76568e843aee',
    code: 'ATL',
    name: 'Hartsfield–Jackson Atlanta International Airport',
    city: 'Atlanta',
    country: 'United States'
  },
  {
    id: '3dfbf270-f8e8-4fe0-a431-4856aa5fa7a3',
    code: 'PEK',
    name: 'Beijing Capital International Airport',
    city: 'Beijing',
    country: 'China'
  },
  {
    id: 'de904db1-32ec-4e34-814d-eca3c89e0dd7',
    code: 'LAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    country: 'United States'
  },
  {
    id: '56b2b45e-0d96-481a-befe-2f04acc72d77',
    code: 'DXB',
    name: 'Dubai International Airport',
    city: 'Dubai',
    country: 'United Arab Emirates'
  },
  {
    id: '5b167997-009a-4f1b-bbee-77f99b74ef59',
    code: 'HND',
    name: 'Tokyo Haneda Airport',
    city: 'Tokyo',
    country: 'Japan'
  },
  {
    id: '39b4c9c0-507a-45c0-9c3c-6fea96c61aaa',
    code: 'ORD',
    name: "O'Hare International Airport",
    city: 'Chicago',
    country: 'United States'
  },
  {
    id: '64848eb5-ba4e-4e82-a6c0-641f378e140b',
    code: 'LHR',
    name: 'Heathrow Airport',
    city: 'London',
    country: 'United Kingdom'
  },
  {
    id: '758f2b3d-802b-40fa-b0b6-6d4f6cf4c949',
    code: 'IAH',
    name: 'George Bush Intercontinental Airport',
    city: 'Houston',
    country: 'United States'
  },
  {
    id: 'ea6479b3-1f8f-4bb9-be12-e87264dfb2dc',
    code: 'DFW',
    name: 'Dallas/Fort Worth International Airport',
    city: 'Dallas',
    country: 'United States'
  },
  {
    id: 'd3ef285a-7668-4d91-8925-a23be1a0c94b',
    code: 'CAN',
    name: 'Guangzhou Baiyun International Airport',
    city: 'Guangzhou',
    country: 'China'
  },
  {
    id: '3bb318ef-7f81-4c10-98d7-1a67b80944b8',
    code: 'AMS',
    name: 'Amsterdam Airport Schiphol',
    city: 'Amsterdam',
    country: 'Netherlands'
  },
  {
    id: 'e93398e2-483d-408c-8a05-687fed53787c',
    code: 'FRA',
    name: 'Frankfurt Airport',
    city: 'Frankfurt',
    country: 'Germany'
  },
  {
    id: 'b7e29a55-80ab-4405-a23a-a927dcadfe2d',
    code: 'JFK',
    name: 'John F. Kennedy International Airport',
    city: 'New York',
    country: 'United States'
  },
  {
    id: '02ab893c-5a39-4524-95bb-508eb41dcc45',
    code: 'SIN',
    name: 'Singapore Changi Airport',
    city: 'Singapore',
    country: 'Singapore'
  },
  {
    id: '370d2633-ba94-47f5-a735-513c0e332224',
    code: 'YYZ',
    name: 'Toronto Pearson International Airport',
    city: 'Toronto',
    country: 'Canada'
  },
  {
    id: 'a8a830e1-74cb-4927-a86c-9ea23a2db204',
    code: 'MAD',
    name: 'Adolfo Suárez Madrid-Barajas Airport',
    city: 'Madrid',
    country: 'Spain'
  },
  {
    id: 'bb984fc3-de7d-4908-862d-ebe85758394b',
    code: 'ICN',
    name: 'Incheon International Airport',
    city: 'Seoul',
    country: 'South Korea'
  },
  {
    id: 'd1febfc6-d951-41b8-b07e-6e5e4ef144f9',
    code: 'SYD',
    name: 'Sydney Kingsford Smith Airport',
    city: 'Sydney',
    country: 'Australia'
  },
  {
    id: 'b48462d8-96a0-4a52-83de-08975938e9e4',
    code: 'MEL',
    name: 'Melbourne Airport',
    city: 'Melbourne',
    country: 'Australia'
  },
  {
    id: '068bcee7-3192-453d-a3fb-6d84b87e39f6',
    code: 'BKK',
    name: 'Suvarnabhumi Airport',
    city: 'Bangkok',
    country: 'Thailand'
  },
  {
    id: 'bc00dbe4-3640-4592-b1b4-84f80398f9bb',
    code: 'BRU',
    name: 'Brussels Airport',
    city: 'Brussels',
    country: 'Belgium'
  },
  {
    id: '2bcb7925-96aa-4de8-9ec1-3622e954c0b6',
    code: 'ZRH',
    name: 'Zurich Airport',
    city: 'Zurich',
    country: 'Switzerland'
  },
  {
    id: '34478814-4a31-4f7d-baef-d6de0901ff20',
    code: 'MUC',
    name: 'Munich Airport',
    city: 'Munich',
    country: 'Germany'
  },
  {
    id: 'a2224dd3-9fed-47d8-a0b2-8ecb0994cbc4',
    code: 'VIE',
    name: 'Vienna International Airport',
    city: 'Vienna',
    country: 'Austria'
  },
  {
    id: '6177b97e-962d-4ac1-928f-cdc71f3d1a0a',
    code: 'IST',
    name: 'Istanbul Airport',
    city: 'Istanbul',
    country: 'Turkey'
  },
  {
    id: '295296f3-8307-4bc1-b5b9-d40db4f543a4',
    code: 'BCN',
    name: 'Barcelona–El Prat Airport',
    city: 'Barcelona',
    country: 'Spain'
  },
  {
    id: 'fa35cff2-4d06-4933-9e2b-b3f329253b48',
    code: 'CDG',
    name: 'Charles de Gaulle Airport',
    city: 'Paris',
    country: 'France'
  },
  {
    id: '9619bf1f-5e1c-4955-9e38-28488a560333',
    code: 'FCO',
    name: 'Leonardo da Vinci–Fiumicino Airport',
    city: 'Rome',
    country: 'Italy'
  },
  {
    id: '92bdf26d-ff09-45fa-a469-8a74e0059312',
    code: 'SEA',
    name: 'Seattle-Tacoma International Airport',
    city: 'Seattle',
    country: 'United States'
  },
  {
    id: '135dd017-bd88-415f-80d8-1ae9d8804246',
    code: 'MIA',
    name: 'Miami International Airport',
    city: 'Miami',
    country: 'United States'
  },
  {
    id: '98cd3a74-3c80-487b-8ab5-ee6bdf5692e6',
    code: 'BOS',
    name: 'Logan International Airport',
    city: 'Boston',
    country: 'United States'
  },
  {
    id: '277ee046-765d-4546-aba7-0e4ec715daae',
    code: 'YVR',
    name: 'Vancouver International Airport',
    city: 'Vancouver',
    country: 'Canada'
  },
  {
    id: 'c8f1917e-ff36-40b4-a6be-ac4bc516571e',
    code: 'PHX',
    name: 'Phoenix Sky Harbor International Airport',
    city: 'Phoenix',
    country: 'United States'
  },
  {
    id: '259f1ae6-cc50-4917-aeaa-5129c12644a2',
    code: 'GRU',
    name: 'São Paulo/Guarulhos International Airport',
    city: 'São Paulo',
    country: 'Brazil'
  },
  {
    id: '08354f84-0200-4039-bb9f-171938367a23',
    code: 'EZE',
    name: 'Ministro Pistarini International Airport',
    city: 'Buenos Aires',
    country: 'Argentina'
  },
  {
    id: 'c3fe9f8c-9103-40b2-8d63-68096214f07c',
    code: 'SVO',
    name: 'Sheremetyevo International Airport',
    city: 'Moscow',
    country: 'Russia'
  },
  {
    id: '7e1ba9b7-dff7-47cd-8275-ae214e4e2f1b',
    code: 'DEL',
    name: 'Indira Gandhi International Airport',
    city: 'New Delhi',
    country: 'India'
  },
  {
    id: '798155b0-a5a3-4ffd-b342-fb188bbcf18b',
    code: 'CGK',
    name: 'Soekarno–Hatta International Airport',
    city: 'Jakarta',
    country: 'Indonesia'
  },
  {
    id: '7ec62a84-f3de-4817-8314-bdbdc9d3ced9',
    code: 'MEX',
    name: 'Mexico City International Airport',
    city: 'Mexico City',
    country: 'Mexico'
  },
  {
    id: '63cea601-895c-4d63-bf1e-746b604f3ff7',
    code: 'KUL',
    name: 'Kuala Lumpur International Airport',
    city: 'Kuala Lumpur',
    country: 'Malaysia'
  },
  {
    id: '061fc0c6-d34e-4de1-8e08-8297d5e9b7de',
    code: 'MNL',
    name: 'Ninoy Aquino International Airport',
    city: 'Manila',
    country: 'Philippines'
  },
  {
    id: '8999a15a-7542-4141-bac4-c8c76d98957d',
    code: 'BOM',
    name: 'Chhatrapati Shivaji Maharaj International Airport',
    city: 'Mumbai',
    country: 'India'
  },
  {
    id: '57528dee-c1b1-49cf-8e07-961ae9fdd969',
    code: 'CPT',
    name: 'Cape Town International Airport',
    city: 'Cape Town',
    country: 'South Africa'
  },
  {
    id: '344ea7c4-b4d9-49bc-90a8-d4dffce754d5',
    code: 'DUB',
    name: 'Dublin Airport',
    city: 'Dublin',
    country: 'Ireland'
  },
  {
    id: '54ed1ab1-9895-4ab3-9f82-8870e984f410',
    code: 'HEL',
    name: 'Helsinki Airport',
    city: 'Helsinki',
    country: 'Finland'
  },
  {
    id: '98cdc75f-7195-4b59-a583-f07a3711ddf5',
    code: 'OSL',
    name: 'Oslo Gardermoen Airport',
    city: 'Oslo',
    country: 'Norway'
  },
  {
    id: '7d3cd81e-5b33-4235-aa4a-8955237e729b',
    code: 'ARN',
    name: 'Stockholm Arlanda Airport',
    city: 'Stockholm',
    country: 'Sweden'
  },
  {
    id: 'ad66db9f-c421-4076-93c6-78be0e165fa7',
    code: 'CPH',
    name: 'Copenhagen Airport',
    city: 'Copenhagen',
    country: 'Denmark'
  },
  {
    id: '00d50809-fe27-446c-8b80-84ab2955eb1e',
    code: 'LIS',
    name: 'Lisbon Humberto Delgado Airport',
    city: 'Lisbon',
    country: 'Portugal'
  },
  {
    id: '2d343a42-595c-4bdc-a75c-e5c6cd4eeda7',
    code: 'PRG',
    name: 'Václav Havel Airport Prague',
    city: 'Prague',
    country: 'Czech Republic'
  },
  {
    id: '2ff907c8-b5b8-43b9-a273-9d53cbdb1b19',
    code: 'WAW',
    name: 'Warsaw Chopin Airport',
    city: 'Warsaw',
    country: 'Poland'
  },
  {
    id: 'ad471f53-4e66-4731-9a80-d10c0c18508d',
    code: 'BUD',
    name: 'Budapest Ferenc Liszt International Airport',
    city: 'Budapest',
    country: 'Hungary'
  },
  {
    id: 'e54e6cef-b37c-4794-9bf6-1bd1fe0c4bd5',
    code: 'OTP',
    name: 'Henri Coandă International Airport',
    city: 'Bucharest',
    country: 'Romania'
  },
  {
    id: '74025741-4287-48c7-b7b3-fce954789005',
    code: 'ATH',
    name: 'Athens International Airport',
    city: 'Athens',
    country: 'Greece'
  },
  {
    id: '51664d97-f7ab-49e9-9c0f-841b2eaab6af',
    code: 'YUL',
    name: 'Montréal–Trudeau International Airport',
    city: 'Montreal',
    country: 'Canada'
  },
  {
    id: 'f8126934-f6fa-4d58-9e25-d6589f977fa6',
    code: 'YEG',
    name: 'Edmonton International Airport',
    city: 'Edmonton',
    country: 'Canada'
  },
  {
    id: '64741053-7f6a-4ea0-b29c-92040b4546fb',
    code: 'YWG',
    name: 'Winnipeg James Armstrong Richardson International Airport',
    city: 'Winnipeg',
    country: 'Canada'
  },
  {
    id: 'c201af68-a41b-42a8-ad41-fb04c388de2a',
    code: 'YOW',
    name: 'Ottawa Macdonald–Cartier International Airport',
    city: 'Ottawa',
    country: 'Canada'
  },
  {
    id: 'de1fc9a2-442a-4179-9a6b-b90fb63baf40',
    code: 'YHZ',
    name: 'Halifax Stanfield International Airport',
    city: 'Halifax',
    country: 'Canada'
  },
  {
    id: 'df4f2c59-3bfa-42d2-8d14-ce9ccb5dc1ce',
    code: 'YQB',
    name: 'Québec City Jean Lesage International Airport',
    city: 'Québec City',
    country: 'Canada'
  },
  {
    id: '7afcde80-dc22-4967-b8ff-df9b4751eec8',
    code: 'YYJ',
    name: 'Victoria International Airport',
    city: 'Victoria',
    country: 'Canada'
  },
  {
    id: 'aa847b32-cd39-4a4e-b2b1-57953dd549b7',
    code: 'YLW',
    name: 'Kelowna International Airport',
    city: 'Kelowna',
    country: 'Canada'
  },
  {
    id: '69601752-d9a0-4142-93bd-c122195e9ca8',
    code: 'YXE',
    name: 'Saskatoon John G. Diefenbaker International Airport',
    city: 'Saskatoon',
    country: 'Canada'
  },
  {
    id: 'af6b4ec6-90e5-41f8-bdc3-14a5f8c79d81',
    code: 'YQR',
    name: 'Regina International Airport',
    city: 'Regina',
    country: 'Canada'
  },
  {
    id: '898a9743-150a-421e-8495-64a74ebb3711',
    code: 'YQM',
    name: 'Greater Moncton Roméo LeBlanc International Airport',
    city: 'Moncton',
    country: 'Canada'
  },
  {
    id: 'b4183787-d9e7-4c29-939d-1cc1cfc72b19',
    code: 'YTZ',
    name: 'Billy Bishop Toronto City Airport',
    city: 'Toronto',
    country: 'Canada'
  },
  {
    id: '9dcbc1d9-be92-4db5-b263-3b4131c34dc4',
    code: 'YXX',
    name: 'Abbotsford International Airport',
    city: 'Abbotsford',
    country: 'Canada'
  },
  {
    id: '0412c6d0-d32f-42a9-b10c-47c9ace34fa5',
    code: 'YZF',
    name: 'Yellowknife Airport',
    city: 'Yellowknife',
    country: 'Canada'
  },
  {
    id: '2038bdea-5e80-4022-bdbc-3598056bac48',
    code: 'YXY',
    name: 'Whitehorse International Airport',
    city: 'Whitehorse',
    country: 'Canada'
  },
  {
    id: '950d78c3-b084-4ae1-929a-67678322d737',
    code: 'DOH',
    name: 'Hamad International Airport',
    city: 'Doha',
    country: 'Qatar'
  },
  {
    id: 'f7b4f062-bbb4-4fda-b554-0cd8bf398591',
    code: 'HKG',
    name: 'Hong Kong International Airport',
    city: 'Hong Kong',
    country: 'Hong Kong'
  },
  {
    id: '42fb9788-abab-4395-be2c-0ee891a161d6',
    code: 'PVG',
    name: 'Shanghai Pudong International Airport',
    city: 'Shanghai',
    country: 'China'
  },
  {
    id: '3441bb11-88f1-4a12-80b0-21e3be5eed30',
    code: 'NRT',
    name: 'Narita International Airport',
    city: 'Narita',
    country: 'Japan'
  },
  {
    id: '5a800d84-1344-4d31-ba48-b2ec91e1ecbf',
    code: 'AUH',
    name: 'Abu Dhabi International Airport',
    city: 'Abu Dhabi',
    country: 'United Arab Emirates'
  },
  {
    id: '5bde4de8-9794-4c83-8875-f9bb5afd1ce3',
    code: 'DAL',
    name: 'Dallas Love Field',
    city: 'Dallas',
    country: 'United States'
  },
  {
    id: '5e6683fd-b515-41af-ac44-0c692da53793',
    code: 'LGW',
    name: 'London Gatwick Airport',
    city: 'London',
    country: 'United Kingdom'
  },
  {
    id: 'b0bc37be-cb87-464d-9316-1590d10a472a',
    code: 'SCL',
    name: 'Arturo Merino Benítez International Airport',
    city: 'Santiago',
    country: 'Chile'
  },
  {
    id: '66e75495-989a-450e-839b-897db9cf5200',
    code: 'BOG',
    name: 'El Dorado International Airport',
    city: 'Bogotá',
    country: 'Colombia'
  },
  {
    id: '0273a7e5-8c10-46e9-99d7-12b7f65cdc20',
    code: 'SGN',
    name: 'Tan Son Nhat International Airport',
    city: 'Ho Chi Minh City',
    country: 'Vietnam'
  },
  {
    id: 'b8d0a8f1-6662-4b7a-811c-409f6decfcf7',
    code: 'AKL',
    name: 'Auckland Airport',
    city: 'Auckland',
    country: 'New Zealand'
  },
  {
    id: '8c317906-4f20-40f0-b9ed-fa3533085cdb',
    code: 'JED',
    name: 'King Abdulaziz International Airport',
    city: 'Jeddah',
    country: 'Saudi Arabia'
  },
  {
    id: 'b2e9dd15-9834-4e3b-bf59-bbb29aff8cbc',
    code: 'TLV',
    name: 'Ben Gurion Airport',
    city: 'Tel Aviv',
    country: 'Israel'
  },
  {
    id: '7f90354e-d083-48c7-a241-2b83ac4ec36d',
    code: 'HNL',
    name: 'Daniel K. Inouye International Airport',
    city: 'Honolulu',
    country: 'United States'
  },
  {
    id: '9b89762a-74d8-4389-915f-ce55daba1c48',
    code: 'CMB',
    name: 'Bandaranaike International Airport',
    city: 'Colombo',
    country: 'Sri Lanka'
  }];

type Flight = {
    id: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    origin: {
      code: string;
      name: string;
      city: string;
      country: string;
    };
    destination: {
      code: string;
      name: string;
      city: string;
      country: string;
    };
    duration: number;
    price: number;
    currency: string;
    availableSeats: number;
    status: string;
    airline: {
      code: string;
      name: string;
    };
};
  
type Trip = Flight[]; // A group of flights (for layovers)

const PlanePage = () => {
  
  const FlightCard = ({
    outbound,
    inbound,
    setMessage,
  }: {
    outbound: Flight[];
    inbound?: Flight[];
    setMessage: (message: string) => void;
  }) => {
    const [adding, setAdding] = useState(false);
    
    const handleAddToCart = async () => {
      const token = localStorage.getItem('accessToken');
      setMessage('');
    
      if (!token) {
        setMessage('⚠️ You must be logged in to do that.');
        return;
      }
    
      setAdding(true);
      const allFlights = inbound ? [...outbound, ...inbound] : outbound;
      const flightData = allFlights.map(flight => ({
        flightId: flight.id,
        origin: `${flight.origin.city}, ${flight.origin.country} (${flight.origin.code})`,
        destination: `${flight.destination.city}, ${flight.destination.country} (${flight.destination.code})`,
        price: flight.price,
        departureDate: flight.departureTime,
      }));
    
      if (flightData.length === 0) {
        setMessage('No flights found.');
        setAdding(false);
        return;
      }
    
      try {
        let successCount = 0;
        for (const flight of flightData) {
          const res = await fetch('/api/cart/flight', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(flight),
          });
    
          const data = await res.json();
    
          if (!res.ok) {
            throw new Error(data.error || `Failed to add flight ${flight.flightId}`);
          }
    
          successCount++;
          setUnreadCount((prev: number) => prev + 1);
        }
    
        if (successCount > 0) {
          setMessage(`✅ Added ${successCount} flight(s) to cart.`);
        } else {
          setMessage('⚠️ No flights were added to cart.');
        }
      } catch (error: any) {
        setMessage(`⚠️ ${error.message}`);
      } finally {
        setAdding(false);
      }
    };
    
    const renderFlight = (flight: Flight, label?: string) => (
      <div key={flight.id} className="mb-2">
        {label && <p className="text-xs font-semibold text-gray-400">{label}</p>}
        <h3 className="text-md font-semibold text-blue-600">
          {flight.airline.name} – {flight.origin.city} ({flight.origin.code}) → {flight.destination.city} ({flight.destination.code})
        </h3>
        <p className="text-sm">
          Depart: {new Date(flight.departureTime).toLocaleString()} → Arrive: {new Date(flight.arrivalTime).toLocaleString()}
        </p>
        <p className="text-sm">Duration: {flight.duration} mins</p>
        <p className="text-sm">Price: ${flight.price.toFixed(2)} {flight.currency}</p>
        <p className="text-sm">Status: {flight.status}</p>
        <p className="text-sm">Seats left: {flight.availableSeats}</p>
      </div>
    );
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 border dark:border-gray-700">
        {outbound.map((flight, index) =>
          renderFlight(flight, index === 0 ? 'Departure' : 'Layover')
        )}

        {inbound && (
          <div className="mt-4 border-t pt-2">
            {inbound.map((flight, index) =>
              renderFlight(flight, index === 0 ? 'Return' : 'Layover')
            )}
          </div>
        )}

        <div className="mt-4 flex flex-col space-y-2">
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
            {adding ? 'Adding...' : 'Add to cart'}
          </button>
          
        </div>
      </div>
    );
  };
  
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('oneWay');
  const { setUnreadCount } = useNotification();
  const [message, setMessage] = useState('');
  const [whereFrom, setWhereFrom] = useState('');
  const [showSuggestionsFrom, setShowSuggestionsFrom] = useState(false);
  const [originCity, setOriginCity] = useState('');
  const [originAirport, setOriginAirport] = useState('');
  
  const [whereTo, setWhereTo] = useState('');
    const [showSuggestionsTo, setShowSuggestionsTo] = useState(false);
    const [destinationCity, setDestinationCity] = useState('');
    const [destinationAirport, setDestinationAirport] = useState('');

    const [leaveDate, setLeaveDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [flights, setFlights] = useState<any>(null);

    const getFiltered = (input: string) => {
        const inputLower = input.toLowerCase();
        const matchedCities = cities.filter(({ city }) =>
            city.toLowerCase().startsWith(inputLower)
        );
        const matchedAirports = airports.filter(({ name, code, city }) =>
            name.toLowerCase().includes(inputLower) ||
            code.toLowerCase().includes(inputLower) ||
            city.toLowerCase().includes(inputLower)
        );
        return { matchedCities, matchedAirports };
    };

    const handleSuggestionClick = (
        type: 'city' | 'airport',
        value: any,
        field: 'from' | 'to'
    ) => {
        if (field === 'from') {
            if (type === 'city') {
                setWhereFrom(`${value.city}, ${value.country}`);
                setOriginCity(value.city);
                setOriginAirport('');
            } else {
                setWhereFrom(`${value.name} (${value.code})`);
                setOriginCity(value.city);
                setOriginAirport(value.code);
            }
            setShowSuggestionsFrom(false);
        } else {
            if (type === 'city') {
                setWhereTo(`${value.city}, ${value.country}`);
                setDestinationCity(value.city);
                setDestinationAirport('');
            } else {
                setWhereTo(`${value.name} (${value.code})`);
                setDestinationCity(value.city);
                setDestinationAirport(value.code);
            }
            setShowSuggestionsTo(false);
        }
    };

    const handleSearch = async () => {
        const params = new URLSearchParams({
            origin: originCity,
            destination: destinationCity,
            date: leaveDate,
            tripType,
        });

        if (originAirport) params.append("origin", originAirport);
        if (destinationAirport) params.append("destination", destinationAirport);
        if (tripType === "roundTrip" && returnDate) params.append("returnDate", returnDate);

        try {
            const res = await fetch(`/api/flights/search?${params.toString()}`);
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || "Failed to fetch flights");
            } else {
                setFlights(data);
            }
        } catch (err) {
            console.error("Search error", err);
        }
    };

    const { matchedCities: matchedCitiesFrom, matchedAirports: matchedAirportsFrom } = getFiltered(whereFrom);
    const { matchedCities: matchedCitiesTo, matchedAirports: matchedAirportsTo } = getFiltered(whereTo);

    return (
        <div className="min-h-screen bg-gray-100 text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
            <Header />
            <div className="container mx-auto p-4">
                <div className="flex gap-4 items-center mb-6">
                    <label className="text-sm font-medium">Trip Type:</label>
                    <button
                        onClick={() => setTripType('oneWay')}
                        className={`px-3 py-1 rounded-md border ${tripType === 'oneWay' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 dark:bg-gray-700 dark:text-white'}`}
                    >
                        One-way
                    </button>
                    <button
                        onClick={() => setTripType('roundTrip')}
                        className={`px-3 py-1 rounded-md border ${tripType === 'roundTrip' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 dark:bg-gray-700 dark:text-white'}`}
                    >
                        Round-trip
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-6 relative">
                    {/* Where From */}
                    <div className="flex-1 relative">
                        <label htmlFor="whereFrom" className="block mb-1 text-sm font-medium">Where from?</label>
                        <input
                            id="whereFrom"
                            type="text"
                            autoComplete="off"
                            value={whereFrom}
                            onChange={(e) => {
                                setWhereFrom(e.target.value);
                                setShowSuggestionsFrom(true);
                            }}
                            onFocus={() => setShowSuggestionsFrom(true)}
                            onBlur={() => setTimeout(() => setShowSuggestionsFrom(false), 300)}
                            className="w-full p-2 border rounded-md bg-white text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none"
                        />
                        {showSuggestionsFrom && (matchedCitiesFrom.length > 0 || matchedAirportsFrom.length > 0) && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border rounded-md shadow-lg max-h-60 overflow-auto">
                                {matchedCitiesFrom.map((item, idx) => (
                                    <div key={`from-city-${idx}`} onClick={() => handleSuggestionClick('city', item, 'from')} className="px-3 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-600">{item.city}, {item.country}</div>
                                ))}
                                {matchedAirportsFrom.map((item, idx) => (
                                    <div key={`from-airport-${idx}`} onClick={() => handleSuggestionClick('airport', item, 'from')} className="px-3 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-600">{item.name} ({item.code})</div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Where To */}
                    <div className="flex-1 relative">
                        <label htmlFor="whereTo" className="block mb-1 text-sm font-medium">Where to?</label>
                        <input
                            id="whereTo"
                            type="text"
                            autoComplete="off"
                            value={whereTo}
                            onChange={(e) => {
                                setWhereTo(e.target.value);
                                setShowSuggestionsTo(true);
                            }}
                            onFocus={() => setShowSuggestionsTo(true)}
                            onBlur={() => setTimeout(() => setShowSuggestionsTo(false), 300)}
                            className="w-full p-2 border rounded-md bg-white text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none"
                        />
                        {showSuggestionsTo && (matchedCitiesTo.length > 0 || matchedAirportsTo.length > 0) && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border rounded-md shadow-lg max-h-60 overflow-auto">
                                {matchedCitiesTo.map((item, idx) => (
                                    <div key={`to-city-${idx}`} onClick={() => handleSuggestionClick('city', item, 'to')} className="px-3 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-600">{item.city}, {item.country}</div>
                                ))}
                                {matchedAirportsTo.map((item, idx) => (
                                    <div key={`to-airport-${idx}`} onClick={() => handleSuggestionClick('airport', item, 'to')} className="px-3 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-600">{item.name} ({item.code})</div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Dates */}
                    <div className="flex-1">
                        <label htmlFor="leaveDate" className="block mb-1 text-sm font-medium">Leave Date</label>
                        <input
                            id="leaveDate"
                            type="date"
                            value={leaveDate}
                            onChange={(e) => setLeaveDate(e.target.value)}
                            className="w-full p-2 border rounded-md bg-white text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none"
                        />
                    </div>

                    <div className="flex-1">
                        <label htmlFor="returnDate" className="block mb-1 text-sm font-medium">Return Date</label>
                        <input
                            id="returnDate"
                            type="date"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            disabled={tripType === 'oneWay'}
                            className={`w-full p-2 border rounded-md bg-white text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none ${tripType === 'oneWay' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    <div className="flex items-end">
                        <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors">
                            Search
                        </button>
                    </div>
                </div>

                {/* Results */}
                {flights && (
                    <div className="mt-8">
                      {message && (
                        <span className="text-sm text-gray-700 dark:text-gray-300">{message}</span>
                      )}
                        <h2 className="text-xl font-bold mb-4">Flight Results</h2>

                        {tripType === 'oneWay' && flights.outboundFlights.length === 0 && (
                            <p>No outbound flights found.</p>
                        )}
                        {tripType === 'roundTrip' && (flights.outboundFlights.length === 0 || flights.inboundFlights.length === 0) && (
                            <p>No round-trip flights found.</p>
                        )}

                        {tripType === 'oneWay' && flights.outboundFlights.map((trip: Trip, index: number) => (<FlightCard key={`outbound-${index}`} outbound={trip} setMessage={setMessage} />))}

                        {tripType === 'roundTrip' &&
                        flights.outboundFlights.flatMap((outbound: Trip, i: number) =>
                            flights.inboundFlights.map((inbound: Trip, j: number) => (
                            <FlightCard key={`round-${i}-${j}`} outbound={outbound} inbound={inbound} setMessage={setMessage}/>))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlanePage;