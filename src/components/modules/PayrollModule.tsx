import React, { useState, useEffect } from 'react';
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
  Receipt
} from 'lucide-react';

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
    // Ouvrir modal de vue détaillée
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce bulletin ?')) {
      setPayrolls(payrolls.filter(p => p.id !== id));
    }
  };

  const handlePrint = (payroll: PayrollEntry) => {
    window.print();
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
          onClose={() => setShowModal(false)}
          onSave={(payroll) => {
            if (selectedPayroll) {
              setPayrolls(payrolls.map(p => p.id === selectedPayroll.id ? payroll : p));
            } else {
              setPayrolls([...payrolls, { ...payroll, id: Date.now().toString() }]);
            }
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

interface PayrollFormModalProps {
  payroll: PayrollEntry | null;
  onClose: () => void;
  onSave: (payroll: PayrollEntry) => void;
}

const PayrollFormModal: React.FC<PayrollFormModalProps> = ({ payroll, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<PayrollEntry>>({
    employeeName: '',
    employeeDepartment: '',
    employeePosition: '',
    period: '',
    grossSalary: 0,
    allowances: { transport: 0, health: 0, bonus: 0, overtime: 0 },
    deductions: { socialSecurity: 0, healthInsurance: 0, retirement: 0, tax: 0 },
    netSalary: 0,
    currency: 'FCFA',
    paymentDate: '',
    paymentMethod: 'Virement bancaire',
    status: 'draft',
    notes: ''
  });

  useEffect(() => {
    if (payroll) {
      setFormData(payroll);
    }
  }, [payroll]);

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  value={formData.employeeName || ''}
                  onChange={(e) => handleChange('employeeName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                <input
                  type="text"
                  value={formData.employeeDepartment || ''}
                  onChange={(e) => handleChange('employeeDepartment', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poste</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
              <input
                type="month"
                value={formData.period || ''}
                onChange={(e) => handleChange('period', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de paiement</label>
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salaire Brut</label>
                <input
                  type="number"
                  value={formData.grossSalary || 0}
                  onChange={(e) => handleChange('grossSalary', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transport</label>
                <input
                  type="number"
                  value={formData.allowances?.transport || 0}
                  onChange={(e) => handleChange('allowances', { ...formData.allowances, transport: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prime</label>
                <input
                  type="number"
                  value={formData.allowances?.bonus || 0}
                  onChange={(e) => handleChange('allowances', { ...formData.allowances, bonus: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sécurité Sociale</label>
                <input
                  type="number"
                  value={formData.deductions?.socialSecurity || 0}
                  onChange={(e) => handleChange('deductions', { ...formData.deductions, socialSecurity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assurance Santé</label>
                <input
                  type="number"
                  value={formData.deductions?.healthInsurance || 0}
                  onChange={(e) => handleChange('deductions', { ...formData.deductions, healthInsurance: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Retraite</label>
                <input
                  type="number"
                  value={formData.deductions?.retirement || 0}
                  onChange={(e) => handleChange('deductions', { ...formData.deductions, retirement: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Impôt</label>
                <input
                  type="number"
                  value={formData.deductions?.tax || 0}
                  onChange={(e) => handleChange('deductions', { ...formData.deductions, tax: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
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
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Save className="w-5 h-5 inline mr-2" />
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PayrollModule;

