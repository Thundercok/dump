import { Request, Response, NextFunction } from 'express';
import { LabelModel } from '../models/label.model';
import { NoteModel } from '../models/note.model';
import { AuthRequest } from '../types';

export class LabelController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const labels = await LabelModel.findByOwnerId(req.user!.id);
      res.json({ status: 'success', data: { labels } });
    } catch (err) { next(err); }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ status: 'error', message: 'Label name is required' });
      const label = await LabelModel.create(name, req.user!.id);
      res.status(201).json({ status: 'success', data: { label } });
    } catch (err) { next(err); }
  }

  static async rename(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { newName } = req.body;
      if (!newName) return res.status(400).json({ status: 'error', message: 'New label name is required' });
      const label = await LabelModel.findByNameAndOwnerId(req.params.label, req.user!.id);
      if (!label) return res.status(404).json({ status: 'error', message: 'Label not found' });
      const updated = await LabelModel.update(label.id, newName);
      res.json({ status: 'success', data: { label: updated } });
    } catch (err) { next(err); }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const label = await LabelModel.findByNameAndOwnerId(req.params.label, req.user!.id);
      if (!label) return res.status(404).json({ status: 'error', message: 'Label not found' });
      await LabelModel.delete(label.id);
      res.json({ status: 'success' });
    } catch (err) { next(err); }
  }

  static async attach(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { labelId } = req.body;
      const noteId = Number(req.params.noteId);
      if (!labelId) return res.status(400).json({ status: 'error', message: 'Label ID is required' });
      await LabelModel.attachToNote(labelId, noteId, req.user!.id);
      res.json({ status: 'success' });
    } catch (err) { next(err); }
  }

  static async detach(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const noteId = Number(req.params.noteId);
      const labelName = req.params.label;
      const label = await LabelModel.findByNameAndOwnerId(labelName, req.user!.id);
      if (!label) return res.status(404).json({ status: 'error', message: 'Label not found' });
      await LabelModel.detachFromNote(label.id, noteId, req.user!.id);
      res.json({ status: 'success' });
    } catch (err) { next(err); }
  }
}
