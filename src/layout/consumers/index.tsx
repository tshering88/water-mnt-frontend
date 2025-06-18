import { useEffect, useState } from 'react';
import type { Consumer, CreateConsumerPayload } from '../../types';
import { getConsumers, createConsumer, updateConsumer, deleteConsumer } from '../../api/consumerApi';
import ConsumerDialog from '../../components/ConsumerDialog';
import { toast } from 'react-toastify';
import { ConsumerTable } from '../../components/ConsumerTable';

import { ConfirmDialog } from '../../components/ConfirmationDialog';

export default function ConsumerManagement() {
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedConsumer, setSelectedConsumer] = useState<Consumer | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view' | null>(null);

  // New state for delete confirmation dialog
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getConsumers();
      setConsumers(data.data);
    } catch (error) {
      toast.error('Failed to load consumers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (payload: CreateConsumerPayload) => {
    try {
      await createConsumer(payload);
      await fetchData();
      toast.success('Consumer added successfully');
    } catch (error) {
      toast.error('Failed to add consumer');
      console.error(error);
    }
  };

  const handleUpdate = async (id: string, payload: CreateConsumerPayload) => {
    try {
      await updateConsumer(id, payload);
      await fetchData();
      toast.success('Consumer updated successfully');
    } catch (error) {
      toast.error('Failed to update consumer');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteConsumer(id);
      await fetchData();
      toast.success('Consumer deleted successfully');
    } catch (error) {
      toast.error('Failed to delete consumer');
      console.error(error);
    }
  };

  function onView(c: Consumer): void {
    setSelectedConsumer(c);
    setModalMode('view');
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Consumer Management</h1>
      <button
        onClick={() => {
          setSelectedConsumer(null);
          setModalMode('add');
        }}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Add Consumer
      </button>

      {loading && <p>Loading consumers...</p>}
      {!loading && consumers.length === 0 && <p>No consumers found.</p>}

      <ConsumerTable
        consumers={consumers}
        onView={onView}
        onEdit={(c) => {
          setSelectedConsumer(c);
          setModalMode('edit');
        }}
        onDelete={(id) => setConfirmDeleteId(id)} // Show confirm dialog instead of deleting directly
      />

      {(modalMode === 'add' || modalMode === 'edit') && (
        <ConsumerDialog
          isOpen={true}
          onClose={() => setModalMode(null)}
          isEdit={modalMode === 'edit'}
          consumer={modalMode !== 'add' ? selectedConsumer! : undefined}
          onSave={
            modalMode === 'add'
              ? handleAdd
              : (payload) => {
                if (!selectedConsumer) return;
                return handleUpdate(selectedConsumer._id, payload);
              }
          }
        />
      )}

      <ConfirmDialog open={!!confirmDeleteId} onConfirm={() => {
        if (confirmDeleteId) {
          handleDelete(confirmDeleteId);
          setConfirmDeleteId(null);
        }
      }} onCancel={() => setConfirmDeleteId(null)} />
    </div>
  );
}
