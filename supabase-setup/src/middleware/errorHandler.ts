import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode = 500, message, code } = error;

  // Log de l'erreur
  console.error('Erreur API:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Gestion des erreurs spécifiques
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Données de requête invalides';
    code = 'VALIDATION_ERROR';
  }

  if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Non autorisé';
    code = 'UNAUTHORIZED';
  }

  if (error.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Accès interdit';
    code = 'FORBIDDEN';
  }

  if (error.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Ressource non trouvée';
    code = 'NOT_FOUND';
  }

  if (error.name === 'ConflictError') {
    statusCode = 409;
    message = 'Conflit de données';
    code = 'CONFLICT';
  }

  // Gestion des erreurs de base de données
  if (error.message.includes('duplicate key')) {
    statusCode = 409;
    message = 'Cette ressource existe déjà';
    code = 'DUPLICATE_KEY';
  }

  if (error.message.includes('foreign key')) {
    statusCode = 400;
    message = 'Référence invalide';
    code = 'FOREIGN_KEY_ERROR';
  }

  // Gestion des erreurs de validation Joi
  if (error.message.includes('"value" must be')) {
    statusCode = 400;
    message = 'Données de validation invalides';
    code = 'VALIDATION_ERROR';
  }

  // Réponse d'erreur
  const errorResponse = {
    error: {
      message: message || 'Erreur interne du serveur',
      code: code || 'INTERNAL_ERROR',
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.url,
      method: req.method
    }
  };

  // En mode développement, inclure la stack trace
  if (process.env.NODE_ENV === 'development') {
    (errorResponse as any).error.stack = error.stack;
  }

  res.status(statusCode).json(errorResponse);
};

export const createError = (message: string, statusCode: number = 500, code?: string): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.isOperational = true;
  return error;
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
