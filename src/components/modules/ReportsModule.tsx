import React, { useMemo, useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Calendar,
  FileText,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { exportClientInvoiceJournal, exportSupplierInvoiceJournal, InvoiceData, SupplierInvoiceData } from '../../utils/ExcelGeneratorSimple';

const ReportsModule: React.FC = () => {
  const { documents, clients, supplierInvoices } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('2025');
  const [activeReport, setActiveReport] = useState('dashboard');

  // Générer les années fiscales disponibles basées sur les données
  const fiscalYears = useMemo(() => {
    const years = new Set<string>();
    documents.forEach(doc => {
      const year = new Date(doc.date).getFullYear().toString();
      years.add(year);
    });
    return Array.from(years).sort();
  }, [documents]);
  
  const reports = [
    { id: 'dashboard', name: 'Tableau de Bord', icon: BarChart3 },
    { id: 'journal-client', name: 'Journal Facture Client', icon: FileText },
    { id: 'journal-fournisseur', name: 'Journal Facture Fournisseur', icon: Users },
    { id: 'fiscal-reports', name: 'Rapports Fiscaux OTR', icon: DollarSign },
  ];

  // Calculer les données mensuelles basées sur les vraies données
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const currentYear = parseInt(selectedPeriod);
    
    return months.map((month, index) => {
      const monthDocs = documents.filter(doc => {
        const docDate = new Date(doc.date);
        return docDate.getFullYear() === currentYear && docDate.getMonth() === index;
      });
      
      const facture = monthDocs.reduce((sum, doc) => {
        const totalHT = doc.items.reduce((s, item) => s + item.quantity * item.unitPrice, 0);
        const tva = Math.round(totalHT * doc.tva / 100);
        return sum + totalHT + tva;
      }, 0);
      
      const encaisse = monthDocs.reduce((sum, doc) => {
        return sum + (doc.payments?.reduce((pSum, payment) => pSum + payment.amount, 0) || 0);
      }, 0);
      
      const impaye = facture - encaisse;
      
      return { month, facture, encaisse, impaye };
    });
  }, [documents, selectedPeriod]);

  // Calculer les top clients basés sur les vraies données
  const topClients = useMemo(() => {
    const clientStats = new Map<string, { amount: number; invoices: number }>();
    
    documents.forEach(doc => {
      if (doc.client) {
        const totalHT = doc.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        const tva = Math.round(totalHT * doc.tva / 100);
        const total = totalHT + tva;
        
        if (clientStats.has(doc.client)) {
          const existing = clientStats.get(doc.client)!;
          clientStats.set(doc.client, {
            amount: existing.amount + total,
            invoices: existing.invoices + 1
          });
        } else {
          clientStats.set(doc.client, { amount: total, invoices: 1 });
        }
      }
    });
    
    return Array.from(clientStats.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [documents]);

  const exportXlsx = async (rows: any[][], header: string[], sheetName: string, filename: string, otherSheets?: { name: string; header: string[]; rows: any[][] }[]) => {
    try {
      const XLSX: any = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm');
      const wb = XLSX.utils.book_new();
      
      // Créer la feuille principale avec formatage
      const main = XLSX.utils.aoa_to_sheet([header, ...rows]);
      
      // Ajouter des styles pour le titre
      if (!main['!cols']) main['!cols'] = [];
      if (!main['!rows']) main['!rows'] = [];
      
      // Largeur des colonnes
      main['!cols'] = header.map(() => ({ wch: 15 }));
      
      // Hauteur de la ligne de titre
      main['!rows'] = [{ hpt: 20 }];
      
      XLSX.utils.book_append_sheet(wb, main, sheetName);
      
      if (otherSheets) {
        otherSheets.forEach(s => {
          const ws = XLSX.utils.aoa_to_sheet([s.header, ...s.rows]);
          ws['!cols'] = s.header.map(() => ({ wch: 15 }));
          ws['!rows'] = [{ hpt: 20 }];
          XLSX.utils.book_append_sheet(wb, ws, s.name);
        });
      }
      
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      const csv = [header, ...rows].map(arr => arr.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
      const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const [editingStates, setEditingStates] = useState<{[key: string]: any}>({});

  const handleStateChange = (documentId: string, field: string, value: string) => {
    setEditingStates(prev => ({
      ...prev,
      [`${documentId}_${field}`]: value
    }));
  };

  const getStateOptions = (field: string) => {
    switch (field) {
      case 'archive':
        return ['FAIT', 'PAS FAIT'];
      case 'otr':
        return ['DECLARE', 'NON DECLARE'];
      case 'periode':
        return [
          'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
          'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
          'Déclaré pour : le mois', 'Déclaré pour : le trimestre', 'Déclaré pour : l\'année'
        ];
      default:
        return [];
    }
  };

  const journalClient = useMemo((): InvoiceData[] => {
    const year = selectedPeriod;
    return documents
      .filter(d => d.date.startsWith(year) && d.type === 'invoice')
      .map(d => {
        const montantHT = d.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
        const tva = Math.round((montantHT * d.tva) / 100);
        const montantTTC = montantHT + tva;
        const paid = (d.payments || []).reduce((s, p) => s + p.amount, 0);
        const etatPaiement = paid >= montantTTC ? 'Payé' : (paid > 0 ? 'Partiellement payé' : 'Impayé');
        const etatExecution = d.workflowStatus === 'completed' ? 'PLEIN' : 'EN COURS';
        
        // Utiliser les états édités ou les valeurs par défaut
        const etatArchive = editingStates[`${d.id}_archive`] || 'FAIT';
        const etatOtr = editingStates[`${d.id}_otr`] || 'DECLARE';
        const periodeDeclaration = editingStates[`${d.id}_periode`] || 'Déclaré pour : le mois';
        const objet = editingStates[`${d.id}_objet`] || d.items.map(i => i.description).join(', ');
        
        // Trouver le NIF du client
        const clientData = clients.find(c => c.raisonSociale === d.client);
        const nif = clientData?.nif || '';
        
        return { 
          numero: d.id, 
          nom: d.client,
          nif,
          objet,
          montantHT, 
          tva, 
          montantTTC, 
          etatExecution,
          etatPaiement,
          etatArchive,
          etatOtr,
          date: d.date,
          periodeDeclaration
        };
      });
  }, [documents, selectedPeriod, editingStates, clients]);

  const journalFournisseur = useMemo((): SupplierInvoiceData[] => {
    const year = selectedPeriod;
    return supplierInvoices
      .filter(d => d.date.startsWith(year))
      .map(d => {
        const etatExecution = 'PLEIN';
        const etatPaiement = d.status === 'paid' ? 'TOTAL' : (d.status === 'partial' ? 'PARTIEL' : 'IMPAYE');
        const etatArchive = 'FAIT';
        const etatOtr = 'DECLARE';
        const autreEtat = 'RIEN';
        const periodeDeclaration = 'Janvier';
        
        return {
          date: d.date,
          numeroFacture: d.id,
          fournisseur: d.supplierName,
          nif: d.nif || 'N/A',
          objet: 'Prestation de service',
          montantHT: d.ht,
          tva: d.tva,
          montantTTC: d.ttc,
          etatExecution,
          etatPaiement,
          etatArchive,
          etatOtr,
          autreEtat,
          periodeDeclaration
        };
      });
  }, [supplierInvoices, selectedPeriod]);

  // Calculer les données fiscales basées sur les vraies données (factures finales uniquement)
  const fiscalData = useMemo(() => {
    const currentYear = parseInt(selectedPeriod);
    const yearDocs = documents.filter(doc => {
      const docDate = new Date(doc.date);
      return docDate.getFullYear() === currentYear && doc.type === 'invoice';
    });
    
    const chiffreAffaires = yearDocs.reduce((sum, doc) => {
      const totalHT = doc.items.reduce((s, item) => s + item.quantity * item.unitPrice, 0);
      const tva = Math.round(totalHT * doc.tva / 100);
      return sum + totalHT + tva;
    }, 0);
    
    const encaisse = yearDocs.reduce((sum, doc) => {
      return sum + (doc.payments?.reduce((pSum, payment) => pSum + payment.amount, 0) || 0);
    }, 0);
    
    const impaye = chiffreAffaires - encaisse;
    
    const tvaCollectee = yearDocs.reduce((sum, doc) => {
      const totalHT = doc.items.reduce((s, item) => s + item.quantity * item.unitPrice, 0);
      return sum + Math.round(totalHT * doc.tva / 100);
    }, 0);
    
    return {
      tvaCollectee,
      tvaDeductible: Math.round(tvaCollectee * 0.3), // Estimation
      tvaAVerser: Math.round(tvaCollectee * 0.7), // Estimation
      retenuesSource: Math.round(encaisse * 0.02), // Estimation
      chiffreAffaires,
      encaisse,
      impaye
    };
  }, [documents, selectedPeriod]);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Titre du dashboard avec exercice */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tableau de Bord - Exercice {selectedPeriod}</h3>
        <p className="text-gray-600">Vue d'ensemble des performances financières pour l'exercice {selectedPeriod}</p>
      </div>
      
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-sky-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{fiscalData.chiffreAffaires.toLocaleString('fr-FR')} FCFA</p>
              <p className="text-gray-600">CA Total Exercice {selectedPeriod}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{fiscalData.encaisse.toLocaleString('fr-FR')} FCFA</p>
              <p className="text-gray-600">Encaissé Exercice {selectedPeriod}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-red-500 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{fiscalData.impaye.toLocaleString('fr-FR')} FCFA</p>
              <p className="text-gray-600">Impayés Exercice {selectedPeriod}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">127</p>
              <p className="text-gray-600">Factures</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution mensuelle */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution Mensuelle</h3>
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 w-12">{data.month}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-sky-400 to-green-400 h-2 rounded-full"
                      style={{ width: `${(data.facture / 70000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900">{data.facture.toLocaleString('fr-FR')} FCFA</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Clients */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Clients</h3>
          <div className="space-y-4">
            {topClients.map((client, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{client.name}</p>
                  <p className="text-sm text-gray-500">{client.invoices} factures</p>
                </div>
                <span className="font-semibold text-green-600">{client.amount.toLocaleString('fr-FR')} FCFA</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderJournalClient = () => (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Journal Facture Client - {selectedPeriod}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const header = ['N° Fac', 'Nom', 'NIF', 'Objet', 'Montant HT', 'TVA', 'Montant TTC', 'Etat Execution', 'Etat Paiement', 'Etat Archive', 'Etat OTR', 'Date', 'Periode Declaration'];
              const rows = journalClient.map(r => [r.numero, r.nom, r.nif || '', r.objet, r.montantHT, r.tva, r.montantTTC, r.etatExecution, r.etatPaiement, r.etatArchive, r.etatOtr, r.date, r.periodeDeclaration]);
              const totals = ['TOTAL','','','', journalClient.reduce((s,r)=>s+r.montantHT,0), journalClient.reduce((s,r)=>s+r.tva,0), journalClient.reduce((s,r)=>s+r.montantTTC,0), '','','','','',''];
              const csv = [header, ...rows, totals].map(arr => arr.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
              const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `journal_client_${selectedPeriod}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter CSV
          </button>
          <button
            onClick={async () => {
              await exportClientInvoiceJournal(journalClient, `Journal_Factures_Clients_${selectedPeriod}.xlsx`);
            }}
            className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter XLSX
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed" style={{ minWidth: '1400px' }}>
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">N° Fac</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Nom</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">NIF</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-80 min-w-80">Objet</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Montant HT</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">TVA</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Montant TTC</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Etat Execution</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Etat Paiement</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Etat Archive</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Etat OTR</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Date</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Periode Declaration</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {journalClient.map((facture, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-24">{facture.numero}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 w-32">{facture.nom}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 w-20">{facture.nif || '-'}</td>
                <td className="px-3 py-4 text-sm text-gray-900 w-80 min-w-80">
                  <input 
                    type="text"
                    className="w-full text-sm border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={facture.objet || 'CONSOMMABLE'}
                    onChange={(e) => handleStateChange(facture.numero, 'objet', e.target.value)}
                    placeholder="CONSOMMABLE"
                    title={facture.objet || 'CONSOMMABLE'}
                  />
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 w-24">{facture.montantHT.toLocaleString('fr-FR')} FCFA</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 w-20">{facture.tva.toLocaleString('fr-FR')} FCFA</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-24">{facture.montantTTC.toLocaleString('fr-FR')} FCFA</td>
                <td className="px-3 py-4 whitespace-nowrap w-24">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    facture.etatExecution === 'PLEIN' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {facture.etatExecution}
                  </span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap w-28">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    facture.etatPaiement === 'Payé' ? 'bg-green-100 text-green-800' :
                    facture.etatPaiement === 'Partiellement payé' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {facture.etatPaiement}
                  </span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap w-24">
                  <select 
                    className="text-sm border rounded px-2 py-1 w-full"
                    value={facture.etatArchive}
                    onChange={(e) => handleStateChange(facture.numero, 'archive', e.target.value)}
                  >
                    {getStateOptions('archive').map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-4 whitespace-nowrap w-20">
                  <select 
                    className="text-sm border rounded px-2 py-1 w-full"
                    value={facture.etatOtr}
                    onChange={(e) => handleStateChange(facture.numero, 'otr', e.target.value)}
                  >
                    {getStateOptions('otr').map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 w-20">{facture.date}</td>
                <td className="px-3 py-4 whitespace-nowrap w-32">
                  <select 
                    className="text-sm border rounded px-2 py-1 w-full"
                    value={facture.periodeDeclaration}
                    onChange={(e) => handleStateChange(facture.numero, 'periode', e.target.value)}
                  >
                    {getStateOptions('periode').map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderJournalSupplier = () => (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Journal Facture Fournisseur - {selectedPeriod}</h3>
        <button
          onClick={() => {
            const header = ['Fournisseur','NIF','Date','MontantHT','TVA','MontantTTC','Statut'];
            const rows = supplierInvoices.filter(f => f.date.startsWith(selectedPeriod)).map(r => [r.supplierName, r.nif || '', r.date, r.ht, r.tva, r.ttc, r.status]);
            const csv = [header, ...rows].map(arr => arr.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
            const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `journal_fournisseur_${selectedPeriod}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Exporter CSV
        </button>
        <button
          onClick={async () => {
            await exportSupplierInvoiceJournal(journalFournisseur, `Journal_Factures_Fournisseurs_${selectedPeriod}.xlsx`);
          }}
          className="ml-2 flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Exporter XLSX
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed" style={{ minWidth: '1400px' }}>
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Date</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Numéro Facture</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Fournisseur</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">NIF</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-80 min-w-80">Objet</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Montant HT</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">TVA</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Montant TTC</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Etat Execution</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Etat Paiement</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Etat Archive</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Etat OTR</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Autre Etat</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Période Déclaration</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {supplierInvoices.filter(f => f.date.startsWith(selectedPeriod)).map((f, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 w-20">{f.date}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 w-24">{f.invoiceNumber || f.id}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 w-32">{f.supplierName}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 w-20">{f.nif || 'N/A'}</td>
                <td className="px-3 py-4 text-sm text-gray-900 w-80 min-w-80">
                  <select 
                    className="w-full text-sm border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editingStates[`${f.id}_objet`] || 'PRODUIT MÉCANIQUE'}
                    onChange={(e) => handleStateChange(f.id, 'objet', e.target.value)}
                  >
                    <option value="PRODUIT MÉCANIQUE">PRODUIT MÉCANIQUE</option>
                    <option value="PRODUITS D'ÉLECTRICITÉ">PRODUITS D'ÉLECTRICITÉ</option>
                    <option value="MOBILIER DE BUREAU">MOBILIER DE BUREAU</option>
                    <option value="ACHATS DIVERS">ACHATS DIVERS</option>
                    <option value="PRODUIT PAPIER">PRODUIT PAPIER</option>
                  </select>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 w-24">{f.ht.toLocaleString('fr-FR')} FCFA</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 w-20">{f.tva.toLocaleString('fr-FR')} FCFA</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-24">{f.ttc.toLocaleString('fr-FR')} FCFA</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 w-24">PLEIN</td>
                <td className="px-3 py-4 whitespace-nowrap w-24">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    f.status === 'paid' ? 'bg-green-100 text-green-800' :
                    f.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {f.status === 'paid' ? 'TOTAL' : f.status === 'partial' ? 'PARTIEL' : 'IMPAYE'}
                  </span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap w-24">
                  <select 
                    className="text-sm border rounded px-2 py-1 w-full"
                    value={editingStates[`${f.id}_archive`] || 'FAIT'}
                    onChange={(e) => handleStateChange(f.id, 'archive', e.target.value)}
                  >
                    {getStateOptions('archive').map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-4 whitespace-nowrap w-20">
                  <select 
                    className="text-sm border rounded px-2 py-1 w-full"
                    value={editingStates[`${f.id}_otr`] || 'DECLARE'}
                    onChange={(e) => handleStateChange(f.id, 'otr', e.target.value)}
                  >
                    {getStateOptions('otr').map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-4 whitespace-nowrap w-24">
                  <input 
                    type="text"
                    className="w-full text-sm border rounded px-2 py-1"
                    value={editingStates[`${f.id}_autre`] || 'RIEN'}
                    onChange={(e) => handleStateChange(f.id, 'autre', e.target.value)}
                    placeholder="Autre état"
                  />
                </td>
                <td className="px-3 py-4 whitespace-nowrap w-32">
                  <select 
                    className="text-sm border rounded px-2 py-1 w-full"
                    value={editingStates[`${f.id}_periode`] || 'Janvier'}
                    onChange={(e) => handleStateChange(f.id, 'periode', e.target.value)}
                  >
                    {getStateOptions('periode').map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFiscalReports = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Rapport Fiscal OTR - {selectedPeriod}</h3>
          <button
            onClick={async () => {
              const { jsPDF } = await import('jspdf');
              const pdf = new jsPDF('p', 'pt', 'a4');
              const margin = 40;
              const pageWidth = pdf.internal.pageSize.getWidth();
              const pageHeight = pdf.internal.pageSize.getHeight();
              // Company header from Parameters
              let company = { companyName: 'EDIBA-INTER', address: '', phone: '', email: '', taxId: '', registrationNumber: '' } as any;
              try {
                const raw = localStorage.getItem('ediba.company.details');
                if (raw) {
                  const c = JSON.parse(raw);
                  company = { ...company, ...c };
                }
              } catch {}
              // Header
              pdf.setFontSize(14);
              pdf.text(`${company.companyName || 'EDIBA-INTER'} — Etat Fiscal OTR`, margin, margin);
              pdf.setFontSize(11);
              pdf.text(`Exercice: ${selectedPeriod}`, margin, margin + 18);
              if (company.address) pdf.text(`${company.address}`, margin, margin + 34);
              if (company.taxId || company.registrationNumber) {
                const legal = `${company.taxId ? 'NIF: ' + company.taxId : ''}  ${company.registrationNumber ? 'RCCM: ' + company.registrationNumber : ''}`.trim();
                pdf.text(legal, margin, margin + 50);
              }
              pdf.line(margin, margin + 24, pageWidth - margin, margin + 24);

              // Summary block
              let y = margin + 48;
              // Filtrer les factures déclarées OTR pour les totaux et les lignes
              const otrInvoices = journalClient.filter(r => (editingStates[`${r.numero}_otr`] || r.etatOtr || 'DECLARE') === 'DECLARE');
              const totalTTC = otrInvoices.reduce((s, r) => s + r.montantTTC, 0);
              const totalHT = otrInvoices.reduce((s, r) => s + r.montantHT, 0);
              const totalTVA = otrInvoices.reduce((s, r) => s + r.tva, 0);
              pdf.text(`Total HT: ${totalHT.toLocaleString('fr-FR')}`, margin, y); y += 16;
              pdf.text(`TVA Collectée: ${totalTVA.toLocaleString('fr-FR')}`, margin, y); y += 16;
              pdf.text(`Total TTC: ${totalTTC.toLocaleString('fr-FR')}`, margin, y); y += 24;

              // Table header
              const cols = ['Numero','Date','Client','HT','TVA','TTC','Etat OTR'];
              const colWidths = [110, 70, 170, 70, 60, 70, 80];
              let x = margin;
              pdf.setFontSize(10);
              pdf.setFillColor(235, 245, 255);
              pdf.rect(margin, y - 12, pageWidth - margin*2, 22, 'F');
              cols.forEach((c, i) => {
                pdf.text(c, x + 4, y + 4);
                x += colWidths[i];
              });
              y += 10;
              pdf.line(margin, y, pageWidth - margin, y);
              y += 8;

              // Rows with pagination
              const rowHeight = 16;
              const maxRowsPerPage = Math.floor((pageHeight - y - 60) / rowHeight);
              let rowCountOnPage = 0;
              const rows = otrInvoices.map(r => [r.numero, r.date, r.nom, r.montantHT, r.tva, r.montantTTC, (editingStates[`${r.numero}_otr`] || r.etatOtr || 'DECLARE')]);
              for (let idx = 0; idx < rows.length; idx++) {
                const row = rows[idx];
                if (rowCountOnPage >= maxRowsPerPage) {
                  // footer page number
                  pdf.setFontSize(9);
                  pdf.text(`Page ${pdf.getNumberOfPages()}`, pageWidth - margin - 60, pageHeight - margin/2);
                  pdf.addPage();
                  y = margin + 48; // reset below header area
                  // re-render header line and table header on new page
                  pdf.setFontSize(14);
                  pdf.text('EDIBA-INTER — Etat Fiscal OTR (suite)', margin, margin);
                  pdf.setFontSize(11);
                  pdf.text(`Exercice: ${selectedPeriod}`, margin, margin + 18);
                  pdf.line(margin, margin + 24, pageWidth - margin, margin + 24);
                  y = margin + 48;
                  let xh = margin;
                  pdf.setFontSize(10);
                  pdf.setFillColor(235, 245, 255);
                  pdf.rect(margin, y - 12, pageWidth - margin*2, 22, 'F');
                  cols.forEach((c, i) => {
                    pdf.text(c, xh + 4, y + 4);
                    xh += colWidths[i];
                  });
                  y += 10;
                  pdf.line(margin, y, pageWidth - margin, y);
                  y += 8;
                  rowCountOnPage = 0;
                }
                // draw row
                let xr = margin;
                pdf.setFontSize(9);
                row.forEach((cell, i) => {
                  const text = i >= 3 && i <= 5 ? (Number(cell).toLocaleString('fr-FR')) : String(cell);
                  pdf.text(text, xr + 4, y + 10);
                  // vertical separator
                  pdf.line(xr, y, xr, y + rowHeight);
                  xr += colWidths[i];
                });
                // last vertical line and bottom line
                pdf.line(xr, y, xr, y + rowHeight);
                y += rowHeight;
                pdf.line(margin, y, pageWidth - margin, y);
                rowCountOnPage++;
              }

              // Footer on last page
              pdf.setFontSize(9);
              pdf.text(`Page ${pdf.getNumberOfPages()}`, pageWidth - margin - 60, pageHeight - margin/2);
              pdf.text('Document généré automatiquement — Modèle OTR (brouillon)', margin, pageHeight - margin/2);

              pdf.save(`rapport_OTR_${selectedPeriod}.pdf`);
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Générer PDF OTR
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm text-blue-600">Chiffre d'Affaires TTC</p>
                <p className="text-2xl font-bold text-blue-900">{journalClient.reduce((s, r) => s + r.montantTTC, 0).toLocaleString('fr-FR')} FCFA</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm text-green-600">TVA Collectée</p>
                <p className="text-2xl font-bold text-green-900">{journalClient.reduce((s, r) => s + r.tva, 0).toLocaleString('fr-FR')} FCFA</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm text-orange-600">TVA Déductible</p>
                <p className="text-2xl font-bold text-orange-900">0 FCFA</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm text-red-600">TVA à Verser</p>
                <p className="text-2xl font-bold text-red-900">{fiscalData.tvaAVerser.toLocaleString('fr-FR')} FCFA</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm text-purple-600">Retenues à la Source</p>
                <p className="text-2xl font-bold text-purple-900">{fiscalData.retenuesSource.toLocaleString('fr-FR')} FCFA</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-gray-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Taux TVA Moyen</p>
                <p className="text-2xl font-bold text-gray-900">18%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des factures OTR déclarées */}
        <div className="mt-6 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900">Factures Déclarées OTR</h4>
            <p className="text-sm text-gray-600 mt-1">Liste des factures avec état OTR "DECLARE" pour l'année {selectedPeriod}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Facture</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIF</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant HT</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">TVA</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant TTC</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etat OTR</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période Déclaration</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(() => {
                  const otrInvoices = journalClient.filter(r => {
                    const etatOtr = editingStates[`${r.numero}_otr`] || r.etatOtr || 'DECLARE';
                    return etatOtr === 'DECLARE';
                  });
                  
                  if (otrInvoices.length === 0) {
                    return (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                          <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p>Aucune facture déclarée OTR pour l'année {selectedPeriod}</p>
                          <p className="text-sm mt-2">Veuillez définir l'état OTR des factures dans le journal facture client</p>
                        </td>
                      </tr>
                    );
                  }
                  
                  return otrInvoices.map((facture, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{facture.numero}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{facture.date}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{facture.nom}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{facture.nif || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">{facture.montantHT.toLocaleString('fr-FR')} FCFA</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">{facture.tva.toLocaleString('fr-FR')} FCFA</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">{facture.montantTTC.toLocaleString('fr-FR')} FCFA</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {editingStates[`${facture.numero}_otr`] || facture.etatOtr || 'DECLARE'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{facture.periodeDeclaration || '-'}</td>
                    </tr>
                  ));
                })()}
              </tbody>
              {(() => {
                const otrInvoices = journalClient.filter(r => {
                  const etatOtr = editingStates[`${r.numero}_otr`] || r.etatOtr || 'DECLARE';
                  return etatOtr === 'DECLARE';
                });
                if (otrInvoices.length > 0) {
                  return (
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={4} className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">TOTAL</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                          {otrInvoices.reduce((s, r) => s + r.montantHT, 0).toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                          {otrInvoices.reduce((s, r) => s + r.tva, 0).toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                          {otrInvoices.reduce((s, r) => s + r.montantTTC, 0).toLocaleString('fr-FR')} FCFA
                        </td>
                        <td colSpan={2}></td>
                      </tr>
                    </tfoot>
                  );
                }
                return null;
              })()}
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeReport) {
      case 'dashboard':
        return renderDashboard();
      case 'journal-client':
        return renderJournalClient();
      case 'journal-fournisseur':
        return renderJournalSupplier();
      case 'fiscal-reports':
        return renderFiscalReports();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-sky-400 to-green-400 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link 
              to="/dashboard" 
              className="mr-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 flex items-center"
              title="Retour au tableau de bord"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold mb-2">Module Rapports & Statistiques</h1>
              <p className="text-sky-100">Journaux comptables et rapports fiscaux OTR</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium focus:ring-2 focus:ring-sky-300"
            >
              {fiscalYears.map(year => (
                <option key={year} value={year}>Exercice {year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation des rapports */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => setActiveReport(report.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                  activeReport === report.id
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <report.icon className="w-4 h-4 mr-2" />
                {report.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu du rapport */}
      {renderContent()}
    </div>
  );
};

export default ReportsModule;