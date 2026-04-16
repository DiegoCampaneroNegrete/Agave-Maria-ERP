'use client';

import { useState } from 'react';
import { PaymentMethod, PaymentMetadata } from '../types';
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import { Input } from '@/components/ui/Input';

interface MetadataFormProps {
  method: PaymentMethod;
  onMetadataChange: (metadata: PaymentMetadata | undefined) => void;
}

export const MetadataForm = ({ method, onMetadataChange }: MetadataFormProps) => {
  const { getMethodConfig } = usePaymentMethods();
  const config = getMethodConfig(method);
  const [metadata, setMetadata] = useState<PaymentMetadata>({});

  if (!config?.requiresMetadata) {
    return null;
  }

  const handleFieldChange = (field: string, value: string) => {
    const newMetadata = { ...metadata, [field]: value };
    setMetadata(newMetadata);
    onMetadataChange(newMetadata);
  };

  return (
    <div className="space-y-3 p-3 bg-app-hover rounded-lg">
      <h4 className="text-sm font-semibold text-app-text">Información adicional</h4>

      {config.metadataFields?.map((field) => (
        <Input
          key={field}
          label={field.charAt(0).toUpperCase() + field.slice(1)}
          value={metadata[field] ?? ''}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          placeholder={`Ingrese ${field}`}
        />
      ))}
    </div>
  );
};
