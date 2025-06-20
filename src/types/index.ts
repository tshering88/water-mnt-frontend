import type { ConnectionType, ConsumerStatus, RegionType, TariffCategory, UserRole } from "../lib/constant";
// ===========================
// User Types
// ===========================
export type AddUserType = {
    name: string
    role?: UserRole
    cid: string;
    phone: string;
    password?: string;
};

export type LoginType = {
  identifier : string;
  password: string;
};

export type UserType = {
  _id: string;
  name: string;
  cid: string;
  phone?: string;
  role?: UserRole;
};

export type UserFormValues = {
  _id: string;
  name?: string;
  phone?: string;
  cid?: string;
  role?: UserRole;
  password?: string
};

export type UserUpdateType = {
  userId?: string;
  name?: string;
  cid?: string;
  phone?: string;
  role?: UserRole;
  password?: string
};

// ===========================
// User Response Types
// ===========================
export type RegisterResponse = {
  data: UserType;
  token: string;
};

export type LoginResponse = {
  message: string;
  token: string;
};

export type GetUsersResponse = {
  data: UserType[];
};

export type UpdateUsersResponse = {
  message: string;
  data: UserType;
};

export type DeleteUserResponse = {
  message: string;
};

/////////////////////
//  Dzongkhag Type //
/////////////////////

export type CoordinatesType =  {
    latitude: number | null;
    longitude: number| null;
  };


export type DzongkhagType = {
  _id: string;
  name: string;
  nameInDzongkha: string;
  code: string;
  region: RegionType;
  area: number | null;
  population: number | null;
  coordinates: CoordinatesType
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string

};

export type DzongkhagResponse = {
  data: DzongkhagType [];
  message: string;
};
export type CreateUpdateDzongkhagResponse = {
  data: DzongkhagType;
  message: string;
};


export type DzongkhagUpdateType = {
  _id: string;
  name?: string;
  nameInDzongkha?: string;
  code?: string;
  area: number | null;
  region?: RegionType;
  population?: number | null;
  coordinates?: CoordinatesType
};

/////////////////
// Gewog Type //
//////////////// 

export type GewogType = {
  _id: string;
  name: string;
  nameInDzongkha: string;
  dzongkhag: string | DzongkhagType; // Accept string ID or full object if populated
  area: number | null ;
  population: number | null;
  coordinates?: CoordinatesType
};

export type GewogResponse = {
  data: GewogType[];
  message: string;
};

export type CreateUpdateGewogResponse = {
  data: GewogType;
  message: string;
};

export type GewogUpdateType = {
  _id?: string;
  name?: string;
  nameInDzongkha?: string;
  dzongkhag?: string | DzongkhagType // Accept string ID or full object if populated
  area?: number | null;
  population?: number | null;
  coordinates?: CoordinatesType
};

//////////////////
//// Consumer////
////////////////

export type ConsumerResponse = {
  message: string
  data: Consumer
  meta: MetaType
}

export interface Consumer {
  _id: string;
  householdId: string;
  householdHead: {
    _id: string;
    name: string;
    phone: string;
    cid: string;
  };
  address: {
    gewog: {
      _id: string;
      name: string;
      nameInDzongkha: string;
    };
    village: string;
    houseNumber: string;
  };
  familySize: number;
  connectionType: ConnectionType;
  meterNumber: string;
  connectionDate: string; // ISO datetime string
  status: ConsumerStatus;
  tariffCategory: TariffCategory;
  createdAt: string;
  updatedAt: string;
  __v: number;
}



export type CreateConsumerPayload = {
  householdId: string;
  householdHead: string; // ObjectId string referring to household head
  address: {
    gewog: string; // ObjectId string referring to gewog
    village: string;
    houseNumber: string;
  };
  familySize: number;
  connectionType: ConnectionType
  meterNumber: string;
  connectionDate: string; // ISO date string, e.g. "2020-02-20"
  status: ConsumerStatus
  tariffCategory: TariffCategory
};



export interface HouseholdHead {
  _id: string
  name: string
  phone: string
  cid: string
}

export interface Address {
  gewog: Gewog
  village: string
  houseNumber: string
}

export interface Gewog {
  _id: string
  name: string
  nameInDzongkha: string
}


export type CreateUpdateConsumerResponse = {
  data: Consumer;
  message?: string; 
};

export type GetConsumersParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: ConsumerStatus | string;
  tariffCategory?: TariffCategory | string;
  gewog?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
};

export type MetaType = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type GetConsumersResponse = {
  data: Consumer[];
  meta: MetaType;
};

export type DeleteConsumerResponse = {
  message: string;
};

export type ConsumerPayload = {
  householdId: string;
  householdHead: string
  address: {
    dzongkhag: string; // ✅ Required
    gewog: string;
    village?: string;
    houseNumber?: string;
  };
  familySize?: number;
  connectionType: ConnectionType;
  meterNumber?: string;
  connectionDate?: Date | string;
  status?: ConsumerStatus;
  tariffCategory?: TariffCategory;
};

export type ConsumerFormType = {
  _id: string
  userId?: string
  householdId: string;
  householdHead?: string; // optional if not editing
  householdHeadName: string;
  householdHeadCid: string;
  householdHeadPhone: string;
  addressDzongkhag: string;
  addressGewog: string;
  addressVillage: string;
  addressHouseNumber: string;
  familySize: number;
  connectionType: ConnectionType;
  meterNumber: string;
  connectionDate: string;
  status: ConsumerStatus;
  tariffCategory: TariffCategory;
};



















