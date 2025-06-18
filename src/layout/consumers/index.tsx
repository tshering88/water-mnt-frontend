import { useEffect, useState } from 'react';
import type { Consumer, CreateConsumerPayload } from '../../types';
import ConsumerDialog from '../../components/ConsumerDialog';
import { toast } from 'react-toastify';
import { ConsumerTable } from '../../components/ConsumerTable';

import { ConfirmDialog } from '../../components/ConfirmationDialog';
import Loading from '../../components/Loading';
import { useConsumerStore } from '../../store/useConsumerStore';

export default function ConsumerManagement() {

  const { consumers, fetchConsumers, consumersLoading ,addConsumer,updateConsumer,deleteConsumer} = useConsumerStore()
  const [selectedConsumer, setSelectedConsumer] = useState<Consumer | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view' | null>(null);

  // New state for delete confirmation dialog
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);


  useEffect(() => {
    if (consumers.length === 0) {
      fetchConsumers()
    }
  }, [fetchConsumers])

  const handleAdd = async (payload: CreateConsumerPayload) => {
    try {
      await addConsumer(payload);
      await fetchConsumers();
      toast.success('Consumer added successfully');
    } catch (error) {
      toast.error('Failed to add consumer');
      console.error(error);
    }
  };

  const handleUpdate = async (id: string, payload: CreateConsumerPayload) => {
    try {
      await updateConsumer(id, payload);
      await fetchConsumers();
      toast.success('Consumer updated successfully');
    } catch (error) {
      toast.error('Failed to update consumer');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteConsumer(id);
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

  if (consumersLoading) {
    return <Loading />
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


      {!consumersLoading && consumers.length === 0 && <p>No consumers found.</p>}

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
