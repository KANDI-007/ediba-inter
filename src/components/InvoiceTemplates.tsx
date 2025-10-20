import React from 'react';
import { LineItem } from '../contexts/DataContext';

interface InvoiceTemplateProps {
  form: any;
  design: string;
}

// Fonction utilitaire pour convertir les nombres en mots français
const numberToFrenchWords = (num: number): string => {
  const ones = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  
  if (num === 0) return 'zéro';
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const one = num % 10;
    if (ten === 7 || ten === 9) {
      return tens[ten] + (one > 0 ? '-' + teens[one - 10] : '');
    }
    return tens[ten] + (one > 0 ? '-' + ones[one] : '');
  }
  if (num < 1000) {
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    return (hundred === 1 ? 'cent' : ones[hundred] + ' cent') + 
           (remainder > 0 ? ' ' + numberToFrenchWords(remainder) : '');
  }
  if (num < 1000000) {
    const thousand = Math.floor(num / 1000);
    const remainder = num % 1000;
    return (thousand === 1 ? 'mille' : numberToFrenchWords(thousand) + ' mille') + 
           (remainder > 0 ? ' ' + numberToFrenchWords(remainder) : '');
  }
  return num.toString();
};

const amountToWordsFCFA = (amount: number): string => {
  const rounded = Math.round(amount);
  return numberToFrenchWords(rounded) + ' francs CFA';
};

const formatFrenchLongDate = (iso: string): string => {
  try {
    const d = new Date(iso);
    const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return iso;
  }
};

// Design Classique
const ClassicTemplate: React.FC<InvoiceTemplateProps> = ({ form }) => {
  const totalHT = form.items.reduce((s: number, it: LineItem) => s + it.quantity * it.unitPrice, 0);
  const tvaAmount = Math.round(totalHT * form.tva / 100);
  const totalTTC = totalHT + tvaAmount;

  return (
    <div className="w-full mx-auto bg-white p-8 shadow-lg print-container" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* En-tête avec logo */}
      <div className="flex justify-between items-start mb-8 print-header">
        <div className="flex items-center">
          <div className="w-16 h-16 mr-4 flex-shrink-0">
            <img 
              src="./logo-ediba.png" 
              alt="Logo EDIBA INTER" 
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback si l'image ne charge pas
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg items-center justify-center hidden">
              <span className="text-white font-bold text-xl">E</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">EDIBA INTER SARL U</h1>
            <p className="text-gray-600">Prestation de services informatiques</p>
            <p className="text-sm text-gray-500">Totsi, Rue 331 AGP - Lomé, Togo</p>
            <p className="text-sm text-gray-500">+228 92 60 05 42 / 93 39 18 70</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {form.type === 'proforma' ? 'FACTURE PROFORMA' : 
             form.type === 'order' ? 'COMMANDE' :
             form.type === 'invoice' ? 'FACTURE' : 
             form.type === 'delivery' ? 'BON DE LIVRAISON' : 'DOCUMENT'}
          </div>
          <div className="text-xl font-semibold text-gray-700">N° {form.reference || '____'}</div>
          <div className="text-gray-600 mt-2">Lomé, le {formatFrenchLongDate(form.date)}</div>
          {form.contractOrderReference && (
            <div className="text-gray-600 mt-1 font-semibold">{form.contractOrderReference}</div>
          )}
        </div>
      </div>

      {/* Client */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">FACTURÉ À :</h3>
        <p className="text-lg font-medium text-gray-900">{form.institution || '__________________'}</p>
        {form.address && <p className="text-gray-700">{form.address}</p>}
        {form.city && <p className="text-gray-700">{form.city}</p>}
      </div>

      {/* Tableau des articles */}
      <div className="mb-8 print-no-break">
        <table className="w-full border-collapse border border-gray-300 print-table">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Description</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Qté</th>
              <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Prix unitaire</th>
              <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {form.items.map((item: LineItem, index: number) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-3">{item.description || '—'}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{item.quantity}</td>
                <td className="border border-gray-300 px-4 py-3 text-right">{item.unitPrice.toLocaleString('fr-FR')} FCFA</td>
                <td className="border border-gray-300 px-4 py-3 text-right font-medium">{(item.quantity * item.unitPrice).toLocaleString('fr-FR')} FCFA</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="border border-gray-300 px-4 py-3 text-right font-semibold">Montant HT</td>
              <td className="border border-gray-300 px-4 py-3 text-right font-semibold">{totalHT.toLocaleString('fr-FR')} FCFA</td>
            </tr>
            <tr>
              <td colSpan={3} className="border border-gray-300 px-4 py-3 text-right">TVA ({form.tva}%)</td>
              <td className="border border-gray-300 px-4 py-3 text-right">{tvaAmount.toLocaleString('fr-FR')} FCFA</td>
            </tr>
            <tr className="bg-blue-50">
              <td colSpan={3} className="border border-gray-300 px-4 py-3 text-right font-bold text-lg">TOTAL TTC</td>
              <td className="border border-gray-300 px-4 py-3 text-right font-bold text-lg text-blue-600">{totalTTC.toLocaleString('fr-FR')} FCFA</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Montant en lettres */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg print-no-break">
        <p className="text-center font-medium text-gray-800">
          <strong>Arrêté la présente facture à la somme de :</strong><br/>
          <span className="text-blue-600 font-semibold">{amountToWordsFCFA(totalTTC)}</span>
        </p>
      </div>

      {/* Conditions de paiement */}
      {form.paymentTermsDays !== undefined && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Conditions de paiement :</h4>
          <p className="text-gray-700">
            {form.paymentTermsDays === 0 
              ? 'Paiement comptant' 
              : `Paiement à ${form.paymentTermsDays} jours`
            }
          </p>
        </div>
      )}

      {/* Signature */}
      <div className="flex justify-between items-end mt-12 print-footer">
        <div className="text-center">
          <p className="text-gray-600 mb-8">Signature du client</p>
          <div className="w-32 h-16 border-b-2 border-gray-400"></div>
        </div>
        <div className="text-center">
          <p className="text-gray-600 mb-8">Signature EDIBA INTER</p>
          <div className="w-32 h-16 border-b-2 border-gray-400"></div>
        </div>
      </div>
    </div>
  );
};

// Design Moderne
const ModernTemplate: React.FC<InvoiceTemplateProps> = ({ form }) => {
  const totalHT = form.items.reduce((s: number, it: LineItem) => s + it.quantity * it.unitPrice, 0);
  const tvaAmount = Math.round(totalHT * form.tva / 100);
  const totalTTC = totalHT + tvaAmount;

  return (
    <div className="w-full mx-auto bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* En-tête moderne */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">EDIBA INTER SARL U</h1>
              <p className="text-blue-100">Solutions informatiques innovantes</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold mb-1">
              {form.type === 'proforma' ? 'FACTURE PROFORMA' : 
               form.type === 'order' ? 'COMMANDE' :
               form.type === 'invoice' ? 'FACTURE' : 
               form.type === 'delivery' ? 'BON DE LIVRAISON' : 'DOCUMENT'}
            </div>
            <div className="text-lg">N° {form.reference || '____'}</div>
          </div>
        </div>
      </div>

      {/* Informations client */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Facturé à</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-lg font-medium text-gray-900">{form.institution || '__________________'}</p>
              {form.address && <p className="text-gray-600 mt-1">{form.address}</p>}
              {form.city && <p className="text-gray-600">{form.city}</p>}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations</h3>
            <div className="space-y-2 text-gray-600">
              <p><strong>Date :</strong> {formatFrenchLongDate(form.date)}</p>
              <p><strong>Échéance :</strong> {form.paymentTermsDays === 0 ? 'Comptant' : `${form.paymentTermsDays} jours`}</p>
            </div>
          </div>
        </div>

        {/* Tableau moderne */}
        <div className="overflow-hidden rounded-lg border border-gray-200 mb-8">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Description</th>
                <th className="px-6 py-4 text-center font-semibold text-gray-700">Qté</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-700">Prix unitaire</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {form.items.map((item: LineItem, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{item.description || '—'}</td>
                  <td className="px-6 py-4 text-center">{item.quantity}</td>
                  <td className="px-6 py-4 text-right">{item.unitPrice.toLocaleString('fr-FR')} FCFA</td>
                  <td className="px-6 py-4 text-right font-medium">{(item.quantity * item.unitPrice).toLocaleString('fr-FR')} FCFA</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={3} className="px-6 py-4 text-right font-semibold">Montant HT</td>
                <td className="px-6 py-4 text-right font-semibold">{totalHT.toLocaleString('fr-FR')} FCFA</td>
              </tr>
              <tr>
                <td colSpan={3} className="px-6 py-4 text-right">TVA ({form.tva}%)</td>
                <td className="px-6 py-4 text-right">{tvaAmount.toLocaleString('fr-FR')} FCFA</td>
              </tr>
              <tr className="bg-blue-600 text-white">
                <td colSpan={3} className="px-6 py-4 text-right font-bold text-lg">TOTAL TTC</td>
                <td className="px-6 py-4 text-right font-bold text-lg">{totalTTC.toLocaleString('fr-FR')} FCFA</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Montant en lettres */}
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <p className="text-center text-gray-800">
            <strong>Arrêté la présente facture à la somme de :</strong><br/>
            <span className="text-blue-600 font-semibold text-lg">{amountToWordsFCFA(totalTTC)}</span>
          </p>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Contact</h4>
            <p className="text-gray-600">Totsi, Rue 331 AGP - Lomé, Togo</p>
            <p className="text-gray-600">+228 92 60 05 42 / 93 39 18 70</p>
            <p className="text-gray-600">edibainter@gmail.com</p>
          </div>
          <div className="flex justify-end items-end">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Signature</p>
              <div className="w-32 h-16 border-b-2 border-gray-400"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Design Élégant
const ElegantTemplate: React.FC<InvoiceTemplateProps> = ({ form }) => {
  const totalHT = form.items.reduce((s: number, it: LineItem) => s + it.quantity * it.unitPrice, 0);
  const tvaAmount = Math.round(totalHT * form.tva / 100);
  const totalTTC = totalHT + tvaAmount;

  return (
    <div className="w-full mx-auto bg-white" style={{ fontFamily: 'Georgia, serif' }}>
      {/* En-tête élégant */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-800 text-white p-8 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-6">
                <span className="text-purple-800 font-bold text-xl">E</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">EDIBA INTER SARL U</h1>
                <p className="text-purple-100 text-lg">Excellence en services informatiques</p>
                <p className="text-purple-200 text-sm">Totsi, Rue 331 AGP - Lomé, Togo</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold mb-2">
                {form.type === 'proforma' ? 'FACTURE PROFORMA' : 
                 form.type === 'order' ? 'COMMANDE' :
                 form.type === 'invoice' ? 'FACTURE' : 
                 form.type === 'delivery' ? 'BON DE LIVRAISON' : 'DOCUMENT'}
              </div>
              <div className="text-xl font-semibold">N° {form.reference || '____'}</div>
              <div className="text-purple-200 mt-2">Lomé, le {formatFrenchLongDate(form.date)}</div>
              {form.contractOrderReference && (
                <div className="text-purple-200 mt-1 font-semibold">{form.contractOrderReference}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Client */}
      <div className="p-8">
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500">
          <h3 className="text-xl font-semibold text-purple-800 mb-3">FACTURÉ À</h3>
          <p className="text-2xl font-medium text-gray-900">{form.institution || '__________________'}</p>
          {form.address && <p className="text-gray-700 mt-2">{form.address}</p>}
          {form.city && <p className="text-gray-700">{form.city}</p>}
        </div>

        {/* Tableau élégant */}
        <div className="mb-8 overflow-hidden rounded-xl border border-purple-200">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Description</th>
                <th className="px-6 py-4 text-center font-semibold">Qté</th>
                <th className="px-6 py-4 text-right font-semibold">Prix unitaire</th>
                <th className="px-6 py-4 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100">
              {form.items.map((item: LineItem, index: number) => (
                <tr key={index} className="hover:bg-purple-50">
                  <td className="px-6 py-4">{item.description || '—'}</td>
                  <td className="px-6 py-4 text-center">{item.quantity}</td>
                  <td className="px-6 py-4 text-right">{item.unitPrice.toLocaleString('fr-FR')} FCFA</td>
                  <td className="px-6 py-4 text-right font-medium">{(item.quantity * item.unitPrice).toLocaleString('fr-FR')} FCFA</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-purple-50">
                <td colSpan={3} className="px-6 py-4 text-right font-semibold">Montant HT</td>
                <td className="px-6 py-4 text-right font-semibold">{totalHT.toLocaleString('fr-FR')} FCFA</td>
              </tr>
              <tr className="bg-purple-50">
                <td colSpan={3} className="px-6 py-4 text-right">TVA ({form.tva}%)</td>
                <td className="px-6 py-4 text-right">{tvaAmount.toLocaleString('fr-FR')} FCFA</td>
              </tr>
              <tr className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                <td colSpan={3} className="px-6 py-4 text-right font-bold text-lg">TOTAL TTC</td>
                <td className="px-6 py-4 text-right font-bold text-lg">{totalTTC.toLocaleString('fr-FR')} FCFA</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Montant en lettres */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200 mb-8">
          <p className="text-center text-gray-800">
            <strong className="text-lg">Arrêté la présente facture à la somme de :</strong><br/>
            <span className="text-purple-600 font-semibold text-xl">{amountToWordsFCFA(totalTTC)}</span>
          </p>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end mt-12">
          <div className="text-center">
            <p className="text-gray-600 mb-6">Signature du client</p>
            <div className="w-40 h-20 border-b-2 border-purple-400"></div>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-6">Signature EDIBA INTER</p>
            <div className="w-40 h-20 border-b-2 border-purple-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Template spécial pour les bons de livraison
const DeliveryTemplate: React.FC<InvoiceTemplateProps> = ({ form }) => {
  const totalHT = form.items.reduce((s: number, it: LineItem) => s + it.quantity * it.unitPrice, 0);
  const tvaAmount = Math.round(totalHT * form.tva / 100);
  const totalTTC = totalHT + tvaAmount;
  // Numérotation BL visible en aperçu et impression avancée
  const yearSuffix = new Date(form.date || Date.now()).getFullYear().toString().slice(-2);
  const blNumber = form.id || `N°BL${yearSuffix}00001`;

  return (
    <div className="w-full mx-auto bg-white print-container" style={{ fontFamily: 'Rockwell, Georgia, \"Times New Roman\", Times, serif', minHeight: '297mm', display: 'flex', flexDirection: 'column' }}>
      {/* En-tête identique Proforma: image pleine largeur */}
      <div className="w-full print-header" style={{ marginBottom: '10px' }}>
        <img src="./factureimage/header.jpg" alt="EDIBA INTER" style={{ width: '100%', height: 'auto', maxHeight: 140, objectFit: 'cover', display: 'block' }} />
      </div>

      {/* Infos société à gauche + date centrée + client à gauche */}
      <div className="px-6 print-header">
        <div className="flex justify-between items-start mb-2">
          <div className="text-left text-[11px] text-gray-800" style={{ lineHeight: '1.3' }}>
            <div><span className="font-bold">Raison Sociale :</span> EDIBA INTER SARL U</div>
            <div><span className="font-bold">Adresse :</span> Agbalépedo, Rue 335 AGP, Lomé</div>
            <div><span className="font-bold">Tél :</span> +228 92 60 05 42 / 93 39 18 70</div>
            <div><span className="font-bold">Email :</span> edibainter@gmail.com</div>
            <div><span className="font-bold">Régime fiscal :</span> Réel avec TVA</div>
            <div><span className="font-bold">NIF :</span> 1001694526</div>
          </div>
          <div style={{ minWidth: 1 }} />
        </div>

        <div className="text-center text-[12px] text-gray-700 mb-2">
          {form.city || 'Lomé'}, le {formatFrenchLongDate(form.date)}
        </div>

        <div className="text-center mb-2">
          <div className="text-[16px] font-extrabold underline text-gray-900">BON DE LIVRAISON {blNumber}</div>
        </div>

        <div className="text-left text-[12px] text-gray-900 font-bold">
          <span className="underline">CLIENT</span>: {form.institution || '__________________'}
        </div>

        {/* Tableau des articles */}
        <div className="mt-6 print-no-break">
          <table className="w-full text-[12px] border-collapse" style={{ border: '1px solid #000' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th className="border border-gray-800 px-2 py-2 text-center font-bold">N°</th>
                <th className="border border-gray-800 px-2 py-2 text-left font-bold">Désignation</th>
                <th className="border border-gray-800 px-2 py-2 text-center font-bold">Qté cmde</th>
                <th className="border border-gray-800 px-2 py-2 text-center font-bold">Qté reçu</th>
              </tr>
            </thead>
            <tbody>
              {form.items.map((it: LineItem, idx: number) => (
                <tr key={idx}>
                  <td className="border border-gray-800 px-2 py-2 text-center">{idx + 1}</td>
                  <td className="border border-gray-800 px-2 py-2">{it.description || '—'}</td>
                  <td className="border border-gray-800 px-2 py-2 text-center">{typeof (it as any).receivedQuantity === 'number' ? (it as any).receivedQuantity : 0}</td>
                  <td className="border border-gray-800 px-2 py-2 text-center">{it.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mention de réception */}
        <div className="mt-4 text-[12px] text-gray-900 print-no-break">
          <div className="font-semibold p-3 bg-gray-50 border border-gray-300">
            Les articles ci-dessus ont été réceptionnés à : <span className="font-bold">{form.institution || '__________________'}</span>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end mt-12 print-footer">
          <div className="text-center">
            <div className="text-[12px] text-gray-600 mb-2">EDIBA INTER</div>
            <div className="text-[10px] text-gray-500 mb-4">Nom du livreur et son rôle</div>
            <div className="w-32 h-16 border-b-2 border-gray-400"></div>
          </div>
          <div className="text-center">
            <div className="text-[12px] text-gray-600 mb-2">Représentant du client ou de l'institution</div>
            <div className="w-32 h-16 border-b-2 border-gray-400"></div>
          </div>
        </div>
      </div>

      {/* Pied de page collé en bas */}
      <div style={{ marginTop: 'auto' }} />
      <div className="print-footer" style={{ textAlign: 'center' }}>
        <img 
          src="./pied.png" 
          alt="Pied de page EDIBA INTER" 
          className="w-full h-auto"
          style={{ maxHeight: '120px', objectFit: 'contain' }}
        />
      </div>
    </div>
  );
};

// Template 1: Design bleu/violet avec formes ondulées
const Template1: React.FC<InvoiceTemplateProps> = ({ form }) => {
  const totalHT = form.items.reduce((s: number, it: LineItem) => s + it.quantity * it.unitPrice, 0);
  const tvaAmount = Math.round(totalHT * form.tva / 100);
  const totalTTC = totalHT + tvaAmount;

  return (
    <div className="w-full mx-auto bg-white print-container" style={{ fontFamily: 'Arial, sans-serif', minHeight: '297mm' }}>
      {/* Bandeau ondulé en haut */}
      <div className="w-full h-12 print-header" style={{ 
        background: 'linear-gradient(90deg, #6b21a8, #1d4ed8)',
        borderRadius: '0 0 20px 20px'
      }}></div>
      
      {/* En-tête principal */}
      <div className="p-6 print-header">
        <div className="flex items-start justify-between">
          {/* Logo et nom de l'entreprise */}
          <div className="flex-1 pr-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg mr-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
                  </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">EDIBA INTER</div>
                <div className="text-sm text-gray-600">Prestation de services et conception de solutions informatiques</div>
                </div>
              </div>
            
            {/* Informations client */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-semibold text-gray-800 mb-2">Facture à:</div>
              <div className="text-sm text-gray-700">{form.institution || '__________________'}</div>
              {form.address && <div className="text-sm text-gray-700">{form.address}</div>}
              {form.city && <div className="text-sm text-gray-700">{form.city}</div>}
              </div>
            </div>
          
          {/* Détails de la facture */}
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 mb-2" style={{ textDecoration: 'underline' }}>
              {form.type === 'proforma' ? 'FACTURE PROFORMA' : 
               form.type === 'order' ? 'COMMANDE' :
               form.type === 'invoice' ? 'FACTURE' :
               form.type === 'delivery' ? 'BON DE LIVRAISON' : 'DOCUMENT'}
          </div>
            <div className="text-sm text-gray-700 mb-1">N°: {form.reference || '____'}</div>
            <div className="text-sm text-gray-700 mb-1">Date: {formatFrenchLongDate(form.date)}</div>
            {form.contractOrderReference && (
              <div className="text-sm text-gray-700 mb-1 font-semibold">{form.contractOrderReference}</div>
            )}
            <div className="text-sm text-gray-700">Lieu: {form.city || 'Lomé'}</div>
          </div>
        </div>
      </div>

      {/* Tableau des articles */}
      <div className="px-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ backgroundColor: '#6b21a8' }}>
              <th className="text-white p-3 text-left">No.</th>
              <th className="text-white p-3 text-left">Item Description</th>
              <th className="text-white p-3 text-right">Price</th>
              <th className="text-white p-3 text-center">Quantity</th>
              <th className="text-white p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {form.items.map((it: LineItem, idx: number) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="p-3">{idx + 1}</td>
                <td className="p-3">{it.description || '—'}</td>
                <td className="p-3 text-right">${it.unitPrice.toFixed(2)}</td>
                <td className="p-3 text-center">{it.quantity}</td>
                <td className="p-3 text-right font-semibold">${(it.quantity * it.unitPrice).toFixed(2)}</td>
              </tr>
            ))}
            {/* Lignes vides pour plus d'articles */}
            {Array.from({ length: 5 - form.items.length }).map((_, idx) => (
              <tr key={`empty-${idx}`} className="border-b border-gray-200">
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3"></td>
                <td className="p-3"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Résumé et paiement */}
      <div className="px-6 mt-6">
        <div className="flex justify-between">
          {/* Méthode de paiement */}
          <div className="w-1/2">
            <div className="text-sm font-semibold text-gray-800 mb-2">Méthode de Paiement</div>
            <div className="text-sm text-gray-700">Banque: [Nom de la banque]</div>
            <div className="text-sm text-gray-700">Compte: [Numéro de compte]</div>
            <div className="text-sm text-gray-700">Titulaire: EDIBA INTER SARL U</div>
            
            <div className="mt-4">
            <div className="text-sm font-semibold text-gray-800 mb-2">Conditions Générales</div>
            <div className="text-sm text-gray-700">Paiement à réception de facture. En cas de retard, des intérêts de 1% par mois seront appliqués.</div>
            </div>
          </div>
          
          {/* Totaux */}
          <div className="w-1/2 text-right">
            <div className="text-sm text-gray-700 mb-1">Subtotal: ${totalHT.toFixed(2)}</div>
            <div className="text-sm text-gray-700 mb-1">Discount: $0.00</div>
            <div className="text-sm text-gray-700 mb-3">VAT Tax (5%): ${tvaAmount.toFixed(2)}</div>
            <div className="text-lg font-bold text-white p-3 rounded" style={{ backgroundColor: '#6b21a8' }}>
              Total: ${totalTTC.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Pied de page avec bandeau ondulé */}
      <div className="mt-8 print-footer">
        <div className="w-full py-4 text-center text-white" style={{ 
          background: 'linear-gradient(90deg, #1d4ed8, #6b21a8)',
          borderRadius: '20px 20px 0 0'
        }}>
          <div className="flex justify-center items-center space-x-8 text-sm">
            <div className="flex items-center">
              <span className="mr-2">📧</span>
              <span>example@domain.com</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">🌐</span>
              <span>www.example.com</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📞</span>
              <span>+123 1234 456 7890</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Template 2: Design bleu/vert avec logo E
const Template2: React.FC<InvoiceTemplateProps> = ({ form }) => {
  const totalHT = form.items.reduce((s: number, it: LineItem) => s + it.quantity * it.unitPrice, 0);
  const tvaAmount = Math.round(totalHT * form.tva / 100);
  const totalTTC = totalHT + tvaAmount;

  return (
    <div className="w-full mx-auto bg-white print-container" style={{ fontFamily: 'Arial, sans-serif', minHeight: '297mm' }}>
      {/* Bandeau bleu en haut */}
      <div className="w-full h-8 print-header" style={{ backgroundColor: '#1d4ed8' }}></div>
      
      {/* En-tête principal */}
      <div className="p-6 print-header">
        <div className="flex items-start justify-between">
          {/* Logo et nom de l'entreprise */}
          <div className="flex-1 pr-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center mr-3">
                <div className="w-full h-full flex flex-col">
                  <div className="w-8 h-4 bg-blue-600 mb-1"></div>
                  <div className="w-6 h-4 bg-green-500 ml-2"></div>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">EDIBA INTER</div>
                <div className="text-sm text-gray-600">Prestation de services et conception de solutions informatiques</div>
              </div>
            </div>
          </div>
          
          {/* Contact */}
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-800 mb-2">CONTACT</div>
            <div className="text-sm text-gray-700">Agbalébedo, Rue 335 AGP</div>
            <div className="text-sm text-gray-700">+228 92 60 05 42</div>
            <div className="text-sm text-gray-700">edibainter@gmail.com</div>
          </div>
        </div>

        {/* Informations facture */}
        <div className="flex justify-between mt-6">
          <div>
            <div className="text-sm font-semibold text-gray-800 mb-1">Facture à</div>
            <div className="text-sm text-gray-700">{form.institution || '__________________'}</div>
            {form.address && <div className="text-sm text-gray-700">{form.address}</div>}
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-700 mb-1">Date: {formatFrenchLongDate(form.date)}</div>
            <div className="text-sm text-gray-700">Lieu: {form.city || 'Lomé'}</div>
          </div>
        </div>
      </div>

      {/* Tableau des articles */}
      <div className="px-6">
        <table className="w-full text-sm border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left font-semibold">NO.</th>
              <th className="p-3 text-left font-semibold">ITEM DESCRIPTION</th>
              <th className="p-3 text-right font-semibold">PRICE</th>
              <th className="p-3 text-center font-semibold">QTY.</th>
              <th className="p-3 text-right font-semibold">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {form.items.map((it: LineItem, idx: number) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="p-3">{idx + 1}</td>
                <td className="p-3">{it.description || '—'}</td>
                <td className="p-3 text-right">${it.unitPrice.toFixed(2)}</td>
                <td className="p-3 text-center">{it.quantity}</td>
                <td className="p-3 text-right font-semibold">${(it.quantity * it.unitPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Résumé et paiement */}
      <div className="px-6 mt-6">
        <div className="flex justify-between">
          {/* Méthode de paiement */}
          <div className="w-1/2">
            <div className="text-sm font-semibold text-gray-800 mb-2">MÉTHODE DE PAIEMENT</div>
            <div className="text-sm text-gray-700">Banque: [Nom de la banque]</div>
            <div className="text-sm text-gray-700">Compte: [Numéro de compte]</div>
            <div className="text-sm text-gray-700">Titulaire: EDIBA INTER SARL U</div>
            
            <div className="mt-4">
              <div className="text-sm font-semibold text-gray-800 mb-2">CONDITIONS GÉNÉRALES</div>
              <div className="text-sm text-gray-700">Paiement à réception de facture. En cas de retard, des intérêts de 1% par mois seront appliqués.</div>
            </div>
          </div>
          
          {/* Totaux */}
          <div className="w-1/2 text-right">
            <div className="text-sm text-gray-700 mb-1">Subtotal: ${totalHT.toFixed(2)}</div>
            <div className="text-sm text-gray-700 mb-1">Discount: $0.00</div>
            <div className="text-sm text-gray-700 mb-3">Tax (10%): ${tvaAmount.toFixed(2)}</div>
            <div className="text-lg font-bold text-white p-3 rounded" style={{ backgroundColor: '#1d4ed8' }}>
              Total: ${totalTTC.toFixed(2)}
            </div>
            <div className="mt-4 text-sm text-gray-700">Authorised Sign</div>
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <div className="mt-8 print-footer">
        <div className="text-center text-blue-600 font-bold italic mb-4">Thank you for your business</div>
        <div className="w-full py-2 text-center text-white" style={{ backgroundColor: '#1d4ed8' }}>
          <div className="flex justify-center items-center space-x-6 text-sm">
            <div className="flex items-center">
              <span className="mr-2">📞</span>
              <span>Phone</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📍</span>
              <span>Address</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📧</span>
              <span>Mail</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">🌐</span>
              <span>Website</span>
            </div>
          </div>
        </div>
        <div className="w-full h-2" style={{ backgroundColor: '#fbbf24' }}></div>
      </div>
    </div>
  );
};

// Template 3: Design bleu/doré avec formes géométriques
const Template3: React.FC<InvoiceTemplateProps> = ({ form }) => {
  const totalHT = form.items.reduce((s: number, it: LineItem) => s + it.quantity * it.unitPrice, 0);
  const tvaAmount = Math.round(totalHT * form.tva / 100);
  const totalTTC = totalHT + tvaAmount;

  return (
    <div className="w-full mx-auto bg-white print-container" style={{ fontFamily: 'Arial, sans-serif', minHeight: '297mm' }}>
      {/* Bandeau bleu en haut */}
      <div className="w-full h-2 print-header" style={{ backgroundColor: '#1d4ed8' }}></div>
      
      {/* En-tête principal avec formes géométriques */}
      <div className="p-6 print-header relative">
        {/* Forme géométrique en haut à droite */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
          <div className="w-full h-full relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600 rounded-full"></div>
            <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-400 rounded-full"></div>
          </div>
        </div>
        
        <div className="flex items-start justify-between">
          {/* Logo et nom de l'entreprise */}
          <div className="flex-1 pr-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center mr-3">
                <div className="w-full h-full flex flex-col">
                  <div className="w-8 h-4 bg-blue-600 mb-1"></div>
                  <div className="w-6 h-4 bg-yellow-400 ml-2"></div>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  <span className="text-blue-600">EDIBA</span>
                  <span className="text-gray-800">INTER</span>
                </div>
                <div className="text-sm text-gray-600">Prestation de services et conception de solutions informatiques</div>
              </div>
            </div>
          </div>
          
          {/* Détails de la facture */}
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {form.type === 'proforma' ? 'FACTURE PROFORMA' : 
               form.type === 'order' ? 'COMMANDE' :
               form.type === 'invoice' ? 'FACTURE' :
               form.type === 'delivery' ? 'BON DE LIVRAISON' : 'DOCUMENT'}
            </div>
            <div className="text-sm text-gray-700 mb-1">N°: {form.reference || '____'}</div>
            <div className="text-sm text-gray-700">Date: {formatFrenchLongDate(form.date)}</div>
          </div>
        </div>

        {/* Informations client */}
        <div className="mt-6">
          <div className="text-sm font-semibold text-gray-800 mb-1">Facture à:</div>
          <div className="text-sm text-gray-700">{form.institution || '__________________'}</div>
          {form.address && <div className="text-sm text-gray-700">{form.address}</div>}
          {form.city && <div className="text-sm text-gray-700">{form.city}</div>}
        </div>
      </div>

      {/* Tableau des articles */}
      <div className="px-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left font-semibold border border-gray-300">No</th>
              <th className="p-3 text-left font-semibold border border-gray-300">Item Description</th>
              <th className="p-3 text-center font-semibold border border-gray-300">Qty</th>
              <th className="p-3 text-right font-semibold border border-gray-300">Price</th>
              <th className="p-3 text-right font-semibold border border-gray-300">Total</th>
            </tr>
          </thead>
          <tbody>
            {form.items.map((it: LineItem, idx: number) => (
              <tr key={idx} className="border border-gray-300">
                <td className="p-3 border border-gray-300">{idx + 1}</td>
                <td className="p-3 border border-gray-300">{it.description || '—'}</td>
                <td className="p-3 text-center border border-gray-300">{it.quantity}</td>
                <td className="p-3 text-right border border-gray-300">${it.unitPrice.toFixed(2)}</td>
                <td className="p-3 text-right border border-gray-300 font-semibold">${(it.quantity * it.unitPrice).toFixed(2)}</td>
              </tr>
            ))}
            {/* Lignes vides pour plus d'articles */}
            {Array.from({ length: 10 - form.items.length }).map((_, idx) => (
              <tr key={`empty-${idx}`} className="border border-gray-300">
                <td className="p-3 border border-gray-300"></td>
                <td className="p-3 border border-gray-300"></td>
                <td className="p-3 border border-gray-300"></td>
                <td className="p-3 border border-gray-300"></td>
                <td className="p-3 border border-gray-300"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Résumé et paiement */}
      <div className="px-6 mt-6">
        <div className="flex justify-between">
          {/* Méthode de paiement */}
          <div className="w-1/2">
            <div className="text-sm font-semibold text-gray-800 mb-2">Informations de Paiement:</div>
            <div className="text-sm text-gray-700">Banque: [Nom de la banque]</div>
            <div className="text-sm text-gray-700">Compte: [Numéro de compte]</div>
            <div className="text-sm text-gray-700">Titulaire: EDIBA INTER SARL U</div>
          </div>
          
          {/* Totaux */}
          <div className="w-1/2 text-right">
            <div className="inline-block">
              <div className="text-sm text-gray-700 mb-1 bg-gray-100 p-2">Sub Total</div>
              <div className="text-sm text-gray-700 mb-1 bg-gray-100 p-2">Tax</div>
              <div className="text-sm text-gray-700 mb-1 bg-gray-100 p-2 font-bold">TOTAL</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pied de page avec formes géométriques */}
      <div className="mt-8 print-footer relative">
        {/* Forme géométrique en bas à gauche */}
        <div className="absolute bottom-0 left-0 w-32 h-32 opacity-20">
          <div className="w-full h-full relative">
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-600 rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-yellow-400 rounded-full"></div>
          </div>
        </div>
        
        <div className="text-center mb-4">
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-700">
            <div className="flex items-center">
              <span className="mr-2">📞</span>
              <span>Phone</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📍</span>
              <span>Address</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📧</span>
              <span>Mail</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">🌐</span>
              <span>Website</span>
            </div>
          </div>
        </div>
        <div className="w-full h-2" style={{ backgroundColor: '#fbbf24' }}></div>
      </div>
    </div>
  );
};

// Template 4: Design dentaire avec icône dent
const Template4: React.FC<InvoiceTemplateProps> = ({ form }) => {
  const totalHT = form.items.reduce((s: number, it: LineItem) => s + it.quantity * it.unitPrice, 0);
  const tvaAmount = Math.round(totalHT * form.tva / 100);
  const totalTTC = totalHT + tvaAmount;

  return (
    <div className="w-full mx-auto bg-white print-container" style={{ fontFamily: 'Arial, sans-serif', minHeight: '297mm' }}>
      {/* En-tête avec bandeau bleu */}
      <div className="w-full h-8 print-header" style={{ backgroundColor: '#1d4ed8' }}></div>
      
      {/* En-tête principal */}
      <div className="p-6 print-header">
        <div className="flex items-start justify-between">
          {/* Logo et nom de l'entreprise */}
          <div className="flex-1 pr-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-200 rounded-full mr-3 flex items-center justify-center">
                <span className="text-blue-600 text-2xl">🦷</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">EDIBA INTER</div>
                <div className="text-sm text-gray-600">Prestation de services et conception de solutions informatiques</div>
              </div>
            </div>
          </div>
          
          {/* Détails de la facture */}
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {form.type === 'proforma' ? 'FACTURE PROFORMA' : 
               form.type === 'order' ? 'COMMANDE' :
               form.type === 'invoice' ? 'FACTURE' :
               form.type === 'delivery' ? 'BON DE LIVRAISON' : 'DOCUMENT'} N° {form.reference || '____'}
            </div>
            <div className="text-sm text-gray-700 mb-1">Date: {formatFrenchLongDate(form.date)}</div>
            <div className="text-sm text-gray-700">Lieu: {form.city || 'Lomé'}</div>
          </div>
        </div>
      </div>

      {/* Tableau des articles */}
      <div className="px-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ backgroundColor: '#1d4ed8' }}>
              <th className="text-white p-3 text-left">PRODUCT</th>
              <th className="text-white p-3 text-right">PRICE</th>
              <th className="text-white p-3 text-center">QTY</th>
              <th className="text-white p-3 text-right">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {form.items.map((it: LineItem, idx: number) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                <td className="p-3">{it.description || 'Lorem ipsum'}</td>
                <td className="p-3 text-right">${it.unitPrice.toFixed(2)}</td>
                <td className="p-3 text-center">{it.quantity}</td>
                <td className="p-3 text-right font-semibold">${(it.quantity * it.unitPrice).toFixed(2)}</td>
              </tr>
            ))}
            {/* Lignes vides pour plus d'articles */}
            {Array.from({ length: 5 - form.items.length }).map((_, idx) => (
              <tr key={`empty-${idx}`} className={idx % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                <td className="p-3">Lorem ipsum</td>
                <td className="p-3 text-right">$0.00</td>
                <td className="p-3 text-center">0</td>
                <td className="p-3 text-right">$0.00</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Résumé et paiement */}
      <div className="px-6 mt-6">
        <div className="flex justify-between">
          {/* Méthode de paiement et conditions */}
          <div className="w-1/2">
            <div className="text-sm font-semibold text-blue-600 mb-2">MÉTHODE DE PAIEMENT</div>
            <div className="text-sm text-gray-700 mb-4">Banque: [Nom de la banque] - Compte: [Numéro de compte] - Titulaire: EDIBA INTER SARL U</div>
            
            <div className="text-sm font-semibold text-blue-600 mb-2">CONDITIONS GÉNÉRALES</div>
            <div className="text-sm text-gray-700">Paiement à réception de facture. En cas de retard, des intérêts de 1% par mois seront appliqués.</div>
          </div>
          
          {/* Totaux */}
          <div className="w-1/2 text-right">
            <div className="text-sm text-gray-700 mb-1">SUB TOTAL: ${totalHT.toFixed(2)}</div>
            <div className="text-sm text-gray-700 mb-1">TAX: 0.00%</div>
            <div className="text-lg font-bold text-gray-800 mb-4">TOTAL: ${totalTTC.toFixed(2)}</div>
            
            {/* Signature */}
            <div className="mt-8">
              <div className="text-sm text-gray-700">AUTHORISED SIGN</div>
              <div className="w-32 h-16 border-b-2 border-gray-400 mt-2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <div className="mt-8 print-footer">
        <div className="text-center text-blue-600 font-bold italic mb-4">Thank you for your business</div>
        <div className="w-full py-3 text-center text-white" style={{ backgroundColor: '#1d4ed8' }}>
          <div className="flex justify-center items-center space-x-8 text-sm">
            <div className="flex items-center">
              <span className="mr-2">📧</span>
              <span>business@company.com</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📞</span>
              <span>+00 123 45 67 89</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📱</span>
              <span>Social Media</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Nouveau Design Kilimandjaro - Dynamique et optimisé
const KilimandjaroTemplate: React.FC<InvoiceTemplateProps> = ({ form }) => {
  const totalHT = form.items.reduce((s: number, it: LineItem) => s + it.quantity * it.unitPrice, 0);
  const tvaAmount = Math.round(totalHT * form.tva / 100);
  const totalTTC = totalHT + tvaAmount;

  return (
    <div className="w-full mx-auto bg-white print-container" style={{ fontFamily: 'Arial, sans-serif', minHeight: '297mm' }}>
      {/* En-tête avec logo et informations */}
      <div className="mb-6 print-header">
        <div className="flex justify-between items-start">
          {/* Logo et informations entreprise */}
          <div className="flex items-start space-x-8">
            <div className="w-40 h-40 flex-shrink-0">
              <img 
                src="./logo-ediba.png" 
                alt="Logo EDIBA INTER" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg items-center justify-center hidden">
                <span className="text-white font-bold text-5xl">E</span>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: 'serif' }}>
                EDIBA INTER SARL U
              </h1>
              <p className="text-gray-600 italic text-xs mb-2">
                Faites-nous confiance!!!
              </p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>NIF: 1001895203</p>
                <p>331 Rue AGP Totsi, Lomé-TOGO</p>
                <p>Tel: +228 92 60 05 42 / 93 39 18 70</p>
              </div>
            </div>
          </div>
          
          {/* Informations document */}
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Rockwell, serif' }}>
              {form.city || 'Lomé'}, le {formatFrenchLongDate(form.date)}
            </div>
            <div className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Rockwell, serif' }}>
              {form.type === 'proforma' ? 'FACTURE PROFORMA' : 
               form.type === 'order' ? 'COMMANDE' :
               form.type === 'invoice' ? 'FACTURE' : 
               form.type === 'delivery' ? 'BON DE LIVRAISON' : 'DOCUMENT'}
              {' '}
              {form.reference || form.autoGeneratedNumber || 'N°____'}
            </div>
            {form.contractOrderReference && (
              <div className="text-gray-600 mt-1 font-semibold text-sm" style={{ fontFamily: 'Rockwell, serif' }}>
                {form.contractOrderReference}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Corps du document */}
      <div className="mb-6">
        {/* Zone destinataire */}
        <div className="mb-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-sm font-bold text-gray-800 mb-2">INFORMATIONS ENTREPRISE</h2>
              <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-600">
                <p className="text-xs text-gray-600">NIF: 1001895203</p>
                <p className="text-xs text-gray-600">CNSS: 124509</p>
                <p className="text-xs text-gray-600">Tel: +228 92 60 05 42</p>
              </div>
            </div>
            
            <div className="w-80">
              <h2 className="text-sm font-bold text-gray-800 mb-2">DOIT :</h2>
              <div className="bg-white border-2 border-gray-300 p-3 rounded">
                <h3 className="font-bold text-gray-900 text-base mb-1">{form.client || form.institution || 'Client'}</h3>
                <div className="space-y-1 text-gray-700">
                  <p className="text-xs">ADRESSE: {form.address || 'Non spécifiée'}</p>
                  <p className="text-xs">Tel: {form.clientPhone || 'Non spécifié'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations de paiement - Seulement si nécessaire */}
        {form.paymentTermsDays !== undefined && form.paymentTermsDays > 0 && (
          <div className="mb-4 text-center">
            <p className="text-xs font-semibold text-gray-700 mb-1">
              REFERENCE A RAPPELER LORS DU REGLEMENT
            </p>
            <p className="text-xs text-gray-600 mb-1">
              PAYABLE PAR CHEQUE OU PAR VIREMENT A NOTRE COMPTE:
            </p>
            <p className="text-sm font-bold text-blue-600">TG005 01262 000236789920 44 BIA TOGO</p>
          </div>
        )}
      </div>

      {/* Tableau des produits */}
      <div className="mb-6">
        <div className="overflow-hidden border border-gray-300">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left font-bold text-xs border-r border-gray-300">Réf.</th>
                <th className="px-3 py-2 text-center font-bold text-xs border-r border-gray-300">QTE</th>
                <th className="px-3 py-2 text-left font-bold text-xs border-r border-gray-300">Désignations</th>
                <th className="px-3 py-2 text-right font-bold text-xs border-r border-gray-300">Prix Unit.</th>
                <th className="px-3 py-2 text-right font-bold text-xs">Montant</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {form.items.map((item: LineItem, index: number) => (
                <tr key={index}>
                  <td className="px-3 py-2 text-xs text-gray-900 border-r border-gray-300">{(item as any).reference && (item as any).reference !== '0' ? (item as any).reference : (index + 1)}</td>
                  <td className="px-3 py-2 text-xs text-gray-900 text-center border-r border-gray-300">{item.quantity}</td>
                  <td className="px-3 py-2 text-xs text-gray-900 border-r border-gray-300">{item.description}</td>
                  <td className="px-3 py-2 text-xs text-gray-900 text-right border-r border-gray-300">{item.unitPrice.toLocaleString('fr-FR')} FCFA</td>
                  <td className="px-3 py-2 text-xs font-semibold text-gray-900 text-right">{(item.quantity * item.unitPrice).toLocaleString('fr-FR')} FCFA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Zone totaux */}
      <div className="mb-6">
        <div className="flex justify-end">
          <div className="w-72">
            <div className="bg-gray-50 p-3 rounded border border-gray-300">
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1 border-b border-gray-300">
                  <span className="text-gray-700 font-semibold text-sm">TOTAL HT</span>
                  <span className="text-gray-900 font-bold text-sm">{totalHT.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-300">
                  <span className="text-gray-700 font-semibold text-sm">TVA {form.tva}%</span>
                  <span className="text-gray-900 font-bold text-sm">{tvaAmount.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between items-center py-2 bg-blue-600 text-white rounded px-3">
                  <span className="font-bold text-base">TOTAL TTC</span>
                  <span className="font-black text-lg">{totalTTC.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Montant en lettres */}
      <div className="mb-6">
        <div className="bg-gray-50 p-3 rounded border border-gray-300">
          <p className="text-center font-bold text-gray-800 text-sm">
            Arrêtée la présente {form.type === 'proforma' ? 'FACTURE PROFORMA' : 'FACTURE'} à la somme de : 
            <span className="text-blue-600 ml-2">{amountToWordsFCFA(totalTTC).toUpperCase()}</span>
          </p>
        </div>
      </div>

      {/* Informations complémentaires - Simplifiées */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="font-bold text-gray-800 mb-2 text-sm">INFORMATIONS COMPLÉMENTAIRES</h3>
            <div className="space-y-1 text-xs text-gray-600">
              <p>• Facture établie en F CFA</p>
              <p>• Validité: {form.paymentTermsDays ? `${form.paymentTermsDays} jours` : '30 jours'}</p>
              <p>• Paiement: {form.paymentTermsDays ? `Sous ${form.paymentTermsDays} jours` : '100% à la livraison'}</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded">
            <h3 className="font-bold text-gray-800 mb-2 text-sm">MODE DE PAIEMENT</h3>
            <div className="space-y-1 text-xs text-gray-600">
              <p className="font-semibold">PAYABLE PAR CHÈQUE OU VIREMENT:</p>
              <p className="font-bold text-blue-600">TG005 01262 000236789920 44 BIA TOGO</p>
            </div>
          </div>
        </div>
      </div>

      {/* Signature */}
      <div className="flex justify-end mb-6">
        <div className="text-center">
          <p className="text-gray-600 mb-2 text-sm">Le Directeur Général,</p>
          <div className="border-t-2 border-gray-300 w-40 mt-6"></div>
          <p className="text-gray-800 font-semibold mt-2 text-sm">EDIBA INTER SARL U</p>
        </div>
      </div>

      {/* Pied de page - Simplifié */}
      <div className="bg-gray-800 text-white p-3 print-footer">
        <div className="text-center">
          <p className="text-xs text-gray-300 mb-2">
            Prestation de services informatiques • Développement d'applications • 
            Maintenance informatique • Formation • Conseil en systèmes d'information
          </p>
          <div className="border-t border-gray-600 pt-2">
            <p className="text-xs text-gray-400">
              EDIBA INTER SARL U • 331 Rue AGP Totsi, Lomé-TOGO • 
              Tel: +228 92 60 05 42 / 93 39 18 70 • 
              NIF: 1001895203 • CNSS: 124509
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Design Recommandé (conforme à la maquette fournie)
const RecommendedTemplate: React.FC<InvoiceTemplateProps> = ({ form }) => {
  const totalHT = form.items.reduce((s: number, it: LineItem) => s + it.quantity * it.unitPrice, 0);
  const tvaAmount = Math.round(totalHT * form.tva / 100);
  const totalTTC = totalHT + tvaAmount;

  return (
    <div className="w-full mx-auto bg-white print-container" style={{ fontFamily: 'Arial, sans-serif', minHeight: '297mm' }}>
      {/* En-tête avec image personnalisée */}
      <div className="w-full print-header" style={{ marginBottom: '20px' }}>
        <img 
          src="./entete.png" 
          alt="En-tête EDIBA INTER" 
          className="w-full h-auto"
          style={{ maxHeight: '120px', objectFit: 'contain' }}
        />
      </div>
      
      {/* Informations de l'entreprise à droite */}
      <div className="px-6 print-header">
        <div className="flex justify-end">
          <div className="text-right text-[11px] text-gray-800" style={{ lineHeight: '1.3' }}>
            <div><span className="font-bold">Raison Sociale</span> : EDIBA INTER SARL U</div>
            <div><span className="font-bold">Adresse</span> : Agbalébedo, Rue 335 AGP</div>
            <div><span className="font-bold">Tel</span> : +228 92 60 05 42</div>
            <div><span className="font-bold">E-mail</span> : edibainter@gmail.com</div>
            <div><span className="font-bold">Régime fiscal</span> : Réel avec TVA</div>
            <div><span className="font-bold">NIF</span> : 1001694526</div>
            <div><span className="font-bold">CNSS</span> : 124509</div>
          </div>
        </div>

        {/* Date à droite */}
        <div className="mt-4 text-right text-[12px] text-gray-700">
          {form.city || 'Lomé'}, le {formatFrenchLongDate(form.date)}
          {form.contractOrderReference && (
            <div className="mt-1 font-semibold">{form.contractOrderReference}</div>
          )}
        </div>

        {/* Titre du document centré */}
        <div className="mt-6 text-center">
          <div className="text-[16px] font-extrabold underline text-gray-900">
            {form.type === 'proforma' ? 'FACTURE PROFORMA' : 
             form.type === 'order' ? 'COMMANDE' :
             form.type === 'invoice' ? 'FACTURE' :
             form.type === 'delivery' ? 'BON DE LIVRAISON' : 'DOCUMENT'} N° {form.reference || '____'}
          </div>
        </div>

        {/* Client centré */}
        <div className="mt-4 text-center text-[12px] text-gray-900">
          <span className="font-extrabold">CLIENT :</span> {form.institution || '__________________'}
        </div>

        {/* Tableau des articles */}
        <div className="mt-6 print-no-break">
          <table className="w-full text-[12px] border-collapse" style={{ border: '1px solid #000' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th className="border border-gray-800 px-2 py-2 text-center font-bold">N°</th>
                <th className="border border-gray-800 px-2 py-2 text-left font-bold">Désignation</th>
                <th className="border border-gray-800 px-2 py-2 text-center font-bold">Unité</th>
                <th className="border border-gray-800 px-2 py-2 text-center font-bold">Qté</th>
                <th className="border border-gray-800 px-2 py-2 text-right font-bold">Prix Unitaire</th>
                <th className="border border-gray-800 px-2 py-2 text-right font-bold">Montant</th>
              </tr>
            </thead>
            <tbody>
              {form.items.map((it: LineItem, idx: number) => (
                <tr key={idx}>
                  <td className="border border-gray-800 px-2 py-2 text-center">{idx + 1}</td>
                  <td className="border border-gray-800 px-2 py-2">{it.description || '—'}</td>
                  <td className="border border-gray-800 px-2 py-2 text-center">Pièce</td>
                  <td className="border border-gray-800 px-2 py-2 text-center">{it.quantity}</td>
                  <td className="border border-gray-800 px-2 py-2 text-right">{it.unitPrice.toLocaleString('fr-FR')}</td>
                  <td className="border border-gray-800 px-2 py-2 text-right font-semibold">{(it.quantity * it.unitPrice).toLocaleString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className="border border-gray-800 px-2 py-2 text-right font-semibold">TOTAL HT</td>
                <td className="border border-gray-800 px-2 py-2 text-right font-semibold">{totalHT.toLocaleString('fr-FR')}</td>
              </tr>
              <tr>
                <td colSpan={5} className="border border-gray-800 px-2 py-2 text-right">TVA {form.tva}%</td>
                <td className="border border-gray-800 px-2 py-2 text-right">{tvaAmount.toLocaleString('fr-FR')}</td>
              </tr>
              <tr style={{ backgroundColor: '#e0e0e0' }}>
                <td colSpan={5} className="border border-gray-800 px-2 py-2 text-right font-bold">TOTAL TTC</td>
                <td className="border border-gray-800 px-2 py-2 text-right font-bold">{totalTTC.toLocaleString('fr-FR')}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Montant en lettres */}
        <div className="mt-4 text-[12px] text-gray-900 print-no-break">
          <div className="font-semibold italic p-3 bg-gray-50 border border-gray-300">
          Arrêté la présente facture pro-forma à la somme de :
            {' '}<span className="font-bold">{amountToWordsFCFA(totalTTC)}</span>.
          </div>
        </div>

        {/* Signature */}
        <div className="mt-8 text-right text-[12px] text-gray-900 print-footer">
          <div className="font-medium">La Directrice</div>
        </div>
      </div>

      {/* Pied de page avec image personnalisée */}
      <div className="mt-8 print-footer">
        <img 
          src="./pied.png" 
          alt="Pied de page EDIBA INTER" 
          className="w-full h-auto"
          style={{ maxHeight: '120px', objectFit: 'contain' }}
        />
      </div>
    </div>
  );
};

// Template Proforma avec design EDIBA INTER
const ProformaTemplate: React.FC<InvoiceTemplateProps> = ({ form, design }) => {
  const totalHT = form.items.reduce((sum: number, item: LineItem) => sum + item.quantity * item.unitPrice, 0);
  const typeToLabel: Record<string, string> = {
    proforma: 'FACTURE PROFORMA',
    delivery: 'BON DE LIVRAISON',
    order: 'COMMANDE',
    invoice: 'FACTURE'
  };
  const typeToPrefix: Record<string, string> = {
    proforma: 'D',
    delivery: 'BL',
    order: 'CMD',
    invoice: 'F'
  };
  const docType = form.type || 'proforma';
  const titleLabel = typeToLabel[docType] || 'DOCUMENT';
  const yearSuffix = new Date(form.date || Date.now()).getFullYear().toString().slice(-2);
  const generatedNumber = form.id || `${typeToPrefix[docType] || 'DOC'}${yearSuffix}00001`;

  return (
    <div className="proforma-template" style={{ minHeight: '297mm', display: 'flex', flexDirection: 'column' }}>
      <div className="print-container recommended-template" style={{ width: '210mm', padding: '10mm', margin: '0 auto', color: '#000', fontFamily: 'Rockwell, Georgia, "Times New Roman", Times, serif', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* En-tête image plein largeur */}
        <div className="print-header" style={{ marginBottom: 10 }}>
          <img src="./factureimage/header.jpg" alt="En-tête EDIBA INTER" style={{ width: '100%', height: 'auto', maxHeight: 140, objectFit: 'cover', display: 'block' }} />
        </div>

        {/* Infos société à gauche sous l'image */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div className="company-info" style={{ textAlign: 'left', fontSize: '10pt' }}>
            <div><span className="label">Raison Sociale :</span> EDIBA INTER SARL U</div>
            <div><span className="label">Adresse :</span> Agbalépedo, Rue 335 AGP, Lomé</div>
            <div><span className="label">Tél :</span> +228 92 60 05 42 / 93 39 18 70</div>
            <div><span className="label">Email :</span> edibainter@gmail.com</div>
            <div><span className="label">Date de création :</span> 20 Août 2021</div>
            <div><span className="label">Statut Juridique :</span> SARL U</div>
            <div><span className="label">Régime fiscal :</span> Réel avec TVA</div>
            <div><span className="label">NIF :</span> 1001694526</div>
          </div>
          <div style={{ minWidth: 1 }} />
        </div>

        {/* Date centrée sous les informations: Ville, le jj mois aaaa */}
        <div className="document-date" style={{ textAlign: 'center', fontSize: '10pt', marginBottom: 8 }}>
          {(form.city || 'Lomé')}, le {formatFrenchLongDate(form.date)}
          {form.contractOrderReference && (
            <div style={{ marginTop: '4px', fontWeight: 'bold' }}>{form.contractOrderReference}</div>
          )}
        </div>

        {/* Titre centré */}
        <div className="document-title" style={{ textAlign: 'center', margin: '8pt 0', fontWeight: 700, textDecoration: 'underline' }}>
          {titleLabel} N° {generatedNumber}
        </div>

        {/* CLIENT à gauche (souligné) */}
        <div className="client-info" style={{ marginBottom: 8 }}>
          <span style={{ textDecoration: 'underline', fontWeight: 700 }}>CLIENT</span>: {form.client || form.institution || ''}
        </div>

        {/* Contenu principal */}
        <table className="items-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #000', padding: 4 }}>N°</th>
              <th style={{ border: '1px solid #000', padding: 4 }}>Désignation</th>
              <th style={{ border: '1px solid #000', padding: 4 }}>Description</th>
              <th style={{ border: '1px solid #000', padding: 4 }}>Quantité</th>
              <th style={{ border: '1px solid #000', padding: 4 }}>Prix Unitaire</th>
              <th style={{ border: '1px solid #000', padding: 4 }}>Montant</th>
            </tr>
          </thead>
          <tbody>
            {form.items.map((item: LineItem, index: number) => (
              <tr key={index}>
                <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{index + 1}</td>
                <td style={{ border: '1px solid #000', padding: 4 }}>{item.description.split('\n')[0] || item.description}</td>
                <td style={{ border: '1px solid #000', padding: 4, textAlign: 'left' }}>
                  {item.description.split('\n').slice(1).map((line, i) => (<div key={i}>{line}</div>))}
                </td>
                <td style={{ border: '1px solid #000', textAlign: 'center', padding: 4 }}>{item.quantity}</td>
                <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4 }}>{item.unitPrice.toLocaleString('fr-FR')}</td>
                <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4 }}>{(item.quantity * item.unitPrice).toLocaleString('fr-FR')}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={5} style={{ border: '1px solid #000', textAlign: 'right', padding: 4, fontWeight: 700 }}>TOTAL HT</td>
              <td style={{ border: '1px solid #000', textAlign: 'right', padding: 4, fontWeight: 700 }}>{totalHT.toLocaleString('fr-FR')}</td>
            </tr>
          </tbody>
        </table>

        {/* Totaux HT/TVA/TTC */}
        {(() => {
          const tvaAmount = Math.round((totalHT * (form.tva ?? 18)) / 100);
          const totalTTC = totalHT + tvaAmount;
          return (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #000', padding: 4 }} colSpan={4} />
                  <td style={{ border: '1px solid #000', padding: 4, textAlign: 'right', fontWeight: 700 }}>Montant total HT</td>
                  <td style={{ border: '1px solid #000', padding: 4, textAlign: 'right', fontWeight: 700 }}>{totalHT.toLocaleString('fr-FR')}</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: 4 }} colSpan={4} />
                  <td style={{ border: '1px solid #000', padding: 4, textAlign: 'right', fontWeight: 700 }}>TVA {(form.tva ?? 18)}%</td>
                  <td style={{ border: '1px solid #000', padding: 4, textAlign: 'right', fontWeight: 700 }}>{tvaAmount.toLocaleString('fr-FR')}</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: 4 }} colSpan={4} />
                  <td style={{ border: '1px solid #000', padding: 4, textAlign: 'right', fontWeight: 700 }}>Montant total TTC</td>
                  <td style={{ border: '1px solid #000', padding: 4, textAlign: 'right', fontWeight: 700 }}>{totalTTC.toLocaleString('fr-FR')}</td>
                </tr>
              </tbody>
            </table>
          );
        })()}

        <div className="amount-in-words" style={{ marginTop: 12 }}>
          {(() => {
            const kind = (form.type === 'invoice') ? 'facture' : (form.type === 'order') ? 'commande' : (form.type === 'delivery') ? 'bon de livraison' : (form.type === 'contract') ? 'contrat' : 'facture proforma';
            return (
              <span>
                Arrêté la présente {kind} à la somme de : <strong>{amountToWordsFCFA(totalHT)}.</strong>
              </span>
            );
          })()}
        </div>

        {/* Mention "Signée" et qualité */}
        <div style={{ textAlign: 'right', marginTop: 10, fontWeight: 700 }}>Signée</div>
        <div style={{ height: 16 }} />
        <div style={{ textAlign: 'left', fontSize: '10pt' }}>
          En qualité de la Directrice dûment autorisée à signer pour et au nom de EDIBA INTER SARL U.
        </div>

        <div className="signature" style={{ textAlign: 'right', marginTop: 32 }}>
          La Directrice<br />
          <span style={{ display: 'inline-block', height: 12 }} />
          <strong>ALAYI Abide</strong>
        </div>

        {/* Pied de page collé en bas */}
        <div style={{ marginTop: 'auto' }} />
        <div className="recommended-footer print-footer" style={{ textAlign: 'center' }}>
          <img src="./factureimage/footer.jpg" alt="Pied de page" style={{ width: '100%', height: 'auto', maxHeight: 120, objectFit: 'cover', display: 'block' }} />
        </div>
      </div>
    </div>
  );
};

// Composant principal
const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ form, design }) => {
  // Utiliser le template spécial pour les bons de livraison
  if (form.type === 'delivery') {
    return <DeliveryTemplate form={form} design={design} />;
  }
  
  switch (design) {
    case 'kilimandjaro':
      return <KilimandjaroTemplate form={form} design={design} />;
    case 'template1':
      return <Template1 form={form} design={design} />;
    case 'template2':
      return <Template2 form={form} design={design} />;
    case 'template3':
      return <Template3 form={form} design={design} />;
    case 'template4':
      return <Template4 form={form} design={design} />;
    case 'classic':
      return <ClassicTemplate form={form} design={design} />;
    case 'modern':
      return <ModernTemplate form={form} design={design} />;
    case 'elegant':
      return <ElegantTemplate form={form} design={design} />;
    case 'recommended':
      return <RecommendedTemplate form={form} design={design} />;
    case 'proforma':
      return <ProformaTemplate form={form} design={design} />;
    default:
      return <ClassicTemplate form={form} design={design} />;
  }
};

export default InvoiceTemplate;

