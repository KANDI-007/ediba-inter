import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface UserDeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  username: string;
  userFullName?: string;
  className?: string;
}

const UserDeleteConfirm: React.FC<UserDeleteConfirmProps> = ({
  isOpen,
  onClose,
  onConfirm,
  username,
  userFullName,
  className = ''
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-12 sm:w-12">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-900">
                  Supprimer l'utilisateur
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-4">
                Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
                <span className="font-semibold text-gray-900">
                  {userFullName || username}
                </span>
                {' '}(@{username}) ?
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">
                      Cette action est irréversible
                    </h4>
                    <p className="text-sm text-red-700 mt-1">
                      L'utilisateur sera définitivement supprimé du système et ne pourra plus se connecter.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleConfirm}
              className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </button>
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteConfirm;
