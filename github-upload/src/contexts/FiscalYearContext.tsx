import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useData } from './DataContext';
import { useActivityLogger } from './ActivityContext';

export interface FiscalYear {
  id: string;
  year: number;
  startDate: string; // ISO date
  endDate: string; // ISO date
  status: 'open' | 'closed' | 'locked';
  closingDate?: string; // ISO date
  closedBy?: string; // username
  totalRevenue: number;
  totalExpenses: number;
  totalVAT: number;
  totalInvoices: number;
  totalSuppliers: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface FiscalYearContextType {
  fiscalYears: FiscalYear[];
  currentFiscalYear: FiscalYear | null;
  setCurrentFiscalYear: (year: FiscalYear) => void;
  createFiscalYear: (year: number, startDate: string, endDate: string) => FiscalYear;
  closeFiscalYear: (yearId: string, notes?: string) => void;
  lockFiscalYear: (yearId: string) => void;
  unlockFiscalYear: (yearId: string) => void;
  getFiscalYearByDate: (date: string) => FiscalYear | null;
  getFiscalYearStats: (yearId: string) => {
    totalRevenue: number;
    totalExpenses: number;
    totalVAT: number;
    totalInvoices: number;
    totalSuppliers: number;
    profit: number;
  };
  canModifyFiscalYear: (yearId: string) => boolean;
  getAvailableYears: () => number[];
}

const FiscalYearContext = createContext<FiscalYearContextType | undefined>(undefined);

const STORAGE_KEY = 'ediba.fiscal.years';
const CURRENT_YEAR_KEY = 'ediba.fiscal.current.year';

export const FiscalYearProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>([]);
  const [currentFiscalYear, setCurrentFiscalYearState] = useState<FiscalYear | null>(null);
  const { documents, supplierInvoices } = useData();
  const { logSettings } = useActivityLogger();

  // Charger les exercices fiscaux depuis le localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFiscalYears(parsed);
      } else {
        // Créer l'exercice fiscal actuel par défaut
        const currentYear = new Date().getFullYear();
        const defaultFiscalYear: FiscalYear = {
          id: `FY-${currentYear}`,
          year: currentYear,
          startDate: `${currentYear}-01-01`,
          endDate: `${currentYear}-12-31`,
          status: 'open',
          totalRevenue: 0,
          totalExpenses: 0,
          totalVAT: 0,
          totalInvoices: 0,
          totalSuppliers: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setFiscalYears([defaultFiscalYear]);
      }

      // Charger l'exercice fiscal courant
      const currentYearStored = localStorage.getItem(CURRENT_YEAR_KEY);
      if (currentYearStored) {
        const currentYearData = JSON.parse(currentYearStored);
        setCurrentFiscalYearState(currentYearData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des exercices fiscaux:', error);
    }
  }, []);

  // Sauvegarder les exercices fiscaux dans le localStorage
  useEffect(() => {
    if (fiscalYears.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fiscalYears));
    }
  }, [fiscalYears]);

  // Sauvegarder l'exercice fiscal courant
  useEffect(() => {
    if (currentFiscalYear) {
      localStorage.setItem(CURRENT_YEAR_KEY, JSON.stringify(currentFiscalYear));
    }
  }, [currentFiscalYear]);

  // Mettre à jour les statistiques des exercices fiscaux
  useEffect(() => {
    if (fiscalYears.length > 0) {
      setFiscalYears(prev => prev.map(fy => {
        const stats = calculateFiscalYearStats(fy.id);
        return {
          ...fy,
          ...stats,
          updatedAt: new Date().toISOString()
        };
      }));
    }
  }, [documents, supplierInvoices]);

  const calculateFiscalYearStats = (yearId: string) => {
    const fiscalYear = fiscalYears.find(fy => fy.id === yearId);
    if (!fiscalYear) return {};

    const startDate = new Date(fiscalYear.startDate);
    const endDate = new Date(fiscalYear.endDate);

    // Calculer les revenus (factures clients)
    const clientInvoices = documents.filter(doc => {
      const docDate = new Date(doc.date);
      return (doc.type === 'advance' || doc.type === 'balance') &&
             docDate >= startDate && docDate <= endDate;
    });

    const totalRevenue = clientInvoices.reduce((sum, doc) => {
      const amount = doc.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
      return sum + amount * (1 + doc.tva / 100);
    }, 0);

    const totalVAT = clientInvoices.reduce((sum, doc) => {
      const amount = doc.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
      return sum + Math.round((amount * doc.tva) / 100);
    }, 0);

    // Calculer les dépenses (factures fournisseurs)
    const supplierInvoicesInYear = supplierInvoices.filter(inv => {
      const invDate = new Date(inv.date);
      return invDate >= startDate && invDate <= endDate;
    });

    const totalExpenses = supplierInvoicesInYear.reduce((sum, inv) => sum + inv.ttc, 0);

    return {
      totalRevenue,
      totalExpenses,
      totalVAT,
      totalInvoices: clientInvoices.length,
      totalSuppliers: supplierInvoicesInYear.length
    };
  };

  const setCurrentFiscalYear = (year: FiscalYear) => {
    setCurrentFiscalYearState(year);
    logSettings(`Changement d'exercice fiscal vers ${year.year}`);
  };

  const createFiscalYear = (year: number, startDate: string, endDate: string): FiscalYear => {
    const newFiscalYear: FiscalYear = {
      id: `FY-${year}`,
      year,
      startDate,
      endDate,
      status: 'open',
      totalRevenue: 0,
      totalExpenses: 0,
      totalVAT: 0,
      totalInvoices: 0,
      totalSuppliers: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setFiscalYears(prev => [newFiscalYear, ...prev]);
    logSettings(`Création de l'exercice fiscal ${year}`);
    
    return newFiscalYear;
  };

  const closeFiscalYear = (yearId: string, notes?: string) => {
    setFiscalYears(prev => prev.map(fy => {
      if (fy.id === yearId) {
        return {
          ...fy,
          status: 'closed' as const,
          closingDate: new Date().toISOString(),
          closedBy: 'current_user', // En production, utiliser le vrai utilisateur
          notes,
          updatedAt: new Date().toISOString()
        };
      }
      return fy;
    }));
    logSettings(`Clôture de l'exercice fiscal ${yearId}`);
  };

  const lockFiscalYear = (yearId: string) => {
    setFiscalYears(prev => prev.map(fy => {
      if (fy.id === yearId) {
        return {
          ...fy,
          status: 'locked' as const,
          updatedAt: new Date().toISOString()
        };
      }
      return fy;
    }));
    logSettings(`Verrouillage de l'exercice fiscal ${yearId}`);
  };

  const unlockFiscalYear = (yearId: string) => {
    setFiscalYears(prev => prev.map(fy => {
      if (fy.id === yearId) {
        return {
          ...fy,
          status: 'closed' as const,
          updatedAt: new Date().toISOString()
        };
      }
      return fy;
    }));
    logSettings(`Déverrouillage de l'exercice fiscal ${yearId}`);
  };

  const getFiscalYearByDate = (date: string): FiscalYear | null => {
    const targetDate = new Date(date);
    return fiscalYears.find(fy => {
      const startDate = new Date(fy.startDate);
      const endDate = new Date(fy.endDate);
      return targetDate >= startDate && targetDate <= endDate;
    }) || null;
  };

  const getFiscalYearStats = (yearId: string) => {
    const fiscalYear = fiscalYears.find(fy => fy.id === yearId);
    if (!fiscalYear) {
      return {
        totalRevenue: 0,
        totalExpenses: 0,
        totalVAT: 0,
        totalInvoices: 0,
        totalSuppliers: 0,
        profit: 0
      };
    }

    const profit = fiscalYear.totalRevenue - fiscalYear.totalExpenses;
    
    return {
      totalRevenue: fiscalYear.totalRevenue,
      totalExpenses: fiscalYear.totalExpenses,
      totalVAT: fiscalYear.totalVAT,
      totalInvoices: fiscalYear.totalInvoices,
      totalSuppliers: fiscalYear.totalSuppliers,
      profit
    };
  };

  const canModifyFiscalYear = (yearId: string): boolean => {
    const fiscalYear = fiscalYears.find(fy => fy.id === yearId);
    return fiscalYear ? fiscalYear.status === 'open' : false;
  };

  const getAvailableYears = (): number[] => {
    return fiscalYears.map(fy => fy.year).sort((a, b) => b - a);
  };

  const value: FiscalYearContextType = {
    fiscalYears,
    currentFiscalYear,
    setCurrentFiscalYear,
    createFiscalYear,
    closeFiscalYear,
    lockFiscalYear,
    unlockFiscalYear,
    getFiscalYearByDate,
    getFiscalYearStats,
    canModifyFiscalYear,
    getAvailableYears
  };

  return (
    <FiscalYearContext.Provider value={value}>
      {children}
    </FiscalYearContext.Provider>
  );
};

export const useFiscalYear = () => {
  const context = useContext(FiscalYearContext);
  if (context === undefined) {
    throw new Error('useFiscalYear must be used within a FiscalYearProvider');
  }
  return context;
};
