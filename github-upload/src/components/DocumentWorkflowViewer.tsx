import React from 'react';
import { 
  FileText, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Package,
  Receipt,
  CreditCard,
  Eye
} from 'lucide-react';
import { CustomerDocument } from '../contexts/DataContext';

interface DocumentWorkflowViewerProps {
  documents: CustomerDocument[];
  onViewDocument: (documentId: string) => void;
}

const DocumentWorkflowViewer: React.FC<DocumentWorkflowViewerProps> = ({
  documents,
  onViewDocument
}) => {
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'proforma': return <FileText className="w-5 h-5" />;
      case 'order': return <Package className="w-5 h-5" />;
      case 'delivery': return <Package className="w-5 h-5" />;
      case 'advance': return <Receipt className="w-5 h-5" />;
      case 'balance': return <CreditCard className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getDocumentTitle = (type: string) => {
    switch (type) {
      case 'proforma': return 'Devis';
      case 'order': return 'Commande';
      case 'delivery': return 'Bon de livraison';
      case 'advance': return 'Facture acompte';
      case 'balance': return 'Facture solde';
      default: return 'Document';
    }
  };

  const getStatusIcon = (workflowStatus?: string) => {
    switch (workflowStatus) {
      case 'validated': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'ordered': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-purple-500" />;
      case 'invoiced': return <CheckCircle className="w-4 h-4 text-orange-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (workflowStatus?: string) => {
    switch (workflowStatus) {
      case 'validated': return 'bg-green-100 text-green-800';
      case 'ordered': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      case 'invoiced': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (workflowStatus?: string) => {
    switch (workflowStatus) {
      case 'validated': return 'Validé';
      case 'ordered': return 'Commandé';
      case 'delivered': return 'Livré';
      case 'invoiced': return 'Facturé';
      case 'completed': return 'Terminé';
      default: return 'En attente';
    }
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>Aucun document dans le workflow</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow du processus</h3>
      
      <div className="relative">
        {/* Ligne de connexion */}
        <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {documents.map((doc, index) => (
            <div key={doc.id} className="relative flex items-start">
              {/* Icône du document */}
              <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-200 rounded-full">
                {getDocumentIcon(doc.type)}
              </div>
              
              {/* Contenu du document */}
              <div className="ml-4 flex-1">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">
                        {getDocumentTitle(doc.type)} {doc.id}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.workflowStatus)}`}>
                        {getStatusIcon(doc.workflowStatus)}
                        <span className="ml-1">{getStatusText(doc.workflowStatus)}</span>
                      </span>
                    </div>
                    <button
                      onClick={() => onViewDocument(doc.id)}
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Voir
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Client:</span> {doc.client}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {new Date(doc.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div>
                      <span className="font-medium">Montant:</span> {
                        (doc.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) * (1 + doc.tva / 100))
                          .toLocaleString('fr-FR')
                      } FCFA
                    </div>
                  </div>
                  
                  {/* Informations spécifiques au type de document */}
                  {doc.type === 'order' && doc.orderNumber && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                      <span className="font-medium text-blue-800">Numéro de commande:</span> {doc.orderNumber}
                    </div>
                  )}
                  
                  {doc.contractTerms && (
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      {doc.contractTerms.deliveryDate && (
                        <div>
                          <span className="font-medium">Livraison prévue:</span> {new Date(doc.contractTerms.deliveryDate).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                      {doc.contractTerms.warrantyPeriod && (
                        <div>
                          <span className="font-medium">Garantie:</span> {doc.contractTerms.warrantyPeriod}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Plan de paiement */}
                  {doc.contractTerms?.paymentSchedule && doc.contractTerms.paymentSchedule.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm font-medium text-gray-700 mb-1">Plan de paiement:</div>
                      <div className="space-y-1">
                        {doc.contractTerms.paymentSchedule.map((payment, idx) => (
                          <div key={idx} className="text-sm text-gray-600 flex justify-between">
                            <span>{payment.description} - {new Date(payment.date).toLocaleDateString('fr-FR')}</span>
                            <span className="font-medium">{payment.amount.toLocaleString('fr-FR')} FCFA</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Flèche de connexion */}
              {index < documents.length - 1 && (
                <div className="absolute left-6 top-12 flex items-center justify-center w-6 h-6 bg-white border border-gray-200 rounded-full">
                  <ArrowRight className="w-3 h-3 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentWorkflowViewer;
