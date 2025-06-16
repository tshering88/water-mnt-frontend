import React from 'react';
import type { DzongkhagType, GewogUpdateType } from '../types';

type Props = {
  isEditing: boolean;
  formData: GewogUpdateType;
  dzongkhags: DzongkhagType[];
  onChange: (field: Partial<GewogUpdateType>) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

const GewogForm: React.FC<Props> = ({
  isEditing,
  formData,
  dzongkhags,
  onChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-br from-white to-blue-50">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            {isEditing ? 'Edit Gewog' : 'Add New Gewog'}
          </h2>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Name (English)</label>
              <input
                type="text"
                placeholder="e.g., Chukha"
                value={formData.name || ''}
                onChange={(e) => onChange({ name: e.target.value })}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Dzongkha Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Name (Dzongkha)</label>
              <input
                type="text"
                placeholder="ཆུ་ཁ་"
                value={formData.nameInDzongkha || ''}
                onChange={(e) => onChange({ nameInDzongkha: e.target.value })}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Dzongkhag */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Dzongkhag</label>
              <select
                value={
                  typeof formData.dzongkhag === 'string'
                    ? formData.dzongkhag
                    : formData.dzongkhag?._id || ''
                }
                onChange={(e) => onChange({ dzongkhag: e.target.value })}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select Dzongkhag</option>
                {dzongkhags.map((dz) => (
                  <option key={dz._id} value={dz._id}>
                    {dz.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Population */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Population</label>
              <input
                type="number"
                placeholder="e.g., 3000"
                value={formData.population ?? ''}
                onChange={(e) =>
                  onChange({ population: e.target.value ? parseInt(e.target.value) : undefined })
                }
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Area */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Area (sq. km)</label>
              <input
                type="number"
                placeholder="e.g., 120.5"
                value={formData.area ?? ''}
                onChange={(e) =>
                  onChange({ area: e.target.value ? parseFloat(e.target.value) : undefined })
                }
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Latitude */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Latitude</label>
              <input
                type="number"
                placeholder="e.g., 27.456"
                value={formData.coordinates?.latitude ?? ''}
                onChange={(e) =>
                  onChange({
                    coordinates: {
                      ...formData.coordinates,
                      latitude: e.target.value ? parseFloat(e.target.value) : null,
                      longitude: formData.coordinates?.longitude ?? null, // ensure no undefined
                    },
                  })

                }
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Longitude */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Longitude</label>
              <input
                type="number"
                placeholder="e.g., 89.640"
                value={formData.coordinates?.longitude ?? ''}
                onChange={(e) =>
                  onChange({
                    coordinates: {
                      ...formData.coordinates,
                      longitude: e.target.value ? parseFloat(e.target.value) : null,
                      latitude: formData.coordinates?.latitude ?? null,
                    },
                  })

                }
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="rounded-xl bg-white border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            {isEditing ? 'Update Gewog' : 'Create Gewog'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GewogForm;
