import { useEffect, useState } from 'react';
import type { Consumer, CreateConsumerPayload } from '../../types';
import ConsumerDialog from '../../components/ConsumerDialog';
import { toast } from 'react-toastify';
import { ConsumerTable } from '../../components/ConsumerTable';

import { ConfirmDialog } from '../../components/ConfirmationDialog';
import Loading from '../../components/Loading';
import { useConsumerStore } from '../../store/useConsumerStore';
import { Button } from '../../components/ui/button';

export default function ConsumerManagement() {

  const { consumers, fetchConsumers, consumersLoading, addConsumer, updateConsumer, deleteConsumer } = useConsumerStore()
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
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 shadow-md mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 10-8 0v4m-2 4h12a2 2 0 012 2v5H2v-5a2 2 0 012-2z" />
            </svg>
            Consumer Management
          </h1>
        </div>
        <Button
          onClick={() => {
            setSelectedConsumer(null);
            setModalMode('add');
          }}
          className="mb-4 px-5 py-2.5 bg-gradient-to-r
        from-blue-600 to-indigo-600 text-white 
        text-sm font-medium rounded-lg shadow-md
         hover:from-blue-700 hover:to-indigo-700 transition-all duration-200">
          Add
        </Button>
      </div>

      {!consumersLoading && consumers.length === 0 && <p>No consumers found.</p>}

      <ConsumerTable
        consumers={consumers}
        onView={onView}
        onEdit={(c) => {
          setSelectedConsumer(c);
          setModalMode('edit');
        }}
        onDelete={(id) => setConfirmDeleteId(id)}
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
