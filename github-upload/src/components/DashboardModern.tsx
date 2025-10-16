import React, { useEffect, useMemo, useState } from 'react';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  DollarSign, 
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import DashboardHeader from './DashboardHeader';
import DashboardStatsCard from './DashboardStatsCard';
import DashboardChart from './DashboardChart';
import DashboardQuickActions from './DashboardQuickActions';
import DashboardRecentActivity from './DashboardRecentActivity';

const DashboardModern: React.FC = () => {
  const { documents, supplierInvoices, clients, suppliers, discharges } = useData();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Simulation du chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Calcul des KPIs
  const kpis = useMemo(() => {
    // Inclure seulement les factures finales (pas les devis)
    const isCustomerInvoice = (d: any) => d.type === 'invoice' || d.type === 'delivery' || d.type === 'order';
    const docsThisMonth = documents.filter(d => isCustomerInvoice(d) && new Date(d.date).getMonth() === month && new Date(d.date).getFullYear() === year);
    const docsLastMonth = documents.filter(d => isCustomerInvoice(d) && new Date(d.date).getMonth() === month - 1 && new Date(d.date).getFullYear() === year);
    
    const totalHT = docsThisMonth.reduce((s, d) => s + d.items.reduce((x: number, it: any) => x + it.quantity * it.unitPrice, 0), 0);
    const totalTVA = docsThisMonth.reduce((s, d) => s + Math.round((d.items.reduce((x: number, it: any) => x + it.quantity * it.unitPrice, 0) * d.tva) / 100), 0);
    const totalTTC = totalHT + totalTVA;
    
    const lastMonthHT = docsLastMonth.reduce((s, d) => s + d.items.reduce((x: number, it: any) => x + it.quantity * it.unitPrice, 0), 0);
    const lastMonthTVA = docsLastMonth.reduce((s, d) => s + Math.round((d.items.reduce((x: number, it: any) => x + it.quantity * it.unitPrice, 0) * d.tva) / 100), 0);
    const lastMonthTTC = lastMonthHT + lastMonthTVA;
    
    const paid = documents.filter(d => isCustomerInvoice(d) && d.status === 'paid')
      .reduce((s, d) => s + d.items.reduce((x: number, it: any) => x + it.quantity * it.unitPrice, 0) * (1 + d.tva/100), 0);
    const partial = documents.filter(d => isCustomerInvoice(d) && d.status === 'partial')
      .reduce((s, d) => s + (d.payments || []).reduce((p, pay) => p + pay.amount, 0), 0);
    const encaisse = paid + partial;
    const du = Math.max(totalTTC - encaisse, 0);
    
    const caGrowth = lastMonthTTC > 0 ? ((totalTTC - lastMonthTTC) / lastMonthTTC) * 100 : 0;
    const invoicesGrowth = docsLastMonth.length > 0 ? ((docsThisMonth.length - docsLastMonth.length) / docsLastMonth.length) * 100 : 0;
    
    return { 
      invoicesCount: docsThisMonth.length, 
      ca: totalTTC, 
      encaisse, 
      impaye: du,
      caGrowth,
      invoicesGrowth,
      clientsCount: clients.length,
      suppliersCount: suppliers.length,
      dischargesCount: discharges.length
    };
  }, [documents, clients, suppliers, discharges, month, year]);

  // Données pour les graphiques
  const chartData = useMemo(() => {
    const byMonth = Array.from({ length: 12 }, (_, m) => {
      const docs = documents.filter(d => (d.type === 'proforma' || d.type === 'invoice' || d.type === 'delivery' || d.type === 'order') && new Date(d.date).getFullYear() === year && new Date(d.date).getMonth() === m);
      const ttc = docs.reduce((s, d) => s + d.items.reduce((x, it) => x + it.quantity * it.unitPrice, 0) * (1 + d.tva/100), 0);
      return Math.round(ttc);
    });

    return {
      sales: {
        labels: ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'],
        datasets: [{
          label: `Chiffre d'affaires ${year}`,
          data: byMonth,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
        }]
      },
      distribution: {
        labels: ['Factures', 'Proformas', 'Livraisons', 'Commandes'],
        datasets: [{
          data: [
            documents.filter(d => d.type === 'invoice').length,
            documents.filter(d => d.type === 'proforma').length,
            documents.filter(d => d.type === 'delivery').length,
            documents.filter(d => d.type === 'order').length
          ]
        }]
      }
    };
  }, [documents, year]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Chargement du tableau de bord...</h2>
          <p className="text-gray-500 mt-2">Préparation de vos données</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <DashboardHeader 
        userName={user?.fullName || 'Utilisateur'}
        greeting="Bonjour"
      />

      {/* Main Content */}
      <div className="px-8 py-8 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardStatsCard
              title="Factures ce mois"
              value={kpis.invoicesCount.toString()}
              change={`+${kpis.invoicesGrowth.toFixed(1)}%`}
              changeType="positive"
              icon={FileText}
              color="bg-blue-500"
              gradient="from-blue-500 to-blue-600"
              description="Factures émises ce mois"
              trend={{ value: kpis.invoicesGrowth, period: 'vs mois dernier' }}
            />
            
            <DashboardStatsCard
              title="Chiffre d'affaires"
              value={`${kpis.ca.toLocaleString('fr-FR')} FCFA`}
              change={`+${kpis.caGrowth.toFixed(1)}%`}
              changeType="positive"
              icon={DollarSign}
              color="bg-green-500"
              gradient="from-green-500 to-green-600"
              description="CA total ce mois"
              trend={{ value: kpis.caGrowth, period: 'vs mois dernier' }}
            />
            
            <DashboardStatsCard
              title="Encaissements"
              value={`${kpis.encaisse.toLocaleString('fr-FR')} FCFA`}
              change="+8.2%"
              changeType="positive"
              icon={CheckCircle}
              color="bg-purple-500"
              gradient="from-purple-500 to-purple-600"
              description="Montants encaissés"
              trend={{ value: 8.2, period: 'vs mois dernier' }}
            />
            
            <DashboardStatsCard
              title="Impayés"
              value={`${kpis.impaye.toLocaleString('fr-FR')} FCFA`}
              change="-12.5%"
              changeType="negative"
              icon={AlertCircle}
              color="bg-orange-500"
              gradient="from-orange-500 to-orange-600"
              description="Montants en attente"
              trend={{ value: -12.5, period: 'vs mois dernier' }}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardChart
              title="Évolution des ventes"
              type="line"
              data={chartData.sales}
              showTrend={true}
              trendValue={kpis.caGrowth}
              trendPeriod="vs mois dernier"
            />
            
            <DashboardChart
              title="Répartition des documents"
              type="doughnut"
              data={chartData.distribution}
              showTrend={false}
            />
          </div>

          {/* Quick Actions */}
          <DashboardQuickActions />

          {/* Recent Activity */}
          <DashboardRecentActivity />

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardStatsCard
              title="Clients actifs"
              value={kpis.clientsCount.toString()}
              change="+2"
              changeType="positive"
              icon={Users}
              color="bg-indigo-500"
              gradient="from-indigo-500 to-indigo-600"
              description="Clients enregistrés"
            />
            
            <DashboardStatsCard
              title="Fournisseurs"
              value={kpis.suppliersCount.toString()}
              change="+1"
              changeType="positive"
              icon={TrendingUp}
              color="bg-cyan-500"
              gradient="from-cyan-500 to-cyan-600"
              description="Fournisseurs partenaires"
            />
            
            <DashboardStatsCard
              title="Décharges"
              value={kpis.dischargesCount.toString()}
              change="+5"
              changeType="positive"
              icon={Activity}
              color="bg-pink-500"
              gradient="from-pink-500 to-pink-600"
              description="Décharges traitées"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardModern;
