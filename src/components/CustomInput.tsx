
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Input } from './ui/input';
import { FormLabel } from './ui/form';

interface CustomInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
}

const CustomInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
}: CustomInputProps<T>) => {
  return (
    <div className="flex flex-col gap-2">
      <FormLabel className="text-md font-medium text-white">{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              className={fieldState.error ? 'border-red-500' : ''}
            />
            {fieldState.error && (
              <p className="text-red-500 text-sm">{fieldState.error.message}</p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default CustomInput;
