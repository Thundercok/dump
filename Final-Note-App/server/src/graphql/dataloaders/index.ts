import DataLoader from 'dataloader';
import { LabelModel } from '../../models/label.model';
import { NoteModel } from '../../models/note.model';
import { Label, Note } from '../../types';

// Create a data loader for labels by note ID
export const createNoteLabelsLoader = () => {
  return new DataLoader<number, Label[]>(async (noteIds) => {
    try {
      // Get all labels for each note ID in batch
      const labelsForNotes = await Promise.all(
        noteIds.map(noteId => LabelModel.getLabelsForNote(noteId))
      );
      
      return labelsForNotes;
    } catch (error) {
      console.error('Error loading labels for notes:', error);
      return noteIds.map(() => []);
    }
  });
};

// Create a data loader for notes by ID
export const createNoteLoader = () => {
  return new DataLoader<number, Note | null>(async (noteIds) => {
    try {
      // Get all notes by ID in batch
      const notes = await Promise.all(
        noteIds.map(async (noteId) => {
          try {
            return await NoteModel.findById(noteId);
          } catch (error) {
            return null;
          }
        })
      );
      
      return notes;
    } catch (error) {
      console.error('Error loading notes by ID:', error);
      return noteIds.map(() => null);
    }
  });
};

// Create a data loader for labels by ID
export const createLabelLoader = () => {
  return new DataLoader<number, Label | null>(async (labelIds) => {
    try {
      // Get all labels by ID in batch
      const labels = await Promise.all(
        labelIds.map(async (labelId) => {
          try {
            return await LabelModel.findById(labelId);
          } catch (error) {
            return null;
          }
        })
      );
      
      return labels;
    } catch (error) {
      console.error('Error loading labels by ID:', error);
      return labelIds.map(() => null);
    }
  });
};

// Create a function to initialize all data loaders
export const createLoaders = () => {
  return {
    noteLabelsLoader: createNoteLabelsLoader(),
    noteLoader: createNoteLoader(),
    labelLoader: createLabelLoader()
  };
}; 
