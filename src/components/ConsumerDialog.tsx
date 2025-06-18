import React, { useEffect, useState } from 'react';
import type { Consumer, CreateConsumerPayload, ConsumerFormType } from '../types';
import { emptyConsumerForm, initializeFormDataFromConsumer } from '../lib/utils';
import { useGewogStore } from '../store/useGewogstore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import ConsumerDetails from './ConsumerDetails';
import ConsumerForm from './ConsumerForm';

interface ConsumerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
  consumer?: Consumer;
  onSave?: (data: CreateConsumerPayload) => void;
}

const ConsumerDialog: React.FC<ConsumerDialogProps> = ({
  isOpen,
  onClose,
  consumer,
  isEdit = false,
  onSave,
}) => {
  const [formData, setFormData] = useState<ConsumerFormType>(emptyConsumerForm);

  const { gewogs, gewogsLoading, fetchGewogs } = useGewogStore();

  useEffect(() => {
    if (!gewogsLoading && gewogs.length === 0) fetchGewogs();
  }, [fetchGewogs, gewogsLoading, gewogs.length]);

  useEffect(() => {
    if (consumer) {
      setFormData(initializeFormDataFromConsumer(consumer));
    } else {
      setFormData(emptyConsumerForm);
    }
  }, [consumer]);

  const handleChange = <K extends keyof ConsumerFormType>(
    field: K,
    value: ConsumerFormType[K]
  ) => {
    setFormData((prev) => {
      if (field === 'addressDzongkhag') {
        return { ...prev, addressDzongkhag: value as string, addressGewog: '' };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSave = () => {
    if (!onSave) return;

    const payload: CreateConsumerPayload = {
      householdId: formData.householdId,
      householdHead: formData.householdHead ?? '',
      address: {
        gewog: formData.addressGewog,
        village: formData.addressVillage,
        houseNumber: formData.addressHouseNumber,
      },
      familySize: formData.familySize,
      connectionType: formData.connectionType,
      meterNumber: formData.meterNumber,
      connectionDate: formData.connectionDate,
      status: formData.status,
      tariffCategory: formData.tariffCategory,
    };

    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className='text-center'>
            {isEdit ? 'Edit Consumer' : consumer ? 'Consumer Details' : 'Add New Consumer'}
          </DialogTitle>
        </DialogHeader>

        {consumer && !isEdit ? (
          <ConsumerDetails data={formData} />
        ) : (
          <ConsumerForm
            formData={formData}
            onChange={handleChange}
            onCancel={onClose}
            onSubmit={handleSave}
            gewogs={gewogs}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConsumerDialog;
