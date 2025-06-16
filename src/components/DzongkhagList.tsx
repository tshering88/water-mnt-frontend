import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Users, Mountain, Calendar, Hash } from 'lucide-react';
import { getRegionBadgeColor } from '../lib/utils';
import type { RegionType } from '../lib/constant';
import { Button } from './ui/button';
import type { DzongkhagType, DzongkhagUpdateType } from '../types';

type DzongkhagProps = {
  onEditDzongkhag: (dzongkhags: DzongkhagUpdateType) => void
  handleDeleteClick: (id: string, name: string) => Promise<void>
  dzongkhagData: DzongkhagType
}

const DzongkhagCard = ({ onEditDzongkhag, handleDeleteClick, dzongkhagData }: DzongkhagProps) => {

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
    <Card className="w-full h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-4 sm:gap-3 ">
              <Mountain className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 flex-shrink-0" />
              <span className="break-words">{dzongkhagData.name}</span>
            </CardTitle>
            <CardDescription className=" flex justify-around mt-4 text-lg font-medium text-black  break-words">
              <div>   {dzongkhagData?.nameInDzongkha} </div>

              <Badge className={`uppercase rounded-lg text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 ${getRegionBadgeColor(dzongkhagData.region as RegionType)} text-white self-start sm:self-auto flex-shrink-0`}>
                {dzongkhagData.region}
              </Badge>
            </CardDescription>
          </div>

        </div>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6">
        {/* Basic Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Code</p>
                <p className="text-base sm:text-lg font-bold text-gray-900 break-words">{dzongkhagData.code}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Population</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">{formatNumber(dzongkhagData.population ?? 0)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Mountain className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Area</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">{formatNumber(dzongkhagData.area ?? 0)} km²</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Coordinates</p>
                <p className="text-[12px] sm:text-sm font-bold text-gray-900 break-all">
                  {dzongkhagData.coordinates?.latitude}°N, {dzongkhagData.coordinates?.longitude}°E
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="border-t pt-4 sm:pt-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
            Record Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Created</p>
              <p className="text-xs sm:text-sm text-gray-900 break-words">{formatDate(dzongkhagData.createdAt)}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Last Updated</p>
              <p className="text-xs sm:text-sm text-gray-900 break-words">{formatDate(dzongkhagData.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 sm:p-6 rounded-xl">
          <h3 className="text-lg sm:text-xl font-semibold mb-3">Quick Stats</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="text-center sm:text-left">
              <p className="text-indigo-100 text-xs sm:text-sm">Population Density</p>
              <p className="text-xl sm:text-2xl font-bold">{dzongkhagData.population != null && dzongkhagData.area != null
                ? Math.round(dzongkhagData.population / dzongkhagData.area)
                : 'N/A'}</p>
              <p className="text-indigo-100 text-xs">people per km²</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-indigo-100 text-xs sm:text-sm">Region</p>
              <p className="text-xl sm:text-2xl font-bold break-words">{dzongkhagData.region}</p>
              <p className="text-indigo-100 text-xs">Bhutan</p>
            </div>
          </div>
        </div>
      </CardContent>

      <section className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 px-4 sm:px-6 pb-4 pt-2 border-t border-gray-200">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEditDzongkhag(dzongkhagData)}
          className="border border-indigo-500 text-indigo-600 hover:bg-indigo-50 w-full sm:w-auto"
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDeleteClick(dzongkhagData._id, dzongkhagData.name)}
          className="border border-red-500 text-red-600 hover:bg-red-50 w-full sm:w-auto"
        >
          Delete
        </Button>
      </section>
    </Card>
  );
};

export default DzongkhagCard;
