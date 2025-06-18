import { useEffect, useState } from 'react';
import GewogCard from '../../components/GewogCard';
import GewogFormModal from '../../components/GewogForm';
import { Plus, Search } from 'lucide-react';
import type { DzongkhagType, GewogType, GewogUpdateType } from '../../types';
import { useGewogStore } from '../../store/useGewogstore';
import Loading from '../../components/Loading';

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../../components/ui/select';
import { useDzongkhagStore } from '../../store/useDzongkhagStore';

const GewogManagement = () => {
  const {
    gewogsLoading,
    error,
    gewogs,
    updateGewog,
    createGewog,
    deleteGewog,
    fetchGewogs,
  } = useGewogStore();

  const {
    dzongkhagLoading,
    dzongkhags,
    fetchDzongkhags,
  } = useDzongkhagStore();

  const [search, setSearch] = useState('');
  const [selectedDzongkhag, setSelectedDzongkhag] = useState<string>('all');
  const [formData, setFormData] = useState<Partial<GewogType>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (gewogs.length === 0) {
      fetchGewogs();
    }
  }, [fetchGewogs]);

  useEffect(() => {
    if (!dzongkhagLoading && dzongkhags.length === 0) {
      fetchDzongkhags();
    }
  }, [dzongkhagLoading, dzongkhags, fetchDzongkhags]);

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

    const dzongkhagMatch =
      selectedDzongkhag !== 'all'
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

  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
  if (gewogsLoading || dzongkhagLoading) return <Loading />;

  return (
    <div className="p-6 space-y-6">
      {/* Bhutan Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 shadow-md mb-6">
        {/* Left Section: Title & Description */}
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">Gewog Management</h1>
        </div>

        {/* Right Section: Stats */}
        <div className="mt-4 md:mt-0 text-right">
          <span className="text-sm text-white/80">Total Gewogs</span>
          <div className="text-3xl font-extrabold text-white mt-1">{gewogs.length}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-4 items-center w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search Gewogs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Select value={selectedDzongkhag} onValueChange={setSelectedDzongkhag}>
            <SelectTrigger className="w-[180px] rounded-xl text-sm">
              <SelectValue placeholder="All Dzongkhags" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Dzongkhags</SelectItem>
              {[...dzongkhags]
                .filter((d) => d && d._id)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((d) => (
                  <SelectItem key={d._id} value={d._id}>
                    {d.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
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

      {/* Gewog Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredGewogs.map((g) => (
          <GewogCard
            key={g._id}
            gewog={g}
            onEdit={handleEdit}
            onDelete={handleDelete}
            getDzongkhagName={getDzongkhagName}
          />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <GewogFormModal
          isEditing={isEditing}
          formData={formData}
          dzongkhags={dzongkhags}
          onChange={(field) =>
            setFormData((prev) => ({
              ...prev,
              ...field,
              coordinates: field.coordinates
                ? {
                  latitude: field.coordinates.latitude ?? prev.coordinates?.latitude ?? null,
                  longitude: field.coordinates.longitude ?? prev.coordinates?.longitude ?? null,
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
