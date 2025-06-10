import { useEffect, useState } from 'react';
import GewogCard from '../../components/GewogCard';
import GewogFormModal from '../../components/GewogForm';

import {
  getDzongkhagsApi
} from '../../api/dzongkhagApi';
import { Plus, Search } from 'lucide-react';
import type { DzongkhagType, GewogType, GewogUpdateType } from '../../types';
import { useGewogStore } from '../../store/useGewogstore';

const GewogManagement = () => {
  const { gewogs, updateGewog, createGewog, deleteGewog, fetchGewogs } = useGewogStore();

  const [dzongkhags, setDzongkhags] = useState<DzongkhagType[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDzongkhag, setSelectedDzongkhag] = useState<string>('');
  const [formData, setFormData] = useState<Partial<GewogType>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchGewogs(); // load gewogs into store

        const dzongkhagsRes = await getDzongkhagsApi();
        setDzongkhags(Array.isArray(dzongkhagsRes.data) ? dzongkhagsRes.data : []);
      } catch (err) {
        setError('Failed to load data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchGewogs]);

  const handleEdit = (gewog: GewogType) => {
    setFormData(gewog);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGewog(id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && formData._id) {
        await updateGewog(formData._id, formData as GewogUpdateType);
      } else {
        await createGewog(formData as GewogUpdateType);
      }
      setIsModalOpen(false);
      setFormData({});
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredGewogs = gewogs.filter((g): g is GewogType => {
    if (!g || !g.name) return false;

    const nameMatch = g.name.toLowerCase().includes(search.toLowerCase());
    const dzongkhagMatch = selectedDzongkhag
      ? typeof g.dzongkhag === 'object'
        ? g.dzongkhag?._id === selectedDzongkhag
        : g.dzongkhag === selectedDzongkhag
      : true;

    return nameMatch && dzongkhagMatch;
  });

  const getDzongkhagName = (dzongkhag: string | DzongkhagType) =>
    typeof dzongkhag === 'string'
      ? dzongkhags.find((d) => d?._id === dzongkhag)?.name || 'Unknown'
      : dzongkhag?.name || 'Unknown';

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-4 items-center w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search Gewogs"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedDzongkhag}
            onChange={e => setSelectedDzongkhag(e.target.value)}
            className="border px-4 py-2 rounded-xl text-sm"
          >
            <option value="">All Dzongkhags</option>
            {dzongkhags
              .filter(d => d && d._id)
              .map(d => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
          </select>
        </div>

        <button
          onClick={() => {
            setIsModalOpen(true);
            setIsEditing(false);
            setFormData({});
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" /> Add Gewog
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredGewogs.map(g => (
          <GewogCard
            key={g._id}
            gewog={g}
            onEdit={handleEdit}
            onDelete={handleDelete}
            getDzongkhagName={getDzongkhagName}
          />
        ))}
      </div>

      {isModalOpen && (
        <GewogFormModal
          isEditing={isEditing}
          formData={formData}
          dzongkhags={dzongkhags}
          onChange={field =>
  setFormData(prev => ({
    ...prev,
    ...field,
    coordinates: field.coordinates
      ? {
          latitude: field.coordinates.latitude ?? prev.coordinates?.latitude ?? 0,
          longitude: field.coordinates.longitude ?? prev.coordinates?.longitude ?? 0,
        }
      : prev.coordinates,
  }))
}

          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setFormData({});
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
};

export default GewogManagement;
