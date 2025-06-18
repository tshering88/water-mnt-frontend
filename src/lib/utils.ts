import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ConnectionType, ConsumerStatus, RegionType, TariffCategory, UserRole } from "./constant"
import type { Consumer, ConsumerFormType} from "../types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getRoleBadgeColor = (role: string): string => {
  const roleColors: Record<string, string> = {
    super_admin: 'bg-red-100 text-red-700 border-red-200',
    dzongkhag_admin: 'bg-orange-100 text-orange-700 border-orange-200',
    gewog_operator: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    meter_reader: 'bg-blue-100 text-blue-700 border-blue-200',
    technician: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    quality_inspector: 'bg-purple-100 text-purple-700 border-purple-200',
    financial_officer: 'bg-pink-100 text-pink-700 border-pink-200',
    viewer: 'bg-gray-100 text-gray-700 border-gray-200',
    consumer: 'bg-green-100 text-green-700 border-green-200',
  }

  return roleColors[role] || 'bg-neutral-100 text-neutral-700 border-neutral-200'
}

export const getRegionBadgeColor = (region: RegionType): string => {
  const regionColors: Record<RegionType, string> = {
    [RegionType.WESTERN]: 'bg-blue-400 text-blue-700 border-blue-200',
    [RegionType.CENTRAL]: 'bg-green-400 text-green-700 border-green-200',
    [RegionType.SOUTHERN]: 'bg-yellow-400 text-yellow-700 border-yellow-200',
    [RegionType.EASTERN]: 'bg-purple-400 text-purple-700 border-purple-200',
  }

  return regionColors[region] || 'bg-neutral-400 text-neutral-700 border-neutral-200'
}


export const roleGroups = [
  {
    label: 'Administrators',
    roles: [
      { label: 'Super Admin', value: UserRole.SUPER_ADMIN },
      { label: 'Dzongkhag Admin', value: UserRole.DZONGKHAG_ADMIN },
    ],
  },
  {
    label: 'Operators',
    roles: [
      { label: 'Gewog Operator', value: UserRole.GEWOG_OPERATOR },
      { label: 'Meter Reader', value: UserRole.METER_READER },
      { label: 'Technician', value: UserRole.TECHNICIAN },
    ],
  },
  {
    label: 'Quality & Finance',
    roles: [
      { label: 'Quality Inspector', value: UserRole.QUALITY_INSPECTOR },
      { label: 'Financial Officer', value: UserRole.FINANCIAL_OFFICER },
    ],
  },
  {
    label: 'Others',
    roles: [
      { label: 'Viewer', value: UserRole.VIEWER },
      { label: 'Consumer', value: UserRole.CONSUMER },
    ],
  },
]




export const getStatusColor = (status?: ConsumerStatus): string => {
  switch (status) {
    case 'Active': 
      return ' text-green-800';
    case 'Suspended': 
      return 'text-yellow-800';
    case 'Disconnected': 
      return ' text-red-800';
    default: 
      return ' text-gray-800';
  }
};




export const emptyConsumerForm: ConsumerFormType = {
  householdId: '',
  householdHead: '',
  householdHeadName: '',
  householdHeadCid: '',
  householdHeadPhone: '',
  addressDzongkhag: '',
  addressGewog: '',
  addressVillage: '',
  addressHouseNumber: '',
  familySize: 1,
  connectionType: ConnectionType.INDIVIDUAL,
  meterNumber: '',
  connectionDate: '',
  status: ConsumerStatus.ACTIVE,
  tariffCategory: TariffCategory.DOMESTIC,
};

export const initializeFormDataFromConsumer = (consumer: Consumer): ConsumerFormType => ({
  _id: consumer._id,
  householdId: consumer.householdId,
  householdHead: consumer.householdHead._id,
  householdHeadName: consumer.householdHead.name,
  householdHeadCid: consumer.householdHead.cid,
  householdHeadPhone: consumer.householdHead.phone,
  addressDzongkhag: '', // populate later if needed
  addressGewog: consumer.address.gewog?._id || '',
  addressVillage: consumer.address.village,
  addressHouseNumber: consumer.address.houseNumber,
  familySize: consumer.familySize,
  connectionType: consumer.connectionType,
  meterNumber: consumer.meterNumber,
  connectionDate: consumer.connectionDate,
  status: consumer.status,
  tariffCategory: consumer.tariffCategory,
});













