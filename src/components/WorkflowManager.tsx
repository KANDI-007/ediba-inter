import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { CustomerDocument } from '../contexts/DataContext';
import { 
  FileText, 
  ShoppingCart, 
  Truck, 
  Receipt, 
  CheckCircle, 
  ArrowRight,
  Play,
  Eye
} from 'lucide-react';

interface WorkflowManagerProps {
  document: CustomerDocument;
  onWorkflowUpdate?: () => void;
}

const WorkflowManager: React.FC<WorkflowManagerProps> = ({ document, onWorkflowUpdate }) => {
  const { 
    validateQuote, 
    createOrderFromQuote, 
    createDeliveryFromOrder, 
    createInvoiceFromDelivery,
    getDocumentWorkflow,
    updateDocumentWorkflow
  } = useData();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [showWorkflow, setShowWorkflow] = useState(false);
  
  const workflow = getDocumentWorkflow(document.id);
  
  const getWorkflowSteps = () => {
    const steps = [
      { 
        type: 'proforma', 
        label: 'Devis', 
        icon: FileText, 
        status: 'pending',
        description: 'Création du devis'
      },
      { 
        type: 'order', 
        label: 'Commande', 
        icon: ShoppingCart, 
        status: 'pending',
        description: 'Validation et création de commande'
      },
      { 
        type: 'delivery', 
        label: 'Bon de Livraison', 
        icon: Truck, 
        status: 'pending',
        description: 'Création du bon de livraison'
      },
      { 
        type: 'invoice', 
        label: 'Facture', 
        icon: Receipt, 
        status: 'pending',
        description: 'Facturation finale'
      }
    ];
    
    return steps.map(step => {
      const existingDoc = workflow.find(d => d.type === step.type);
      return {
        ...step,
        status: existingDoc ? 'completed' : 
                (document.type === step.type ? 'current' : 'pending'),
        document: existingDoc
      };
    });
  };
  
  const handleNextStep = async () => {
    setIsProcessing(true);
    try {
      let newDocument: CustomerDocument;
      
      switch (document.type) {
        case 'proforma':
          if (document.workflowStatus !== 'validated') {
            // Valider le devis d'abord
            validateQuote(document.id);
            updateDocumentWorkflow(document.id, 'validated');
          }
          // Créer la commande
          newDocument = createOrderFromQuote(
            document.id, 
            orderNumber || `CMD-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
            {
              deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
              warrantyPeriod: '12 mois',
              specialConditions: 'Conditions générales de vente'
            }
          );
          break;
          
        case 'order':
          // Créer le bon de livraison
          newDocument = createDeliveryFromOrder(document.id);
          break;
          
        case 'delivery':
          // Créer la facture
          newDocument = createInvoiceFromDelivery(document.id);
          break;
          
        default:
          throw new Error('Type de document non supporté pour le workflow');
      }
      
      onWorkflowUpdate?.();
      alert(`Document créé avec succès : ${newDocument.id}`);
      
    } catch (error) {
      console.error('Erreur lors de la création du document:', error);
      alert(`Erreur : ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const canProceedToNextStep = () => {
    switch (document.type) {
      case 'proforma':
        return document.workflowStatus === 'draft' || document.workflowStatus === 'validated';
      case 'order':
        return document.workflowStatus === 'ordered';
      case 'delivery':
        return document.workflowStatus === 'delivered';
      default:
        return false;
    }
  };
  
  const getNextStepLabel = () => {
    switch (document.type) {
      case 'proforma':
        return 'Créer la Commande';
      case 'order':
        return 'Créer le Bon de Livraison';
      case 'delivery':
        return 'Créer la Facture';
      default:
        return 'Étape suivante';
    }
  };
  
  const steps = getWorkflowSteps();
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Workflow Document</h3>
        <button
          onClick={() => setShowWorkflow(!showWorkflow)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Eye className="w-4 h-4" />
          {showWorkflow ? 'Masquer' : 'Voir'} le workflow
        </button>
      </div>
      
      {showWorkflow && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = step.status === 'completed';
              const isCurrent = step.status === 'current';
              const isPending = step.status === 'pending';
              
              return (
                <div key={step.type} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center mb-2
                      ${isCompleted ? 'bg-green-100 text-green-600' : 
                        isCurrent ? 'bg-blue-100 text-blue-600' : 
                        'bg-gray-100 text-gray-400'}
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-medium ${
                        isCurrent ? 'text-blue-600' : 
                        isCompleted ? 'text-green-600' : 
                        'text-gray-500'
                      }`}>
                        {step.label}
                      </div>
                      {step.document && (
                        <div className="text-xs text-gray-500 mt-1">
                          {step.document.id}
                        </div>
                      )}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-400 mx-4" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {canProceedToNextStep() && (
        <div className="border-t pt-4">
          <div className="flex items-center gap-4">
            {document.type === 'proforma' && (
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de commande
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="CMD-2025-0001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            
            <button
              onClick={handleNextStep}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {getNextStepLabel()}
            </button>
          </div>
        </div>
      )}
      
      {!canProceedToNextStep() && document.type !== 'invoice' && (
        <div className="border-t pt-4">
          <div className="text-center text-gray-500">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-sm">
              {document.type === 'invoice' 
                ? 'Workflow terminé - Facture créée' 
                : 'Workflow en attente - Étape suivante non disponible'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowManager;
