import { Pencil, Trash2 } from "lucide-react";
import { getStatusColor } from "../lib/utils";
import type { Consumer } from "../types";

interface ConsumerTableProps {
  consumers: Consumer[];
  onEdit: (c: Consumer) => void;
  onDelete: (id: string) => void;
}

export const ConsumerTable: React.FC<ConsumerTableProps> = ({
  consumers,
  onEdit,
  onDelete,
}) => (
  <section className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
    {/* Desktop Table */}
    <table className="hidden md:table w-full text-sm text-left text-gray-700">
      <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold tracking-wide">
        <tr>
          <th className="px-4 py-3">Household ID</th>
          <th className="px-4 py-3">Name</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3">Gewog</th>
          <th className="px-4 py-3">Tariff</th>
          <th className="px-4 py-3">Meter No.</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {consumers.length === 0 ? (
          <tr>
            <td colSpan={7} className="text-center py-6 text-gray-500">
              No consumers found.
            </td>
          </tr>
        ) : (
          consumers.map((c, index) => (
            <tr
              key={c.householdId}
              className={`${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-blue-50 transition-colors`}
            >
              <td className="px-4 py-3 border-t">{c.householdId}</td>
              <td className="px-4 py-3 border-t">{c.householdHead?.name ?? "N/A"}</td>
              <td className="px-4 py-2 border-t">
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                    c.status
                  )}`}
                >
                  {c.status}
                </span>
              </td>
              <td className="px-4 py-3 border-t">{c.address?.gewog?.name ?? "N/A"}</td>
              <td className="px-4 py-3 border-t">{c.tariffCategory}</td>
              <td className="px-4 py-3 border-t">{c.meterNumber}</td>
              <td className="px-4 py-3 border-t text-right space-x-2">
                <button
                  onClick={() => onEdit(c)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(c._id)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>

    {/* Mobile Cards */}
    <div className="md:hidden space-y-4 p-4">
      {consumers.length === 0 ? (
        <p className="text-center text-gray-500">No consumers found.</p>
      ) : (
        consumers.map((c) => (
          <div
            key={c.householdId}
            className="bg-white shadow-sm rounded-lg border p-4 space-y-2"
          >
            <div className="flex justify-between">
              <h4 className="font-semibold text-indigo-600">{c.householdHead?.name ?? "N/A"}</h4>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getStatusColor(
                  c.status
                )}`}
              >
                {c.status}
              </span>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Household ID:</strong> {c.householdId}</p>
              <p><strong>Gewog:</strong> {c.address?.gewog?.name ?? "N/A"}</p>
              <p><strong>Tariff:</strong> {c.tariffCategory}</p>
              <p><strong>Meter No.:</strong> {c.meterNumber}</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => onEdit(c)}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1 rounded transition"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(c._id)}
                className="text-red-600 hover:text-red-800 hover:bg-red-100 p-1 rounded transition"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </section>
);
