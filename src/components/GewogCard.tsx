import React from 'react';
import { Edit, Trash2, MapPin, Landmark } from 'lucide-react';
import type { DzongkhagType, GewogType } from '../types';


type Props = {
  gewog: GewogType;
  onEdit: (gewog: GewogType) => void;
  onDelete: (id: string) => void;
  getDzongkhagName: (dzongkhag: string | DzongkhagType) => string;
};

const GewogCard: React.FC<Props> = ({ gewog, onEdit, onDelete, getDzongkhagName }) => {
  return (
    <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-white transition-transform hover:scale-[1.01]">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">{gewog.name}</h3>
          {gewog.nameInDzongkha && (
            <p className="text-sm opacity-90">{gewog.nameInDzongkha}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(gewog)}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(gewog._id!)}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3 text-sm text-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Dzongkhag:</span>
          <span className="flex items-center gap-1 font-medium">
            <Landmark className="w-4 h-4 text-blue-500" />
            {getDzongkhagName(gewog.dzongkhag)}
          </span>
        </div>

        {gewog.population && (
          <div className="flex justify-between">
            <span className="text-gray-500">Population:</span>
            <span className="font-medium">
              {gewog.population.toLocaleString()}
            </span>
          </div>
        )}

        {gewog.area && (
          <div className="flex justify-between">
            <span className="text-gray-500">Area:</span>
            <span className="font-medium">{gewog.area} km²</span>
          </div>
        )}

        {gewog.coordinates?.latitude && gewog.coordinates?.longitude && (
          <div className="flex items-center gap-2 pt-2 text-xs text-gray-600">
            <MapPin className="w-4 h-4 text-blue-400" />
            {gewog.coordinates.latitude.toFixed(4)}, {gewog.coordinates.longitude.toFixed(4)}
          </div>
        )}
      </div>
    </div>
  );
}

export default GewogCard;
