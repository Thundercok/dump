import { LabelModel } from '../../models/label.model';
import { GraphQLError } from 'graphql';
import { Context } from '../context';

interface LabelInput {
  name: string;
}

export const labelResolvers = {
  Query: {
    // Get a single label by ID
    label: async (_: any, { id }: { id: string }, { req }: Context) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        
        const label = await LabelModel.findById(parseInt(id));
        
        // Check if label exists and belongs to the user
        if (!label || label.ownerId !== userId) {
          throw new GraphQLError('Label not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        
        return label;
      } catch (error) {
        console.error('Error fetching label:', error);
        throw error;
      }
    },
    
    // Get all labels for the current user
    labels: async (_: any, __: any, { req }: Context) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        
        return await LabelModel.findByOwnerId(userId);
      } catch (error) {
        console.error('Error fetching labels:', error);
        throw error;
      }
    },
    
    // Get all labels for a specific note
    noteLabels: async (_: any, { noteId }: { noteId: string }, { req }: Context) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        
        return await LabelModel.getLabelsForNote(parseInt(noteId));
      } catch (error) {
        console.error('Error fetching note labels:', error);
        throw error;
      }
    }
  },
  
  Mutation: {
    // Create a new label
    createLabel: async (_: any, { input }: { input: LabelInput }, { req }: Context) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        
        return await LabelModel.create(input.name, userId);
      } catch (error) {
        console.error('Error creating label:', error);
        throw error;
      }
    },
    
    // Update an existing label
    updateLabel: async (_: any, { id, input }: { id: string, input: LabelInput }, { req }: Context) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        
        // Check if label exists and belongs to the user
        const label = await LabelModel.findById(parseInt(id));
        if (!label || label.ownerId !== userId) {
          throw new GraphQLError('Label not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        
        return await LabelModel.update(parseInt(id), input.name);
      } catch (error) {
        console.error('Error updating label:', error);
        throw error;
      }
    },
    
    // Delete a label
    deleteLabel: async (_: any, { id }: { id: string }, { req }: Context) => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }
        
        // Check if label exists and belongs to the user
        const label = await LabelModel.findById(parseInt(id));
        if (!label || label.ownerId !== userId) {
          throw new GraphQLError('Label not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        
        return await LabelModel.delete(parseInt(id));
      } catch (error) {
        console.error('Error deleting label:', error);
        throw error;
      }
    }
  }
}; 
