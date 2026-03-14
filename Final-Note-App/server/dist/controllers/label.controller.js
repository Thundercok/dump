"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelController = void 0;
const label_model_1 = require("../models/label.model");
class LabelController {
    static async list(req, res, next) {
        try {
            const labels = await label_model_1.LabelModel.findByOwnerId(req.user.id);
            res.json({ status: 'success', data: { labels } });
        }
        catch (err) {
            next(err);
        }
    }
    static async create(req, res, next) {
        try {
            const { name } = req.body;
            if (!name)
                return res.status(400).json({ status: 'error', message: 'Label name is required' });
            const label = await label_model_1.LabelModel.create(name, req.user.id);
            res.status(201).json({ status: 'success', data: { label } });
        }
        catch (err) {
            next(err);
        }
    }
    static async rename(req, res, next) {
        try {
            const { newName } = req.body;
            if (!newName)
                return res.status(400).json({ status: 'error', message: 'New label name is required' });
            const label = await label_model_1.LabelModel.findByNameAndOwnerId(req.params.label, req.user.id);
            if (!label)
                return res.status(404).json({ status: 'error', message: 'Label not found' });
            const updated = await label_model_1.LabelModel.update(label.id, newName);
            res.json({ status: 'success', data: { label: updated } });
        }
        catch (err) {
            next(err);
        }
    }
    static async delete(req, res, next) {
        try {
            const label = await label_model_1.LabelModel.findByNameAndOwnerId(req.params.label, req.user.id);
            if (!label)
                return res.status(404).json({ status: 'error', message: 'Label not found' });
            await label_model_1.LabelModel.delete(label.id);
            res.json({ status: 'success' });
        }
        catch (err) {
            next(err);
        }
    }
    static async attach(req, res, next) {
        try {
            const { labelId } = req.body;
            const noteId = Number(req.params.noteId);
            if (!labelId)
                return res.status(400).json({ status: 'error', message: 'Label ID is required' });
            await label_model_1.LabelModel.attachToNote(labelId, noteId, req.user.id);
            res.json({ status: 'success' });
        }
        catch (err) {
            next(err);
        }
    }
    static async detach(req, res, next) {
        try {
            const noteId = Number(req.params.noteId);
            const labelName = req.params.label;
            const label = await label_model_1.LabelModel.findByNameAndOwnerId(labelName, req.user.id);
            if (!label)
                return res.status(404).json({ status: 'error', message: 'Label not found' });
            await label_model_1.LabelModel.detachFromNote(label.id, noteId, req.user.id);
            res.json({ status: 'success' });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.LabelController = LabelController;
