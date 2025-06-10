import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Users, Mountain,  Calendar, Hash } from 'lucide-react';
import { getRegionBadgeColor } from '../lib/utils';
import type { RegionType } from '../lib/constant';
import { Button } from './ui/button';
import type { DzongkhagType, DzongkhagUpdateType } from '../types';

type  DzongkhagProps={
    onEditDzongkhag: (dzongkhags: DzongkhagUpdateType) => void
     handleDeleteClick: (id: string, name: string) => Promise<void>
     dzongkhagData:DzongkhagType
}

const DzongkhagCard = ({onEditDzongkhag, handleDeleteClick,dzongkhagData}:DzongkhagProps) => {
 
  const formatNumber = (num: number | bigint) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6 flex items-center justify-center">
      <Card className="w-full max-w-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="pb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Mountain className="h-8 w-8 text-indigo-600" />
                {dzongkhagData.name}
              </CardTitle>
              <CardDescription className="text-2xl font-medium text-gray-700 mt-2">
                {dzongkhagData?.nameInDzongkha}
              </CardDescription>
            </div>
            <Badge className={`uppercase rounded-lg text-sm font-semibold px-4 py-2 ${getRegionBadgeColor(dzongkhagData.region as RegionType)} text-white`}>
              {dzongkhagData.region}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Basic Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Hash className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Code</p>
                  <p className="text-lg font-bold text-gray-900">{dzongkhagData.code}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Population</p>
                  <p className="text-lg font-bold text-gray-900">{formatNumber(dzongkhagData.population)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Mountain className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Area</p>
                  <p className="text-lg font-bold text-gray-900">{formatNumber(dzongkhagData.area)} km²</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Coordinates</p>
                  <p className="text-sm font-bold text-gray-900">
                    {dzongkhagData.coordinates?.latitude}°N, {dzongkhagData.coordinates?.longitude}°E
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Timestamps */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              Record Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Created</p>
                <p className="text-sm text-gray-900">{formatDate(dzongkhagData.createdAt)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-sm text-gray-900">{formatDate(dzongkhagData.updatedAt)}</p>
              </div>
            </div>
          </div>
          
          {/* Additional Stats */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-3">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-indigo-100 text-sm">Population Density</p>
                <p className="text-2xl font-bold">{Math.round(dzongkhagData.population / dzongkhagData.area)}</p>
                <p className="text-indigo-100 text-xs">people per km²</p>
              </div>
              <div>
                <p className="text-indigo-100 text-sm">Region</p>
                <p className="text-2xl font-bold">{dzongkhagData.region}</p>
                <p className="text-indigo-100 text-xs">Bhutan</p>
              </div>
            </div>
          </div>
        </CardContent>
             <section className="flex justify-end gap-3 px-6 pb-4 pt-2 border-t border-gray-2000">
                <Button
  size="sm"
  variant="outline"
  onClick={() => onEditDzongkhag(dzongkhagData)}
  className="border border-indigo-500 text-indigo-600 hover:bg-indigo-50"
>
  Edit
</Button>


                <Button
                  variant="destructive"
                  size="sm"
                   onClick={() => handleDeleteClick(dzongkhagData._id, dzongkhagData.name)}
                  className="border border-red-500 text-red-600 hover:bg-red-50"
                >
                  Delete
                </Button>
              </section>
      </Card>
    </div>
  );
};

export default DzongkhagCard;