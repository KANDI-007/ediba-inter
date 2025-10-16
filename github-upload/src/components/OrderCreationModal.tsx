import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Shield, 
  Clock,
  CheckCircle
} from 'lucide-react';
import { CustomerDocument } from '../contexts/DataContext';

interface OrderCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: CustomerDocument;
  onCreateOrder: (orderNumber: string, contractTerms: CustomerDocument['contractTerms']) => void;
}

const OrderCreationModal: React.FC<OrderCreationModalProps> = ({
  isOpen,
  onClose,
  quote,
  onCreateOrder
}) => {
  const [orderNumber] = useState(() => {
    // Génération automatique du numéro de commande
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CMD-${year}${month}${day}-${random}`;
  });
  const [contractTerms, setContractTerms] = useState<CustomerDocument['contractTerms']>({
    deliveryDate: '',
    warrantyPeriod: '12 mois',
    specialConditions: ''
  });

  const totalAmount = quote.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const tvaAmount = Math.round((totalAmount * quote.tva) / 100);
  const ttcAmount = totalAmount + tvaAmount;

  const handleSubmit = () => {
    if (!contractTerms?.deliveryDate) {
      alert('Veuillez spécifier une date de livraison');
      return;
    }

    onCreateOrder(orderNumber, contractTerms);
    onClose();
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h3 className="text-lg font-semibold">Créer une commande à partir du devis</h3>
          <p className="text-blue-100 text-sm">Attribution d'un numéro de commande et conditions contractuelles</p>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Informations du devis */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Devis de référence
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Référence:</span>
                <span className="font-medium ml-2">{quote.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Client:</span>
                <span className="font-medium ml-2">{quote.client}</span>
              </div>
              <div>
                <span className="text-gray-600">Montant TTC:</span>
                <span className="font-medium ml-2 text-green-600">{ttcAmount.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>
          </div>

          {/* Numéro de commande */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de commande (généré automatiquement)
            </label>
            <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700">
              {orderNumber}
            </div>
          </div>

          {/* Conditions contractuelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de livraison prévue *
              </label>
              <input
                type="date"
                value={contractTerms?.deliveryDate || ''}
                onChange={(e) => setContractTerms({ ...contractTerms, deliveryDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Période de garantie
              </label>
              <select
                value={contractTerms?.warrantyPeriod || '12 mois'}
                onChange={(e) => setContractTerms({ ...contractTerms, warrantyPeriod: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="6 mois">6 mois</option>
                <option value="12 mois">12 mois</option>
                <option value="24 mois">24 mois</option>
                <option value="36 mois">36 mois</option>
              </select>
            </div>
          </div>

          {/* Conditions spéciales */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conditions spéciales
            </label>
            <textarea
              value={contractTerms?.specialConditions || ''}
              onChange={(e) => setContractTerms({ ...contractTerms, specialConditions: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Conditions particulières, clauses spéciales..."
            />
          </div>


          {/* Résumé des articles */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Articles commandés</h4>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Description</th>
                    <th className="px-3 py-2 text-center">Qté</th>
                    <th className="px-3 py-2 text-right">Prix unitaire</th>
                    <th className="px-3 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items.map((item, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="px-3 py-2">{item.description}</td>
                      <td className="px-3 py-2 text-center">{item.quantity}</td>
                      <td className="px-3 py-2 text-right">{item.unitPrice.toLocaleString('fr-FR')} FCFA</td>
                      <td className="px-3 py-2 text-right font-medium">
                        {(item.quantity * item.unitPrice).toLocaleString('fr-FR')} FCFA
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-3 py-2 font-semibold">Total HT</td>
                    <td className="px-3 py-2 text-right font-semibold">{totalAmount.toLocaleString('fr-FR')} FCFA</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-3 py-2">TVA ({quote.tva}%)</td>
                    <td className="px-3 py-2 text-right">{tvaAmount.toLocaleString('fr-FR')} FCFA</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-3 py-2 font-semibold">Total TTC</td>
                    <td className="px-3 py-2 text-right font-semibold text-green-600">
                      {ttcAmount.toLocaleString('fr-FR')} FCFA
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Créer la commande
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCreationModal;
