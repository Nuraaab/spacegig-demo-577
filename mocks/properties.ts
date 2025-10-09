export type PropertyType = 'house' | 'apartment' | 'condo' | 'land' | 'commercial';
export type ListingType = 'rent' | 'sale';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  listingType: ListingType;
  propertyType: PropertyType;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  specs: {
    beds: number;
    baths: number;
    den: number;
    sqft: number;
  };
  amenities: string[];
  images: string[];
  featured: boolean;
}

export const AMENITIES = [
  'Wi-Fi',
  'TV',
  'Kitchen',
  'Washer',
  'Free parking',
  'Air conditioning',
  'Heating',
  'Pool',
  'Gym',
  'Pet friendly',
  'Balcony',
  'Garden',
];

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
];

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Loft',
    description: 'Stunning loft in the heart of downtown with floor-to-ceiling windows, exposed brick, and modern finishes. Walking distance to restaurants, shops, and entertainment. Perfect for urban professionals.',
    price: 2500,
    listingType: 'rent',
    propertyType: 'apartment',
    location: {
      address: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      country: 'United States',
      zipCode: '94102',
    },
    specs: {
      beds: 2,
      baths: 2,
      den: 0,
      sqft: 1200,
    },
    amenities: ['Wi-Fi', 'Air conditioning', 'Heating', 'Gym', 'Free parking'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    ],
    featured: true,
  },
  {
    id: '2',
    title: 'Luxury Beachfront Villa',
    description: 'Breathtaking oceanfront property with private beach access, infinity pool, and panoramic views. This architectural masterpiece features high-end finishes throughout and smart home technology.',
    price: 8500,
    listingType: 'rent',
    propertyType: 'house',
    location: {
      address: '456 Ocean Drive',
      city: 'Malibu',
      state: 'CA',
      country: 'United States',
      zipCode: '90265',
    },
    specs: {
      beds: 4,
      baths: 3,
      den: 1,
      sqft: 3500,
    },
    amenities: ['Wi-Fi', 'TV', 'Kitchen', 'Washer', 'Free parking', 'Pool', 'Air conditioning', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    ],
    featured: true,
  },
  {
    id: '3',
    title: 'Cozy Studio in Arts District',
    description: 'Charming studio apartment in the vibrant Arts District. Features exposed brick, hardwood floors, and large windows. Close to galleries, cafes, and public transit.',
    price: 1800,
    listingType: 'rent',
    propertyType: 'apartment',
    location: {
      address: '789 Art Street',
      city: 'Los Angeles',
      state: 'CA',
      country: 'United States',
      zipCode: '90013',
    },
    specs: {
      beds: 1,
      baths: 1,
      den: 0,
      sqft: 650,
    },
    amenities: ['Wi-Fi', 'Air conditioning', 'Heating'],
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    ],
    featured: false,
  },
  {
    id: '4',
    title: 'Spacious Family Home',
    description: 'Beautiful family home in quiet suburban neighborhood. Large backyard, updated kitchen, and plenty of space for everyone. Top-rated schools nearby.',
    price: 3200,
    listingType: 'rent',
    propertyType: 'house',
    location: {
      address: '321 Maple Avenue',
      city: 'Pasadena',
      state: 'CA',
      country: 'United States',
      zipCode: '91101',
    },
    specs: {
      beds: 3,
      baths: 2,
      den: 1,
      sqft: 2200,
    },
    amenities: ['Wi-Fi', 'TV', 'Kitchen', 'Washer', 'Free parking', 'Air conditioning', 'Heating', 'Garden', 'Pet friendly'],
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    ],
    featured: true,
  },
  {
    id: '5',
    title: 'Penthouse with City Views',
    description: 'Exclusive penthouse offering 360-degree city views. Features include a private rooftop terrace, chef\'s kitchen, and luxury finishes throughout. Building amenities include concierge and valet.',
    price: 6500,
    listingType: 'rent',
    propertyType: 'condo',
    location: {
      address: '555 Skyline Boulevard',
      city: 'San Diego',
      state: 'CA',
      country: 'United States',
      zipCode: '92101',
    },
    specs: {
      beds: 3,
      baths: 3,
      den: 1,
      sqft: 2800,
    },
    amenities: ['Wi-Fi', 'TV', 'Kitchen', 'Washer', 'Free parking', 'Air conditioning', 'Heating', 'Gym', 'Pool', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    ],
    featured: true,
  },
];
