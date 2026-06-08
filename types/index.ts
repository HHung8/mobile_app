export interface Property {
    id: string;
    title: string;
    description: string;
    price: number;
    type: string;
    bedrooms: number;
    bathrooms: number;
    area_sqft: number;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    images: string[];
    isFeatured: boolean;
    isSold: boolean;
    created_at: string; 
}

export interface SavedItem {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
  property: Property;
}