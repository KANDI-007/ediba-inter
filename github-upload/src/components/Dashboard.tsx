import React, { useEffect, useMemo, useRef } from 'react';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  DollarSign, 
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import RecentActivityWidget from './RecentActivityWidget';

const Dashboard: React.FC = () => {
  const { documents, supplierInvoices } = useData();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const kpis = useMemo(() => {
    // Inclure seulement les factures finales (pas les devis)
    const isCustomerInvoice = (d: any) => d.type === 'invoice' || d.type === 'delivery' || d.type === 'order';
    const docsThisMonth = documents.filter(d => isCustomerInvoice(d) && new Date(d.date).getMonth() === month && new Date(d.date).getFullYear() === year);
    const totalHT = docsThisMonth.reduce((s, d) => s + d.items.reduce((x: number, it: any) => x + it.quantity * it.unitPrice, 0), 0);
    const totalTVA = docsThisMonth.reduce((s, d) => s + Math.round((d.items.reduce((x: number, it: any) => x + it.quantity * it.unitPrice, 0) * d.tva) / 100), 0);
    const totalTTC = totalHT + totalTVA;
    const paid = documents.filter(d => isCustomerInvoice(d) && d.status === 'paid')
      .reduce((s, d) => s + d.items.reduce((x: number, it: any) => x + it.quantity * it.unitPrice, 0) * (1 + d.tva/100), 0);
    const partial = documents.filter(d => isCustomerInvoice(d) && d.status === 'partial')
      .reduce((s, d) => s + (d.payments || []).reduce((p, pay) => p + pay.amount, 0), 0);
    const encaisse = paid + partial;
    const du = documents.filter(d => isCustomerInvoice(d))
      .reduce((s, d) => s + d.items.reduce((x: number, it: any) => x + it.quantity * it.unitPrice, 0) * (1 + d.tva/100), 0) - encaisse;
    return { invoicesCount: docsThisMonth.length, ca: totalTTC, encaisse, impaye: Math.max(du, 0) };
  }, [documents, month, year]);

  const stats = [
    { name: 'Factures ce mois', value: kpis.invoicesCount.toString(), change: '', changeType: 'positive', icon: FileText },
    { name: 'Chiffre d\'affaires', value: `${kpis.ca.toLocaleString('fr-FR')} FCFA`, change: '', changeType: 'positive', icon: DollarSign },
    { name: 'Encaissements', value: `${kpis.encaisse.toLocaleString('fr-FR')} FCFA`, change: '', changeType: 'positive', icon: CheckCircle },
    { name: 'Impayés estimés', value: `${kpis.impaye.toLocaleString('fr-FR')} FCFA`, change: '', changeType: 'negative', icon: AlertCircle },
  ];

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const Chart = (await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/+esm')).default;
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;
        const byMonth = Array.from({ length: 12 }, (_, m) => {
          const docs = documents.filter(d => (d.type === 'invoice' || d.type === 'delivery' || d.type === 'order') && new Date(d.date).getFullYear() === year && new Date(d.date).getMonth() === m);
          const ttc = docs.reduce((s, d) => s + d.items.reduce((x, it) => x + it.quantity * it.unitPrice, 0) * (1 + d.tva/100), 0);
          return Math.round(ttc);
        });
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'],
            datasets: [{
              label: `CA ${year}`,
              data: byMonth,
              borderColor: '#06b6d4',
              backgroundColor: 'rgba(6,182,212,0.2)',
              tension: 0.3,
              fill: true,
            }]
          },
          options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: (v) => `${Number(v).toLocaleString('fr-FR')}` } } } }
        });
      } catch {
        // fallback no chart
      }
    })();
  }, [documents, year]);

  const recentInvoices = documents
    .filter(d => d.type === 'proforma' || d.type === 'invoice' || d.type === 'delivery' || d.type === 'order')
    .slice(0, 4)
    .map(d => ({
      id: d.id,
      client: d.client,
      amount: `${(d.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0) * (1 + d.tva/100)).toLocaleString('fr-FR')} FCFA`,
      status: d.status,
      date: d.date,
    }));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'partial':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'validated':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payée';
      case 'pending':
        return 'En attente';
      case 'overdue':
        return 'En retard';
      case 'partial':
        return 'Partielle';
      case 'validated':
        return 'Validé';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'validated':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-sky-400 to-green-400 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Tableau de Bord</h1>
        <p className="text-sky-100">Vue d'ensemble de votre activité de facturation</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-sky-400 to-green-400 rounded-lg flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Factures récentes */}
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Factures récentes</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">{invoice.id}</p>
                      <div className="ml-2">
                        {getStatusIcon(invoice.status)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{invoice.client}</p>
                    <p className="text-xs text-gray-400">{invoice.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{invoice.amount}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {getStatusText(invoice.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-gray-50 text-right">
            <a href="/invoices" className="text-sm font-medium text-sky-600 hover:text-sky-500">
              Voir toutes les factures →
            </a>
          </div>
        </div>

        {/* Graphique des ventes */}
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Évolution des ventes</h3>
          </div>
          <div className="p-6">
            <canvas ref={chartRef} className="h-64"></canvas>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white shadow-lg rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Actions rapides</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 transition-all duration-200 transform hover:scale-105">
              <FileText className="w-4 h-4 mr-2" />
              Nouvelle facture
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 transition-all duration-200 transform hover:scale-105">
              <Users className="w-4 h-4 mr-2" />
              Ajouter fournisseur
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 transition-all duration-200 transform hover:scale-105">
              <TrendingUp className="w-4 h-4 mr-2" />
              Voir rapports
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105">
              <CheckCircle className="w-4 h-4 mr-2" />
              Nouvelle décharge
            </button>
          </div>
        </div>
      </div>

      {/* Widget d'activités récentes */}
      <div className="mt-6">
        <RecentActivityWidget />
      </div>
    </div>
  );
};

export default Dashboard;