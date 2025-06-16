import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { RegionType } from '../lib/constant';
import type { DzongkhagUpdateType } from '../types';

interface DzongkhagAddEditDialogProps {
  open: boolean;
  onClose: () => void;
  initialData: DzongkhagUpdateType| null; 
  onAddOrUpdate: (dzongkhag: DzongkhagUpdateType) => void;
}

const defaultForm: DzongkhagUpdateType = {
  name: '',
  nameInDzongkha: '',
  code: '',
  area: null,
  region: RegionType.WESTERN,
  population: undefined,
  coordinates: {
    latitude: null,
    longitude: null,
  },
  _id: ''
};

export default function DzongkhagAddEditDialog({
  open,
  onClose,
  initialData,
  onAddOrUpdate,
}: DzongkhagAddEditDialogProps) {
  const [form, setForm] = useState<DzongkhagUpdateType>(defaultForm);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  if (name === 'latitude' || name === 'longitude') {
    const parsedValue = parseFloat(value) || 0;
    setForm((prev) => ({
      ...prev,
      coordinates: {
        latitude:
          name === 'latitude'
            ? parsedValue
            : prev.coordinates?.latitude ?? 0,
        longitude:
          name === 'longitude'
            ? parsedValue
            : prev.coordinates?.longitude ?? 0,
      },
    }));
  } else if (name === 'area' || name === 'population') {
    setForm((prev) => ({
      ...prev,
      [name]: value === '' ? 0 : parseFloat(value),
    }));
  } else {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddOrUpdate(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle>{form.code ? 'Edit Dzongkhag' : 'Add Dzongkhag'}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <Input
            name="nameInDzongkha"
            value={form.nameInDzongkha}
            onChange={handleChange}
            placeholder="Name in Dzongkha"
          />
          <Input
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Code"
            required
          />
          <Input
            name="area"
            type="number"
            value={form.area ?? ''} // ✅ Converts `null` to an empty string
            onChange={handleChange}
            placeholder="Area"
          />

          <select
            name="region"
            value={form.region}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 p-2"
          >
            {Object.values(RegionType).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <Input
            name="population"
            type="number"
            value={form.population ?? ''}
            onChange={handleChange}
            placeholder="Population"
          />

          {/* Coordinate Inputs */}
          <Input
            name="latitude"
            type="number"
            value={form.coordinates?.latitude ?? ''}
            onChange={handleChange}
            placeholder="Latitude"
          />
          <Input
            name="longitude"
            type="number"
            value={form.coordinates?.longitude ?? ''}
            onChange={handleChange}
            placeholder="Longitude"
          />

          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 text-white">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
