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


export interface SavedProperty {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
  property: {
    id: string;
    title: string;
    description: string;
    price: number;
    type: string;
    bedrooms: number;
    bathrooms: number;
    areaSqft: number;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    images: string[];
    isFeatured: boolean;
    isSold: boolean;
    createdAt: string;
  };
}

export interface JwtPayload {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string; // thêm id
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
  isAdmin?: boolean | string;
}