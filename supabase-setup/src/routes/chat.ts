import express, { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { requirePermission } from '../middleware/auth';

const router = express.Router();

// Récupération des conversations de l'utilisateur
router.get('/conversations', requirePermission('chat.view'), asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(`
      *,
      conversation_participants (
        user_id,
        users (
          id,
          username,
          full_name,
          avatar_url
        )
      ),
      messages (
        id,
        content,
        message_type,
        sender_id,
        created_at,
        users (
          id,
          username,
          full_name,
          avatar_url
        )
      )
    `)
    .eq('conversation_participants.user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    throw createError('Erreur lors de la récupération des conversations', 500, 'FETCH_ERROR');
  }

  res.json({
    success: true,
    conversations
  });
}));

// Création d'une nouvelle conversation
router.post('/conversations', requirePermission('chat.create'), asyncHandler(async (req: Request, res: Response) => {
  const { name, is_group = false, participant_ids = [] } = req.body;
  const userId = req.user!.id;

  // Créer la conversation
  const { data: conversation, error: convError } = await supabase
    .from('conversations')
    .insert([{
      name,
      is_group,
      created_by: userId
    }])
    .select()
    .single();

  if (convError) {
    throw createError('Erreur lors de la création de la conversation', 500, 'CREATE_ERROR');
  }

  // Ajouter le créateur comme participant
  const participants = [{ conversation_id: conversation.id, user_id: userId }];

  // Ajouter les autres participants
  participant_ids.forEach((participantId: string) => {
    participants.push({
      conversation_id: conversation.id,
      user_id: participantId
    });
  });

  const { error: participantsError } = await supabase
    .from('conversation_participants')
    .insert(participants);

  if (participantsError) {
    throw createError('Erreur lors de l\'ajout des participants', 500, 'ADD_PARTICIPANTS_ERROR');
  }

  res.status(201).json({
    success: true,
    conversation
  });
}));

// Récupération des messages d'une conversation
router.get('/conversations/:id/messages', requirePermission('chat.view'), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { page = 1, limit = 50 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  // Vérifier que l'utilisateur est participant de la conversation
  const { data: participant, error: participantError } = await supabase
    .from('conversation_participants')
    .select('id')
    .eq('conversation_id', id)
    .eq('user_id', req.user!.id)
    .single();

  if (participantError || !participant) {
    throw createError('Accès non autorisé à cette conversation', 403, 'FORBIDDEN');
  }

  const { data: messages, error } = await supabase
    .from('messages')
    .select(`
      *,
      users (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .eq('conversation_id', id)
    .order('created_at', { ascending: false })
    .range(offset, offset + Number(limit) - 1);

  if (error) {
    throw createError('Erreur lors de la récupération des messages', 500, 'FETCH_ERROR');
  }

  res.json({
    success: true,
    messages: messages.reverse() // Inverser pour avoir l'ordre chronologique
  });
}));

// Envoi d'un message
router.post('/conversations/:id/messages', requirePermission('chat.send'), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, message_type = 'text', file_url, file_name, file_size, reply_to_id } = req.body;
  const userId = req.user!.id;

  if (!content && !file_url) {
    throw createError('Contenu du message requis', 400, 'MISSING_CONTENT');
  }

  // Vérifier que l'utilisateur est participant de la conversation
  const { data: participant, error: participantError } = await supabase
    .from('conversation_participants')
    .select('id')
    .eq('conversation_id', id)
    .eq('user_id', userId)
    .single();

  if (participantError || !participant) {
    throw createError('Accès non autorisé à cette conversation', 403, 'FORBIDDEN');
  }

  const { data: message, error } = await supabase
    .from('messages')
    .insert([{
      conversation_id: id,
      sender_id: userId,
      content,
      message_type,
      file_url,
      file_name,
      file_size,
      reply_to_id
    }])
    .select(`
      *,
      users (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .single();

  if (error) {
    throw createError('Erreur lors de l\'envoi du message', 500, 'SEND_ERROR');
  }

  // Mettre à jour la date de modification de la conversation
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', id);

  res.status(201).json({
    success: true,
    message
  });
}));

// Marquer les messages comme lus
router.put('/conversations/:id/read', requirePermission('chat.view'), asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  // Vérifier que l'utilisateur est participant de la conversation
  const { data: participant, error: participantError } = await supabase
    .from('conversation_participants')
    .select('id')
    .eq('conversation_id', id)
    .eq('user_id', userId)
    .single();

  if (participantError || !participant) {
    throw createError('Accès non autorisé à cette conversation', 403, 'FORBIDDEN');
  }

  // Ici, on pourrait implémenter une logique de marquage des messages comme lus
  // Pour l'instant, on retourne juste un succès

  res.json({
    success: true,
    message: 'Messages marqués comme lus'
  });
}));

export default router;
