import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ConnectionType, ConsumerStatus, TariffCategory } from '../lib/constant';
import { DialogFooter } from './ui/dialog';
import type { ConsumerFormType, GewogType } from '../types';
import { useUserStore } from '../store/useUserStore';
import { toast } from 'react-toastify';
import { Phone, User, UserCheck } from 'lucide-react';

interface Props {
  formData: ConsumerFormType;
  onChange: <K extends keyof ConsumerFormType>(
    field: K,
    value: ConsumerFormType[K]
  ) => void;
  onCancel: () => void;
  onSubmit: () => void;
  gewogs: GewogType[];
}

const ConsumerForm: React.FC<Props> = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
  gewogs,
}) => {

  const { users, fetchUsers } = useUserStore()
  const [searchTerm, setSearchTerm] = useState('');
  const [matchedUser, setMatchedUser] = useState<null | {
    _id: string;
    name: string;
    phone: string;
    cid: string;
  }>(null);


  useEffect(() => {
    if (users.length === 0) {
      fetchUsers()
    }
  }, [fetchUsers])

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter CID or phone to search');
      setMatchedUser(null);
      return;
    }
    const foundUser = users.find(
      (user) =>
        user.cid === searchTerm.trim() || user.phone === searchTerm.trim()
    );
    if (foundUser) {
      onChange('householdHead', foundUser._id);
      setMatchedUser({
        _id: foundUser._id,
        name: foundUser.name,
        phone: foundUser.phone || '',
        cid: foundUser.cid,
      });
      toast.success(`User found: Household ID set`);
    } else {
      toast.error('No user found with that CID or phone');
      onChange('householdHead', '');
      setMatchedUser(null);
    }
  };

  const dzongkhagNames = Array.from(
    new Set(
      gewogs
        .map((g) =>
          typeof g.dzongkhag !== 'string' ? g.dzongkhag.name : null
        )
        .filter((name): name is string => name !== null)
    )
  );

  const filteredGewogs = gewogs.filter(
    (g) =>
      typeof g.dzongkhag !== 'string' &&
      g.dzongkhag.name === formData.addressDzongkhag
  );

  const handleSubmit = () => {
    if (!formData.addressGewog) {
      toast.error('Please select a Gewog');
      return;
    }
    if (!formData.addressVillage.trim()) {
      toast.error('Village is required');
      return;
    }
    if (!formData.addressHouseNumber.trim()) {
      toast.error('House Number is required');
      return;
    }
    if (!formData.connectionDate) {
      toast.error('Connection Date is required');
      return;
    }
    if (!formData.meterNumber.trim()) {
      toast.error('Meter Number is required');
      return;
    }
    onSubmit();
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {/* New Search Input + Button */}
      <div className="flex space-x-2 items-center">
        <Input
          placeholder="Search user by CID or Phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSearch} type="button" variant="outline">
          Search
        </Button>
      </div>

      {/* Show matched user info */}
      {matchedUser && (
        <div className="p-3 border border-gray-300 rounded-md bg-white shadow-sm text-sm text-gray-700 max-w-md mx-auto flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4 text-blue-500" />
            <span><strong className="font-medium text-gray-900">Name:</strong> {matchedUser.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4 text-green-500" />
            <span><strong className="font-medium text-gray-900">Phone:</strong> {matchedUser.phone}</span>
          </div>
          <div className="flex items-center gap-1">
            <UserCheck className="w-4 h-4 text-purple-500" />
            <span><strong className="font-medium text-gray-900">CID:</strong> {matchedUser.cid}</span>
          </div>
        </div>
      )}

      {/* Existing Household ID field */}
      <InputField
        label="household Head"
        value={formData.householdHead}
        onChange={(v: string) => onChange('householdHead', v)}
        required
        disabled
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Household ID"
          value={formData.householdId}
          onChange={(v: string) => onChange('householdId', v)}
          required
        />

        <SelectField
          label="Status"
          value={formData.status}
          options={Object.values(ConsumerStatus)}
          onChange={(v: ConsumerStatus) => onChange('status', v)}
        />

        <SelectField
          label="Dzongkhag"
          value={formData.addressDzongkhag}
          options={dzongkhagNames}
          onChange={(v: string) => onChange('addressDzongkhag', v)}
        />

        <SelectField
          label="Gewog"
          value={formData.addressGewog}
          options={filteredGewogs.map((g) => ({ label: g.name, value: g._id }))}
          onChange={(v: string) => onChange('addressGewog', v)}
          disabled={!formData.addressDzongkhag}
        />

        <InputField
          label="Village"
          value={formData.addressVillage}
          onChange={(v: string) => onChange('addressVillage', v)}
        />

        <InputField
          label="House Number"
          value={formData.addressHouseNumber}
          onChange={(v: string) => onChange('addressHouseNumber', v)}
        />

        <InputField
          label="Family Size"
          value={formData.familySize}
          onChange={(v: any) => onChange('familySize', Number(v))}
          type="number"
          min={1}
        />

        <SelectField
          label="Connection Type"
          value={formData.connectionType}
          options={Object.values(ConnectionType)}
          onChange={(v: ConnectionType) => onChange('connectionType', v)}
        />

        <InputField
          label="Meter Number"
          value={formData.meterNumber}
          onChange={(v: string) => onChange('meterNumber', v)}
        />

        <InputField
          label="Connection Date"
          type="date"
          value={
            formData.connectionDate
              ? new Date(formData.connectionDate).toISOString().split('T')[0]
              : ''
          }
          onChange={(v: string) => onChange('connectionDate', v)}
          required
        />

        <SelectField
          label="Tariff Category"
          value={formData.tariffCategory}
          options={Object.values(TariffCategory)}
          onChange={(v: TariffCategory) => onChange('tariffCategory', v)}
        />
      </div>

      <DialogFooter className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel} className='bg-red-700 text-white hover:cursor-pointer'>
          Cancel
        </Button>
        <Button type="submit" variant="default" className="border hover:cursor-pointer">
          Submit
        </Button>
      </DialogFooter>
    </form>
  );
};

const InputField: React.FC<any> = ({ label, value, onChange, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-900 mb-1">
      {label}
    </label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} {...props} />
  </div>
);

const SelectField: React.FC<any> = ({
  label,
  value,
  options,
  onChange,
  disabled,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-900 mb-1">
      {label}
    </label>
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={`Select ${label}`} />
      </SelectTrigger>
      <SelectContent className='bg-gray-300'>
        {options.map((opt: any) =>
          typeof opt === 'string' ? (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ) : (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  </div>
);

export default ConsumerForm;
