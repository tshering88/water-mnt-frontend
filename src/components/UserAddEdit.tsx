import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from './ui/dialog';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { roleGroups } from '../lib/utils';
import { Button } from './ui/button';
import { userSchema } from '../lib/validators';
import { UserRole } from '../lib/constant';
import type { UserFormValues } from '../types';
import { CardContent, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface UserAddEditProps {
  open: boolean;
  closeDialog: () => void;
  loading: boolean;
  onSubmit: (data: UserFormValues) => void;
  initialValues: UserFormValues | null;
}

const UserAddEdit: React.FC<UserAddEditProps> = ({
  open,
  closeDialog,
  loading,
  onSubmit,
  initialValues,
}) => {
  const [formData, setFormData] = useState<UserFormValues>({
    _id: '',
    name: '',
    phone: '',
    cid: '',
    role: UserRole.CONSUMER,
    password: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserFormValues, string>>>({});

  useEffect(() => {
    if (open) {
      setFormData(initialValues ?? {
        _id: '',
        name: '',
        phone: '',
        cid: '',
        role: UserRole.CONSUMER,
        password: '',
      });
      setErrors({});
    }
  }, [open, initialValues]);

  const handleChange = (field: keyof UserFormValues, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = userSchema().safeParse(formData);

    if (!result.success) {
      const fieldErrors: any = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof UserFormValues;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onSubmit({
      ...formData,
      _id: initialValues?._id || formData._id,
    });
    setFormData({
      _id: '',
      name: '',
      phone: '',
      cid: '',
      role: UserRole.CONSUMER,
      password: '',
    });
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent
        className="max-w-md bg-white right-0 top-30 my-auto translate-y-0 translate-x-0 fixed rounded-none shadow-lg border-l sm:rounded-none sm:max-w-md"
        style={{ marginLeft: 'auto' }}
      >
        <DialogHeader>
          <DialogTitle>{initialValues ? 'Edit User' : 'Add User'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit}>
          <CardContent className="space-y-4">
            {(['name', 'cid', 'phone'] as Array<keyof UserFormValues>).map((field) => (
              <div key={field}>
                <Input
                  value={formData[field] || ''}
                  onChange={(e) => handleChange(field, e.target.value)}
                  placeholder={`Enter ${field}`}
                  className={errors[field] ? 'border-red-500' : ''}
                />
                {errors[field] && (
                  <p className="text-red-500 text-sm">{errors[field]}</p>
                )}
              </div>
            ))}

            {!initialValues?._id && (
  <div>
    <Input
      type="password"
      value={formData.password || ''}
      onChange={(e) => handleChange('password', e.target.value)}
      placeholder="Enter password"
      className={errors.password ? 'border-red-500' : ''}
    />
    {errors.password && (
      <p className="text-red-500 text-sm">{errors.password}</p>
    )}
  </div>
)}


            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-gray-700">Role</Label>
              <Select value={formData.role} onValueChange={(value) => handleChange('role', value as UserRole)}>
                <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {roleGroups.map((group) => (
                    <SelectGroup key={group.label}>
                      <SelectLabel>{group.label}</SelectLabel>
                      {group.roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between mt-6 items-center gap-4">
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading}
              className="bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-md font-semibold tracking-widest transition disabled:opacity-50"
            >
              {loading ? (initialValues ? 'Updating...' : 'Adding...') : initialValues ? 'Update User' : 'Add User'}
            </Button>
          </CardFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserAddEdit;
