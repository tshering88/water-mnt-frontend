import type { Consumer, CreateConsumerPayload } from '../types';
import ConsumerDialog from './ConsumerDialog';

interface ModalsProps {
  showAdd: boolean;
  showEdit: boolean;
  showView: boolean;
  selectedConsumer: Consumer | null;
  onClose: () => void;
  onAdd: (data: CreateConsumerPayload) => void | Promise<void>;
  onUpdate: (id: string, data: CreateConsumerPayload) => void | Promise<void>;  // <-- Change here
}

export const ConsumerModals: React.FC<ModalsProps> = ({
  showAdd,
  showEdit,
  showView,
  selectedConsumer,
  onClose,
  onAdd,
  onUpdate,
}) => (
  <>
    {showAdd && (
      <ConsumerDialog
        isOpen={showAdd}
        onClose={onClose}
        isEdit={false}
        onSave={(data) => {
          onAdd(data);
          onClose();
        }}
      />
    )}
    {showEdit && selectedConsumer && (
      <ConsumerDialog
        isOpen={showEdit}
        onClose={onClose}
        consumer={selectedConsumer}
        isEdit={true}
        onSave={(data) => {
          onUpdate(selectedConsumer._id, data);  // Pass CreateConsumerPayload here now
          onClose();
        }}
      />
    )}
    {showView && selectedConsumer && (
      <ConsumerDialog
        isOpen={showView}
        onClose={onClose}
        consumer={selectedConsumer}
        isEdit={false}
      />
    )}
  </>
);
