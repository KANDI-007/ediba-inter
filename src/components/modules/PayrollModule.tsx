import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Edit2,
  Trash2,
  Calendar,
  User,
  DollarSign,
  TrendingUp,
  FileText,
  Eye,
  Save,
  X,
  ChevronRight,
  Building2,
  Percent,
  Receipt,
  CreditCard,
  Banknote
} from 'lucide-react';
import LogoIcon from '../LogoIcon';
import '../../styles/print.css';

interface PayrollEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeDepartment: string;
  employeePosition: string;
  period: string; // Format: YYYY-MM
  grossSalary: number;
  allowances: {
    transport?: number;
    health?: number;
    bonus?: number;
    overtime?: number;
    other?: number;
  };
  deductions: {
    socialSecurity?: number;
    healthInsurance?: number;
    retirement?: number;
    tax?: number;
    advance?: number;
    other?: number;
  };
  netSalary: number;
  currency: string;
  paymentDate: string;
  paymentMethod: string;
  bankName?: string;
  bankAccount?: string;
  status: 'draft' | 'approved' | 'paid' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

const PayrollModule: React.FC = () => {
  const [payrolls, setPayrolls] = useState<PayrollEntry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [statistics, setStatistics] = useState({
    totalPayroll: 0,
    totalEmployees: 0,
    averageSalary: 0,
    thisMonth: 0
  });

  // Données d'exemple
  useEffect(() => {
    const mockPayrolls: PayrollEntry[] = [
      {
        id: '1',
        employeeId: 'EMP001',
        employeeName: 'Kossi Amewou',
        employeeDepartment: 'Comptabilité',
        employeePosition: 'Comptable',
        period: '2025-01',
        grossSalary: 350000,
        allowances: { transport: 15000, health: 10000, bonus: 25000 },
        deductions: { socialSecurity: 35000, healthInsurance: 10500, retirement: 17500, tax: 52500 },
        netSalary: 318500,
        currency: 'FCFA',
        paymentDate: '2025-01-31',
        paymentMethod: 'Virement bancaire',
        bankName: 'Bank of Africa',
        bankAccount: 'TG01012345678901234567',
        status: 'paid',
        notes: 'Bulletin mensuel régulier',
        createdAt: '2025-01-25T10:00:00Z',
        updatedAt: '2025-01-25T10:00:00Z',
        createdBy: 'Admin'
      },
      {
        id: '2',
        employeeId: 'EMP002',
        employeeName: 'Aya Mensah',
        employeeDepartment: 'Informatique',
        employeePosition: 'Développeur',
        period: '2025-01',
        grossSalary: 450000,
        allowances: { transport: 15000, health: 10000, bonus: 40000, overtime: 35000 },
        deductions: { socialSecurity: 45000, healthInsurance: 13500, retirement: 22500, tax: 67500 },
        netSalary: 382500,
        currency: 'FCFA',
        paymentDate: '2025-01-31',
        paymentMethod: 'Virement bancaire',
        bankName: 'Ecobank',
        bankAccount: 'TG02098765432109876543',
        status: 'paid',
        notes: 'Heures supplémentaires inclues',
        createdAt: '2025-01-25T10:00:00Z',
        updatedAt: '2025-01-25T10:00:00Z',
        createdBy: 'Admin'
      },
      {
        id: '3',
        employeeId: 'EMP003',
        employeeName: 'Komla Togbé',
        employeeDepartment: 'Direction',
        employeePosition: 'Directeur Général',
        period: '2025-01',
        grossSalary: 850000,
        allowances: { transport: 25000, health: 20000, bonus: 150000 },
        deductions: { socialSecurity: 85000, healthInsurance: 25500, retirement: 42500, tax: 127500 },
        netSalary: 637000,
        currency: 'FCFA',
        paymentDate: '2025-01-31',
        paymentMethod: 'Virement bancaire',
        bankName: 'UTB',
        bankAccount: 'TG03011122233344455566',
        status: 'approved',
        notes: 'Attente validation',
        createdAt: '2025-01-26T09:00:00Z',
        updatedAt: '2025-01-26T09:00:00Z',
        createdBy: 'Admin'
      }
    ];
    setPayrolls(mockPayrolls);
    calculateStatistics(mockPayrolls);
  }, []);

  const calculateStatistics = (payrolls: PayrollEntry[]) => {
    const paid = payrolls.filter(p => p.status === 'paid');
    const total = paid.reduce((sum, p) => sum + p.netSalary, 0);
    const thisMonth = paid.filter(p => p.period === new Date().toISOString().slice(0, 7)).reduce((sum, p) => sum + p.netSalary, 0);
    
    setStatistics({
      totalPayroll: total,
      totalEmployees: new Set(paid.map(p => p.employeeId)).size,
      averageSalary: paid.length > 0 ? total / paid.length : 0,
      thisMonth
    });
  };

  const filteredPayrolls = payrolls.filter(payroll => {
    const matchesSearch = 
      payroll.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payroll.employeeDepartment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPeriod = !selectedPeriod || payroll.period === selectedPeriod;
    const matchesStatus = selectedStatus === 'all' || payroll.status === selectedStatus;

    return matchesSearch && matchesPeriod && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Brouillon' },
      approved: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Approuvé' },
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Payé' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Annulé' }
    };
    const badge = badges[status as keyof typeof badges] || badges.draft;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const handleCreate = () => {
    setSelectedPayroll(null);
    setShowModal(true);
  };

  const handleEdit = (payroll: PayrollEntry) => {
    setSelectedPayroll(payroll);
    setShowModal(true);
  };

  const handleView = (payroll: PayrollEntry) => {
    setSelectedPayroll(payroll);
    setShowViewModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce bulletin ?')) {
      setPayrolls(payrolls.filter(p => p.id !== id));
      calculateStatistics(payrolls.filter(p => p.id !== id));
    }
  };

  const handlePrint = (payroll: PayrollEntry) => {
    // Afficher la modal de vue d'abord
    setSelectedPayroll(payroll);
    setShowViewModal(true);
    // L'impression sera déclenchée depuis la modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                <Receipt className="inline-block w-10 h-10 mr-3 text-blue-600" />
                Bulletins de Paie
              </h1>
              <p className="text-gray-600">Gestion des rémunérations des employés</p>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Nouveau Bulletin
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Payroll</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(statistics.totalPayroll)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Ce Mois</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(statistics.thisMonth)}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Employés</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalEmployees}</p>
              </div>
              <User className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Salaire Moyen</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(statistics.averageSalary)}</p>
              </div>
              <Percent className="w-12 h-12 text-orange-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les périodes</option>
              <option value="2025-01">Janvier 2025</option>
              <option value="2025-02">Février 2025</option>
              <option value="2025-03">Mars 2025</option>
              <option value="2025-04">Avril 2025</option>
              <option value="2025-05">Mai 2025</option>
              <option value="2025-06">Juin 2025</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="approved">Approuvé</option>
              <option value="paid">Payé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
        </div>

        {/* Liste des bulletins */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Employé</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Période</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Salaire Brut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Net à Payer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Statut</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayrolls.map((payroll) => (
                  <tr key={payroll.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{payroll.employeeName}</p>
                        <p className="text-sm text-gray-600">{payroll.employeePosition} - {payroll.employeeDepartment}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(payroll.period + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(payroll.grossSalary)}</td>
                    <td className="px-6 py-4 font-bold text-green-600">{formatCurrency(payroll.netSalary)}</td>
                    <td className="px-6 py-4">{getStatusBadge(payroll.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(payroll)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Voir"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(payroll)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handlePrint(payroll)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Imprimer"
                        >
                          <Printer className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(payroll.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayrolls.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun bulletin trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de création/édition */}
      {showModal && (
        <PayrollFormModal
          payroll={selectedPayroll}
          onClose={() => {
            setShowModal(false);
            setSelectedPayroll(null);
          }}
          onSave={(payroll) => {
            if (selectedPayroll) {
              const updated = payrolls.map(p => p.id === selectedPayroll.id ? { ...payroll, updatedAt: new Date().toISOString() } : p);
              setPayrolls(updated);
              calculateStatistics(updated);
            } else {
              const newPayrolls = [...payrolls, { ...payroll, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'Admin' }];
              setPayrolls(newPayrolls);
              calculateStatistics(newPayrolls);
            }
            setShowModal(false);
            setSelectedPayroll(null);
          }}
        />
      )}

      {/* Modal de vue détaillée avec impression */}
      {showViewModal && selectedPayroll && (
        <PayrollViewModal
          payroll={selectedPayroll}
          onClose={() => {
            setShowViewModal(false);
            setSelectedPayroll(null);
          }}
          onPrint={() => handlePrint(selectedPayroll)}
        />
      )}
    </div>
  );
};

// Composant pour afficher et imprimer le bulletin
interface PayrollViewModalProps {
  payroll: PayrollEntry;
  onClose: () => void;
  onPrint: () => void;
}

const PayrollViewModal: React.FC<PayrollViewModalProps> = ({ payroll, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' FCFA';
  };

  const calculateTotalAllowances = () => {
    return (payroll.allowances.transport || 0) +
           (payroll.allowances.health || 0) +
           (payroll.allowances.bonus || 0) +
           (payroll.allowances.overtime || 0) +
           (payroll.allowances.other || 0);
  };

  const calculateTotalDeductions = () => {
    return (payroll.deductions.socialSecurity || 0) +
           (payroll.deductions.healthInsurance || 0) +
           (payroll.deductions.retirement || 0) +
           (payroll.deductions.tax || 0) +
           (payroll.deductions.advance || 0) +
           (payroll.deductions.other || 0);
  };

  const handlePrint = () => {
    // Calculer les totaux
    const totalAllowances = calculateTotalAllowances();
    const totalDeductions = calculateTotalDeductions();
    
    // Créer une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Veuillez autoriser les pop-ups pour imprimer le bulletin');
      return;
    }

    // Créer le contenu HTML complet du bulletin
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Bulletin de Paie - ${payroll.employeeName}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            @page {
              size: A4;
              margin: 10mm;
            }
            
            body {
              font-family: Arial, sans-serif;
              font-size: 12pt;
              line-height: 1.4;
              color: #000;
              background: #fff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .print-container {
              width: 100%;
              max-width: 210mm;
              margin: 0 auto;
              padding: 8mm;
              box-sizing: border-box;
              min-height: 297mm;
              display: flex;
              flex-direction: column;
            }
            
            .print-header {
              page-break-after: avoid;
              break-after: avoid;
              margin-bottom: 20pt;
              flex-shrink: 0;
            }
            
            .print-footer {
              page-break-before: avoid;
              break-before: avoid;
              margin-top: auto;
              flex-shrink: 0;
            }
            
            .print-no-break {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            .print-table {
              page-break-inside: avoid;
              break-inside: avoid;
              width: 100%;
              border-collapse: collapse;
            }
            
            .print-table tr {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            .print-table td,
            .print-table th {
              page-break-inside: avoid;
              break-inside: avoid;
              padding: 8pt;
              border: 1pt solid #000;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10pt 0;
            }
            
            th, td {
              border: 1pt solid #000;
              padding: 6pt;
              text-align: left;
              vertical-align: top;
            }
            
            th {
              background-color: #f0f0f0 !important;
              font-weight: bold;
            }
            
            .bg-green-50 {
              background-color: #f0fdf4 !important;
            }
            
            .bg-red-50 {
              background-color: #fef2f2 !important;
            }
            
            .bg-blue-50 {
              background-color: #eff6ff !important;
            }
            
            .bg-gray-50 {
              background-color: #f9fafb !important;
            }
            
            .bg-gray-100 {
              background-color: #f3f4f6 !important;
            }
            
            .bg-yellow-50 {
              background-color: #fefce8 !important;
            }
            
            h1, h2, h3 {
              margin: 0.5em 0;
            }
            
            h1 {
              font-size: 1.5rem;
              font-weight: 700;
            }
            
            h2 {
              font-size: 1.25rem;
              font-weight: 600;
            }
            
            h3 {
              font-size: 1.125rem;
              font-weight: 600;
            }
            
            p {
              margin: 0.25em 0;
            }
            
            /* Styles pour le logo fallback */
            .logo-placeholder {
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #2563eb, #10b981);
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 2rem;
              margin-right: 1rem;
            }
            
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                color-adjust: exact;
              }
              
              .no-print {
                display: none !important;
              }
              
              button, .btn, .button {
                display: none !important;
              }
              
              /* Masquer les éléments avec print-hidden */
              .print-hidden,
              *[class*="print-hidden"] {
                display: none !important;
              }
              
              /* Afficher le logo placeholder pour impression */
              .logo-placeholder,
              *[class*="logo-placeholder"] {
                display: flex !important;
              }
              
              .hidden-print {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <!-- En-tête avec logo -->
            <div class="print-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
              <div style="display: flex; align-items: center;">
                <div class="logo-placeholder" style="width: 80px; height: 80px; background: linear-gradient(135deg, #2563eb, #10b981); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 2rem; margin-right: 1rem;">
                  <span>E</span>
                </div>
                <div>
                  <h1 style="font-size: 1.5rem; font-weight: 700; margin: 0.5rem 0; color: #1f2937;">EDIBA INTER SARL U</h1>
                  <p style="color: #4b5563; margin: 0.25rem 0;">Prestation de services informatiques</p>
                  <p style="font-size: 0.875rem; color: #6b7280; margin: 0.25rem 0;">Totsi, Rue 331 AGP - Lomé, Togo</p>
                  <p style="font-size: 0.875rem; color: #6b7280; margin: 0.25rem 0;">+228 92 60 05 42 / 93 39 18 70</p>
                  <p style="font-size: 0.875rem; color: #6b7280; margin: 0.25rem 0;">NIF: 1001694526 | CNSS: 124509</p>
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 1.875rem; font-weight: 700; color: #2563eb; margin-bottom: 0.5rem;">BULLETIN DE PAIE</div>
                <div style="font-size: 1.125rem; font-weight: 600; color: #374151;">N° ${payroll.employeeId}-${payroll.period}</div>
                <div style="color: #4b5563; margin-top: 0.5rem;">Période: ${new Date(payroll.period + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</div>
              </div>
            </div>

            <!-- Informations employé -->
            <div style="margin-bottom: 2rem; padding: 1rem; background-color: #f9fafb; border-radius: 0.5rem; page-break-inside: avoid;">
              <h3 style="font-weight: 700; color: #1f2937; margin-bottom: 1rem; font-size: 1.125rem; border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem;">INFORMATIONS EMPLOYÉ</h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                <div>
                  <p style="font-size: 0.875rem; color: #4b5563; margin: 0.25rem 0;">Nom et Prénom</p>
                  <p style="font-weight: 600; color: #111827; font-size: 1.125rem; margin: 0.25rem 0;">${payroll.employeeName}</p>
                </div>
                <div>
                  <p style="font-size: 0.875rem; color: #4b5563; margin: 0.25rem 0;">ID Employé</p>
                  <p style="font-weight: 600; color: #111827; margin: 0.25rem 0;">${payroll.employeeId}</p>
                </div>
                <div>
                  <p style="font-size: 0.875rem; color: #4b5563; margin: 0.25rem 0;">Département</p>
                  <p style="font-weight: 600; color: #111827; margin: 0.25rem 0;">${payroll.employeeDepartment}</p>
                </div>
                <div>
                  <p style="font-size: 0.875rem; color: #4b5563; margin: 0.25rem 0;">Poste</p>
                  <p style="font-weight: 600; color: #111827; margin: 0.25rem 0;">${payroll.employeePosition}</p>
                </div>
              </div>
            </div>

            <!-- Tableau de détail -->
            <div style="margin-bottom: 2rem; page-break-inside: avoid;">
              <table class="print-table" style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
                <thead>
                  <tr style="background-color: #f3f4f6;">
                    <th style="border: 1px solid #000; padding: 0.75rem; text-align: left; font-weight: 600;">Description</th>
                    <th style="border: 1px solid #000; padding: 0.75rem; text-align: right; font-weight: 600;">Montant (FCFA)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="border: 1px solid #000; padding: 0.75rem; font-weight: 600;">Salaire de Base</td>
                    <td style="border: 1px solid #000; padding: 0.75rem; text-align: right; font-weight: 600;">${formatCurrency(payroll.grossSalary)}</td>
                  </tr>
                  
                  <!-- Primes -->
                  <tr style="background-color: #f0fdf4;">
                    <td colspan="2" style="border: 1px solid #000; padding: 0.5rem; font-weight: 700; color: #14532d;">PRIMES ET INDEMNITÉS</td>
                  </tr>
                  ${payroll.allowances.transport ? `
                  <tr>
                    <td style="border: 1px solid #000; padding: 0.5rem; padding-left: 2rem;">Indemnité Transport</td>
                    <td style="border: 1px solid #000; padding: 0.5rem; text-align: right;">${formatCurrency(payroll.allowances.transport)}</td>
                  </tr>
                  ` : ''}
                  ${payroll.allowances.health ? `
                  <tr>
                    <td style="border: 1px solid #000; padding: 0.5rem; padding-left: 2rem;">Indemnité Santé</td>
                    <td style="border: 1px solid #000; padding: 0.5rem; text-align: right;">${formatCurrency(payroll.allowances.health)}</td>
                  </tr>
                  ` : ''}
                  ${payroll.allowances.bonus ? `
                  <tr>
                    <td style="border: 1px solid #000; padding: 0.5rem; padding-left: 2rem;">Prime</td>
                    <td style="border: 1px solid #000; padding: 0.5rem; text-align: right;">${formatCurrency(payroll.allowances.bonus)}</td>
                  </tr>
                  ` : ''}
                  ${payroll.allowances.overtime ? `
                  <tr>
                    <td style="border: 1px solid #000; padding: 0.5rem; padding-left: 2rem;">Heures Supplémentaires</td>
                    <td style="border: 1px solid #000; padding: 0.5rem; text-align: right;">${formatCurrency(payroll.allowances.overtime)}</td>
                  </tr>
                  ` : ''}
                  ${payroll.allowances.other ? `
                  <tr>
                    <td style="border: 1px solid #000; padding: 0.5rem; padding-left: 2rem;">Autres Primes</td>
                    <td style="border: 1px solid #000; padding: 0.5rem; text-align: right;">${formatCurrency(payroll.allowances.other)}</td>
                  </tr>
                  ` : ''}
                  <tr style="background-color: #f0fdf4;">
                    <td style="border: 1px solid #000; padding: 0.5rem; font-weight: 600;">Total Primes</td>
                    <td style="border: 1px solid #000; padding: 0.5rem; text-align: right; font-weight: 600;">${formatCurrency(totalAllowances)}</td>
                  </tr>

                  <!-- Déductions -->
                  <tr style="background-color: #fef2f2;">
                    <td colspan="2" style="border: 1px solid #000; padding: 0.5rem; font-weight: 700; color: #7f1d1d;">DÉDUCTIONS</td>
                  </tr>
                  ${payroll.deductions.socialSecurity ? `
                  <tr>
                    <td style="border: 1px solid #000; padding: 0.5rem; padding-left: 2rem;">Sécurité Sociale</td>
                    <td style="border: 1px solid #000; padding: 0.5rem; text-align: right;">${formatCurrency(payroll.deductions.socialSecurity)}</td>
                  </tr>
                  ` : ''}
                  ${payroll.deductions.healthInsurance ? `
                  <tr>
                    <td style="border: 1px solid #000; padding: 0.5rem; padding-left: 2rem;">Assurance Santé</td>
                    <td style="border: 1px solid #000; padding: 0.5rem; text-align: right;">${formatCurrency(payroll.deductions.healthInsurance)}</td>
                  </tr>
                  ` : ''}
                  ${payroll.deductions.retirement ? `
                  <tr>
                    <td style="border: 1px solid #000; padding: 0.5rem; padding-left: 2rem;">Retraite</td>
                    <td style="border: 1px solid #000; padding: 0.5rem; text-align: right;">${formatCurrency(payroll.deductions.retirement)}</td>
                  </tr>
                  ` : ''}
                  ${payroll.deductions.tax ? `
                  <tr>
                    <td style="border: 1px solid #000; padding: 0.5rem; padding-left: 2rem;">Impôt sur le Revenu</td>
                    <td style="border: 1px solid #000; padding: 0.5rem; text-align: right;">${formatCurrency(payroll.deductions.tax)}</td>
                  </tr>
                  ` : ''}
                  ${payroll.deductions.advance ? `
                  <tr>
                    <td style="border: 1px solid #000; padding: 0.5rem; padding-left: 2rem;">Avance sur Salaire</td>
                    <td style="border: 1px solid #000; padding: 0.5rem; text-align: right;">${formatCurrency(payroll.deductions.advance)}</td>
                  </tr>
                  ` : ''}
                  ${payroll.deductions.other ? `
                  <tr>
                    <td style="border: 1px solid #000; padding: 0.5rem; padding-left: 2rem;">Autres Déductions</td>
                    <td style="border: 1px solid #000; padding: 0.5rem; text-align: right;">${formatCurrency(payroll.deductions.other)}</td>
                  </tr>
                  ` : ''}
                  <tr style="background-color: #fef2f2;">
                    <td style="border: 1px solid #000; padding: 0.5rem; font-weight: 600;">Total Déductions</td>
                    <td style="border: 1px solid #000; padding: 0.5rem; text-align: right; font-weight: 600;">${formatCurrency(totalDeductions)}</td>
                  </tr>

                  <!-- Total net -->
                  <tr style="background-color: #eff6ff;">
                    <td style="border: 1px solid #000; padding: 0.75rem; font-weight: 700; font-size: 1.125rem;">NET À PAYER</td>
                    <td style="border: 1px solid #000; padding: 0.75rem; text-align: right; font-weight: 700; font-size: 1.125rem; color: #2563eb;">${formatCurrency(payroll.netSalary)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Informations de paiement -->
            <div style="margin-bottom: 2rem; padding: 1rem; background-color: #f9fafb; border-radius: 0.5rem; page-break-inside: avoid;">
              <h3 style="font-weight: 700; color: #1f2937; margin-bottom: 1rem; font-size: 1.125rem; border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem;">INFORMATIONS DE PAIEMENT</h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                <div>
                  <p style="font-size: 0.875rem; color: #4b5563; margin: 0.25rem 0;">Date de Paiement</p>
                  <p style="font-weight: 600; color: #111827; margin: 0.25rem 0;">${formatDate(payroll.paymentDate)}</p>
                </div>
                <div>
                  <p style="font-size: 0.875rem; color: #4b5563; margin: 0.25rem 0;">Méthode de Paiement</p>
                  <p style="font-weight: 600; color: #111827; margin: 0.25rem 0;">${payroll.paymentMethod}</p>
                </div>
                ${payroll.bankName ? `
                <div>
                  <p style="font-size: 0.875rem; color: #4b5563; margin: 0.25rem 0;">Banque</p>
                  <p style="font-weight: 600; color: #111827; margin: 0.25rem 0;">${payroll.bankName}</p>
                </div>
                ` : ''}
                ${payroll.bankAccount ? `
                <div>
                  <p style="font-size: 0.875rem; color: #4b5563; margin: 0.25rem 0;">Compte Bancaire</p>
                  <p style="font-weight: 600; color: #111827; margin: 0.25rem 0;">${payroll.bankAccount}</p>
                </div>
                ` : ''}
              </div>
            </div>

            ${payroll.notes ? `
            <!-- Notes -->
            <div style="margin-bottom: 2rem; padding: 1rem; background-color: #fefce8; border-radius: 0.5rem; page-break-inside: avoid;">
              <h3 style="font-weight: 700; color: #1f2937; margin-bottom: 0.5rem;">Notes</h3>
              <p style="color: #374151; margin: 0.25rem 0;">${payroll.notes}</p>
            </div>
            ` : ''}

            <!-- Signature -->
            <div class="print-footer" style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 3rem; page-break-before: avoid;">
              <div style="text-align: center;">
                <p style="color: #4b5563; margin-bottom: 2rem;">Signature Employé</p>
                <div style="width: 8rem; height: 4rem; border-bottom: 2px solid #9ca3af;"></div>
              </div>
              <div style="text-align: center;">
                <p style="color: #4b5563; margin-bottom: 2rem;">Signature EDIBA INTER</p>
                <div style="width: 8rem; height: 4rem; border-bottom: 2px solid #9ca3af;"></div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    
    // Écrire le contenu dans la nouvelle fenêtre
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Attendre que le contenu soit chargé puis imprimer
    setTimeout(() => {
      printWindow.print();
      // Fermer la fenêtre après impression
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }, 250);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 no-print" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto no-print" onClick={(e) => e.stopPropagation()}>
        {/* Boutons d'action (masqués à l'impression) */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between no-print">
          <h2 className="text-2xl font-bold">Bulletin de Paie</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Printer className="w-5 h-5" />
              Imprimer
            </button>
            <button
              onClick={onClose}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Fermer
            </button>
          </div>
        </div>

        {/* Contenu du bulletin - SEULEMENT CE CONTENU SERA IMPRIMÉ */}
        <div ref={printRef} className="bg-white p-8 print-container" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* En-tête avec logo */}
        <div className="mb-8 print-header flex justify-between items-start">
          <div className="flex items-center">
            <div className="w-20 h-20 mr-4 flex-shrink-0 flex items-center justify-center">
              {/* Logo visible sur écran */}
              <div className="print-hidden">
                <LogoIcon size={80} variant="default" />
              </div>
              {/* Logo pour impression */}
              <div className="logo-placeholder hidden-print" style={{ 
                width: '80px', 
                height: '80px', 
                background: 'linear-gradient(135deg, #2563eb, #10b981)',
                borderRadius: '8px',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '2rem',
                marginRight: '1rem'
              }}>
                <span>E</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">EDIBA INTER SARL U</h1>
              <p className="text-gray-600">Prestation de services informatiques</p>
              <p className="text-sm text-gray-500">Totsi, Rue 331 AGP - Lomé, Togo</p>
              <p className="text-sm text-gray-500">+228 92 60 05 42 / 93 39 18 70</p>
              <p className="text-sm text-gray-500">NIF: 1001694526 | CNSS: 124509</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 mb-2">BULLETIN DE PAIE</div>
            <div className="text-lg font-semibold text-gray-700">N° {payroll.employeeId}-{payroll.period}</div>
            <div className="text-gray-600 mt-2">Période: {new Date(payroll.period + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</div>
          </div>
        </div>

        {/* Informations employé */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg print-no-break">
          <h3 className="font-bold text-gray-800 mb-4 text-lg border-b-2 border-blue-600 pb-2">INFORMATIONS EMPLOYÉ</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nom et Prénom</p>
              <p className="font-semibold text-gray-900 text-lg">{payroll.employeeName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">ID Employé</p>
              <p className="font-semibold text-gray-900">{payroll.employeeId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Département</p>
              <p className="font-semibold text-gray-900">{payroll.employeeDepartment}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Poste</p>
              <p className="font-semibold text-gray-900">{payroll.employeePosition}</p>
            </div>
          </div>
        </div>

        {/* Tableau de détail */}
        <div className="mb-8 print-no-break">
          <table className="w-full border-collapse border border-gray-300 print-table">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Description</th>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Montant (FCFA)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-semibold">Salaire de Base</td>
                <td className="border border-gray-300 px-4 py-3 text-right font-semibold">{formatCurrency(payroll.grossSalary)}</td>
              </tr>
              
              {/* Primes */}
              <tr className="bg-green-50">
                <td colSpan={2} className="border border-gray-300 px-4 py-2 font-bold text-green-900">PRIMES ET INDEMNITÉS</td>
              </tr>
              {payroll.allowances.transport && (
                <tr>
                  <td className="border border-gray-300 px-4 py-2 pl-8">Indemnité Transport</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(payroll.allowances.transport)}</td>
                </tr>
              )}
              {payroll.allowances.health && (
                <tr>
                  <td className="border border-gray-300 px-4 py-2 pl-8">Indemnité Santé</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(payroll.allowances.health)}</td>
                </tr>
              )}
              {payroll.allowances.bonus && (
                <tr>
                  <td className="border border-gray-300 px-4 py-2 pl-8">Prime</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(payroll.allowances.bonus)}</td>
                </tr>
              )}
              {payroll.allowances.overtime && (
                <tr>
                  <td className="border border-gray-300 px-4 py-2 pl-8">Heures Supplémentaires</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(payroll.allowances.overtime)}</td>
                </tr>
              )}
              {payroll.allowances.other && (
                <tr>
                  <td className="border border-gray-300 px-4 py-2 pl-8">Autres Primes</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(payroll.allowances.other)}</td>
                </tr>
              )}
              <tr className="bg-green-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold">Total Primes</td>
                <td className="border border-gray-300 px-4 py-2 text-right font-semibold">{formatCurrency(calculateTotalAllowances())}</td>
              </tr>

              {/* Déductions */}
              <tr className="bg-red-50">
                <td colSpan={2} className="border border-gray-300 px-4 py-2 font-bold text-red-900">DÉDUCTIONS</td>
              </tr>
              {payroll.deductions.socialSecurity && (
                <tr>
                  <td className="border border-gray-300 px-4 py-2 pl-8">Sécurité Sociale</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(payroll.deductions.socialSecurity)}</td>
                </tr>
              )}
              {payroll.deductions.healthInsurance && (
                <tr>
                  <td className="border border-gray-300 px-4 py-2 pl-8">Assurance Santé</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(payroll.deductions.healthInsurance)}</td>
                </tr>
              )}
              {payroll.deductions.retirement && (
                <tr>
                  <td className="border border-gray-300 px-4 py-2 pl-8">Retraite</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(payroll.deductions.retirement)}</td>
                </tr>
              )}
              {payroll.deductions.tax && (
                <tr>
                  <td className="border border-gray-300 px-4 py-2 pl-8">Impôt sur le Revenu</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(payroll.deductions.tax)}</td>
                </tr>
              )}
              {payroll.deductions.advance && (
                <tr>
                  <td className="border border-gray-300 px-4 py-2 pl-8">Avance sur Salaire</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(payroll.deductions.advance)}</td>
                </tr>
              )}
              {payroll.deductions.other && (
                <tr>
                  <td className="border border-gray-300 px-4 py-2 pl-8">Autres Déductions</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(payroll.deductions.other)}</td>
                </tr>
              )}
              <tr className="bg-red-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold">Total Déductions</td>
                <td className="border border-gray-300 px-4 py-2 text-right font-semibold">{formatCurrency(calculateTotalDeductions())}</td>
              </tr>

              {/* Total net */}
              <tr className="bg-blue-50">
                <td className="border border-gray-300 px-4 py-3 font-bold text-lg">NET À PAYER</td>
                <td className="border border-gray-300 px-4 py-3 text-right font-bold text-lg text-blue-600">{formatCurrency(payroll.netSalary)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Informations de paiement */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg print-no-break">
          <h3 className="font-bold text-gray-800 mb-4 text-lg border-b-2 border-blue-600 pb-2">INFORMATIONS DE PAIEMENT</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Date de Paiement</p>
              <p className="font-semibold text-gray-900">{formatDate(payroll.paymentDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Méthode de Paiement</p>
              <p className="font-semibold text-gray-900">{payroll.paymentMethod}</p>
            </div>
            {payroll.bankName && (
              <div>
                <p className="text-sm text-gray-600">Banque</p>
                <p className="font-semibold text-gray-900">{payroll.bankName}</p>
              </div>
            )}
            {payroll.bankAccount && (
              <div>
                <p className="text-sm text-gray-600">Compte Bancaire</p>
                <p className="font-semibold text-gray-900">{payroll.bankAccount}</p>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {payroll.notes && (
          <div className="mb-8 p-4 bg-yellow-50 rounded-lg print-no-break">
            <h3 className="font-bold text-gray-800 mb-2">Notes</h3>
            <p className="text-gray-700">{payroll.notes}</p>
          </div>
        )}

        {/* Signature */}
        <div className="flex justify-between items-end mt-12 print-footer">
          <div className="text-center">
            <p className="text-gray-600 mb-8">Signature Employé</p>
            <div className="w-32 h-16 border-b-2 border-gray-400"></div>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-8">Signature EDIBA INTER</p>
            <div className="w-32 h-16 border-b-2 border-gray-400"></div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

// Modal de formulaire pour créer/éditer
interface PayrollFormModalProps {
  payroll: PayrollEntry | null;
  onClose: () => void;
  onSave: (payroll: PayrollEntry) => void;
}

const PayrollFormModal: React.FC<PayrollFormModalProps> = ({ payroll, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<PayrollEntry>>({
    employeeId: '',
    employeeName: '',
    employeeDepartment: '',
    employeePosition: '',
    period: '',
    grossSalary: 0,
    allowances: { transport: 0, health: 0, bonus: 0, overtime: 0, other: 0 },
    deductions: { socialSecurity: 0, healthInsurance: 0, retirement: 0, tax: 0, advance: 0, other: 0 },
    netSalary: 0,
    currency: 'FCFA',
    paymentDate: '',
    paymentMethod: 'Virement bancaire',
    bankName: '',
    bankAccount: '',
    status: 'draft',
    notes: ''
  });

  useEffect(() => {
    if (payroll) {
      setFormData(payroll);
    }
  }, [payroll]);

  // Calcul automatique du salaire net
  useEffect(() => {
    const totalAllowances = (formData.allowances?.transport || 0) +
                           (formData.allowances?.health || 0) +
                           (formData.allowances?.bonus || 0) +
                           (formData.allowances?.overtime || 0) +
                           (formData.allowances?.other || 0);
    
    const totalDeductions = (formData.deductions?.socialSecurity || 0) +
                           (formData.deductions?.healthInsurance || 0) +
                           (formData.deductions?.retirement || 0) +
                           (formData.deductions?.tax || 0) +
                           (formData.deductions?.advance || 0) +
                           (formData.deductions?.other || 0);
    
    const net = (formData.grossSalary || 0) + totalAllowances - totalDeductions;
    setFormData(prev => ({ ...prev, netSalary: Math.max(0, net) }));
  }, [formData.grossSalary, formData.allowances, formData.deductions]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as PayrollEntry);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' FCFA';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {payroll ? 'Modifier le Bulletin' : 'Nouveau Bulletin de Paie'}
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations employé */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Informations Employé
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Employé *</label>
                <input
                  type="text"
                  value={formData.employeeId || ''}
                  onChange={(e) => handleChange('employeeId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="EMP001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom et Prénom *</label>
                <input
                  type="text"
                  value={formData.employeeName || ''}
                  onChange={(e) => handleChange('employeeName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Département *</label>
                <input
                  type="text"
                  value={formData.employeeDepartment || ''}
                  onChange={(e) => handleChange('employeeDepartment', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poste *</label>
                <input
                  type="text"
                  value={formData.employeePosition || ''}
                  onChange={(e) => handleChange('employeePosition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Période et statut */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Période *</label>
              <input
                type="month"
                value={formData.period || ''}
                onChange={(e) => handleChange('period', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut *</label>
              <select
                value={formData.status || 'draft'}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Brouillon</option>
                <option value="approved">Approuvé</option>
                <option value="paid">Payé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de paiement *</label>
              <input
                type="date"
                value={formData.paymentDate || ''}
                onChange={(e) => handleChange('paymentDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Salaire brut */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Salaire Brut et Primes
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Salaire Brut (FCFA) *</label>
              <input
                type="number"
                value={formData.grossSalary || 0}
                onChange={(e) => handleChange('grossSalary', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
                min="0"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transport</label>
                <input
                  type="number"
                  value={formData.allowances?.transport || 0}
                  onChange={(e) => handleChange('allowances', { ...formData.allowances, transport: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Indemnité Santé</label>
                <input
                  type="number"
                  value={formData.allowances?.health || 0}
                  onChange={(e) => handleChange('allowances', { ...formData.allowances, health: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prime</label>
                <input
                  type="number"
                  value={formData.allowances?.bonus || 0}
                  onChange={(e) => handleChange('allowances', { ...formData.allowances, bonus: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heures Supplémentaires</label>
                <input
                  type="number"
                  value={formData.allowances?.overtime || 0}
                  onChange={(e) => handleChange('allowances', { ...formData.allowances, overtime: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Autres Primes</label>
                <input
                  type="number"
                  value={formData.allowances?.other || 0}
                  onChange={(e) => handleChange('allowances', { ...formData.allowances, other: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Déductions */}
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Déductions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sécurité Sociale</label>
                <input
                  type="number"
                  value={formData.deductions?.socialSecurity || 0}
                  onChange={(e) => handleChange('deductions', { ...formData.deductions, socialSecurity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assurance Santé</label>
                <input
                  type="number"
                  value={formData.deductions?.healthInsurance || 0}
                  onChange={(e) => handleChange('deductions', { ...formData.deductions, healthInsurance: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Retraite</label>
                <input
                  type="number"
                  value={formData.deductions?.retirement || 0}
                  onChange={(e) => handleChange('deductions', { ...formData.deductions, retirement: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Impôt sur le Revenu</label>
                <input
                  type="number"
                  value={formData.deductions?.tax || 0}
                  onChange={(e) => handleChange('deductions', { ...formData.deductions, tax: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avance sur Salaire</label>
                <input
                  type="number"
                  value={formData.deductions?.advance || 0}
                  onChange={(e) => handleChange('deductions', { ...formData.deductions, advance: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Autres Déductions</label>
                <input
                  type="number"
                  value={formData.deductions?.other || 0}
                  onChange={(e) => handleChange('deductions', { ...formData.deductions, other: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Salaire net (calculé automatiquement) */}
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Salaire Net à Payer</p>
                <p className="text-3xl font-bold text-blue-600">{formatCurrency(formData.netSalary || 0)}</p>
              </div>
              <Banknote className="w-16 h-16 text-blue-600 opacity-30" />
            </div>
          </div>

          {/* Informations bancaires */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Informations Bancaires
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Méthode de Paiement *</label>
                <select
                  value={formData.paymentMethod || 'Virement bancaire'}
                  onChange={(e) => handleChange('paymentMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Virement bancaire">Virement bancaire</option>
                  <option value="Chèque">Chèque</option>
                  <option value="Espèces">Espèces</option>
                  <option value="Mobile Money">Mobile Money</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banque</label>
                <input
                  type="text"
                  value={formData.bankName || ''}
                  onChange={(e) => handleChange('bankName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Bank of Africa"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Compte Bancaire</label>
                <input
                  type="text"
                  value={formData.bankAccount || ''}
                  onChange={(e) => handleChange('bankAccount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="TG01012345678901234567"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Notes additionnelles..."
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PayrollModule;
