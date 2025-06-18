import { Plus, Search } from 'lucide-react';

interface ConsumerFiltersProps {
  searchTerm: string;
  selectedStatus: string;
  selectedGewog: string;
  selectedTariff: string;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onGewogChange: (val: string) => void;
  onTariffChange: (val: string) => void;
  onAddClick: () => void;
}

export const ConsumerFilters: React.FC<ConsumerFiltersProps> = ({
  searchTerm,
  selectedStatus,
  selectedGewog,
  selectedTariff,
  onSearchChange,
  onStatusChange,
  onGewogChange,
  onTariffChange,
  onAddClick,
}) => (
  <section className="bg-gray-100 text-black p-6 rounded-xl shadow-sm border space-y-4">
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, ID, or meter..."
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
        />
      </div>

      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-3 py-2 border bg-white border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
      >
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Suspended">Suspended</option>
        <option value="Disconnected">Disconnected</option>
      </select>

      <select
        value={selectedGewog}
        onChange={(e) => onGewogChange(e.target.value)}
        className="px-3 py-2 border bg-white border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
      >
        <option value="">All Gewogs</option>
        <option value="Thimphu">Thimphu</option>
        <option value="Paro">Paro</option>
        <option value="Punakha">Punakha</option>
      </select>

      <select
        value={selectedTariff}
        onChange={(e) => onTariffChange(e.target.value)}
        className="px-3 bg-white py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
      >
        <option value="">All Categories</option>
        <option value="Domestic">Domestic</option>
        <option value="Commercial">Commercial</option>
        <option value="Industrial">Industrial</option>
        <option value="Institutional">Institutional</option>
      </select>

      <button
        onClick={onAddClick}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Plus className="w-4 h-4" /> Add
      </button>
    </div>
  </section>
);
