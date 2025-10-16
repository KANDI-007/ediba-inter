import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { DataProvider } from '../contexts/DataContext';
import { ActivityProvider } from '../contexts/ActivityContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { FiscalYearProvider } from '../contexts/FiscalYearContext';
import { BackupProvider } from '../contexts/BackupContext';

// Mock all contexts with default values
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <ActivityProvider>
            <NotificationProvider>
              <FiscalYearProvider>
                <BackupProvider>
                  {children}
                </BackupProvider>
              </FiscalYearProvider>
            </NotificationProvider>
          </ActivityProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock user for testing
export const mockUser = {
  username: 'testuser',
  role: 'admin' as const,
  permissions: [
    'users.manage', 'settings.manage', 'reports.view', 'reports.export',
    'invoices.create', 'invoices.edit', 'invoices.delete', 'invoices.view',
    'clients.create', 'clients.edit', 'clients.delete', 'clients.view',
    'suppliers.create', 'suppliers.edit', 'suppliers.delete', 'suppliers.view',
    'discharges.create', 'discharges.edit', 'discharges.delete', 'discharges.view',
    'payments.manage', 'fiscal.manage'
  ],
  fullName: 'Test User',
  email: 'test@example.com',
  lastLogin: new Date().toISOString()
};

// Mock document for testing
export const mockDocument = {
  id: 'N° F2500001',
  type: 'proforma' as const,
  reference: '2025-0001',
  date: '2025-01-15',
  client: 'Client Test',
  address: '123 Rue Test',
  city: 'Lomé',
  tva: 18,
  items: [
    {
      description: 'Service de test',
      quantity: 1,
      unitPrice: 1000
    }
  ],
  status: 'pending' as const,
  payments: []
};

// Mock client for testing
export const mockClient = {
  id: 'CLI-1234567890',
  raisonSociale: 'Client Test SARL',
  nomCommercial: 'Client Test',
  nif: 'NIF123456789',
  rccm: 'RCCM123456789',
  adresse: '123 Rue Test',
  ville: 'Lomé',
  telephone: '+228 12 34 56 78',
  email: 'client@test.com',
  contactPrincipal: 'M. Test Client',
  secteurActivite: 'Informatique',
  regimeFiscal: 'Réel Normal' as const,
  delaiPaiement: 30,
  remise: 5,
  limiteCredit: 100000,
  statut: 'actif' as const,
  dateCreation: '2025-01-15',
  totalFacture: 0,
  totalEncaissement: 0,
  soldeImpaye: 0,
  nombreFactures: 0
};

export * from '@testing-library/react';
export { customRender as render };
