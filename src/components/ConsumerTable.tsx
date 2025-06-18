import type { Consumer } from "../types";


interface ConsumerTableProps {
    consumers: Consumer[];
    onView: (c: Consumer) => void;
    onEdit: (c: Consumer) => void;
    onDelete: (id: string) => void;
}

export const ConsumerTable: React.FC<ConsumerTableProps> = ({ consumers, onEdit, onDelete }) => (
    <section className="overflow-x-auto b text-gray-800 rounded-xl shadow-sm border">
        <table className="w-full text-left">
            <thead className="bg-blue-600 text-black text-sm font-semibold">
                <tr>
                    <th className="p-4">Household ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Gewog</th>
                    <th className="p-4">Tariff</th>
                    <th className="p-4">Meter No.</th>
                    <th className="p-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {consumers.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="text-center p-6 ">
                            No consumers found.
                        </td>
                    </tr>
                ) : (
                    consumers.map((c) => (
                        <tr key={c.householdId} className="hover:bg-blue-50 bg-gray-200">
                            <td className="p-4 border-t">{c.householdId}</td>
                            <td className="p-4 border-t">{c.householdHead?.name ?? "N/A"}</td>
                            <td className="p-4 border-t">{c.status}</td>
                            <td className="p-4 border-t">{c.address?.gewog?.name ?? "N/A"}</td>  {/* <-- Fix here */}
                            <td className="p-4 border-t">{c.tariffCategory}</td>
                            <td className="p-4 border-t">{c.meterNumber}</td>
                            <td className="p-4 border-t text-right space-x-2">
                                <button onClick={() => onEdit(c)} className="text-green-600 hover:underline gap-4">Edit</button>
                                <button onClick={() => onDelete(c._id)} className="text-red-600 hover:underline">Delete</button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>

        </table>
    </section>
);
