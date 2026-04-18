'use client';

import { useState, useCallback } from 'react';
import { Customer } from '@/features/payments/types';
import { getCustomer, findCustomer, createCustomer } from '@/features/payments/service';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface CustomerSelectorProps {
  onCustomerSelect: (customer: Customer | null) => void;
  selectedCustomer: Customer | null;
}

export const CustomerSelector = ({
  onCustomerSelect,
  selectedCustomer,
}: CustomerSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createName, setCreateName] = useState('');

  // Search customer by phone or email
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setError('Ingresa teléfono o email');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const customer = await findCustomer(
        searchQuery,
        searchQuery // try both as phone and email
      );

      if (customer) {
        onCustomerSelect(customer);
        setSearchQuery('');
      } else {
        setError('Cliente no encontrado');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error en búsqueda';
      setError(msg);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, onCustomerSelect]);

  // Create new customer
  const handleCreateCustomer = useCallback(async () => {
    if (!createName.trim()) {
      setError('Ingresa nombre del cliente');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const customerId = await createCustomer(createName);
      const customer = await getCustomer(customerId);

      if (customer) {
        onCustomerSelect(customer);
        setCreateName('');
        setIsCreating(false);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error creando cliente';
      setError(msg);
      console.error('Create error:', err);
    } finally {
      setLoading(false);
    }
  }, [createName, onCustomerSelect]);

  // Clear selection
  const handleClear = () => {
    onCustomerSelect(null);
    setSearchQuery('');
    setError(null);
  };

  return (
    <div className="mb-4 p-3 bg-app-hover rounded-lg space-y-3">
      {/* Display selected customer */}
      {selectedCustomer ? (
        <div>
          <div className="text-sm text-app-muted mb-2">Cliente seleccionado</div>
          <div className="flex items-center justify-between bg-app-card p-2 rounded">
            <div>
              <div className="font-semibold text-app-text">{selectedCustomer.name}</div>
              {selectedCustomer.phone && (
                <div className="text-xs text-app-muted">{selectedCustomer.phone}</div>
              )}
            </div>
            <button
              onClick={handleClear}
              className="text-sm text-app-primary hover:text-app-text px-2"
              disabled={loading}
            >
              Cambiar
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Create new mode */}
          {isCreating ? (
            <div className="space-y-2">
              <label className="text-sm text-app-muted">Nombre del cliente</label>
              <Input
                type="text"
                placeholder="Ej: Juan Pérez"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                disabled={loading}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateCustomer}
                  disabled={loading}
                  variant="primary"
                  size="sm"
                >
                  {loading ? 'Creando...' : 'Crear'}
                </Button>
                <Button
                  onClick={() => {
                    setIsCreating(false);
                    setCreateName('');
                    setError(null);
                  }}
                  disabled={loading}
                  variant="secondary"
                  size="sm"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            // Search mode
            <div className="space-y-2">
              <label className="text-sm text-app-muted">Buscar cliente (teléfono/email)</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ej: 1234567890"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                  disabled={loading}
                />
                <Button
                  onClick={handleSearch}
                  disabled={loading || !searchQuery.trim()}
                  variant="primary"
                  size="sm"
                >
                  {loading ? '...' : 'Buscar'}
                </Button>
              </div>

              {/* Create new option */}
              <button
                onClick={() => setIsCreating(true)}
                className="text-sm text-app-primary hover:text-app-text w-full text-left"
              >
                + Crear nuevo cliente
              </button>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
};
