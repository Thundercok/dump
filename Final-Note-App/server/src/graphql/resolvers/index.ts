import { noteResolvers } from './notes.resolver';
import { labelResolvers } from './labels.resolver';

// Combine resolvers
export const resolvers = {
  // GraphQL Upload scalar is handled by the graphql-upload package automatically
  
  // Merge Query resolvers
  Query: {
    ...noteResolvers.Query,
    ...labelResolvers.Query
  },
  
  // Merge Mutation resolvers
  Mutation: {
    ...noteResolvers.Mutation,
    ...labelResolvers.Mutation
  },
  
  // Type resolvers
  Note: noteResolvers.Note
}; 
