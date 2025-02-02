import { gql } from 'apollo-server-express';

// Define GraphQL schema using SDL (Schema Definition Language)
export const typeDefs = gql`
  # Custom scalar for file uploads
  scalar Upload

  # Note type definition
  type Note {
    id: ID!
    userId: ID!
    title: String!
    content: String
    isPinned: Boolean!
    isPasswordProtected: Boolean
    createdAt: String!
    updatedAt: String!
    labels: [Label]
    collaborators: [NoteCollaborator]
  }

  # Label type definition
  type Label {
    id: ID!
    name: String!
    ownerId: ID!
    createdAt: String!
    updatedAt: String!
  }

  # Note collaborator type
  type NoteCollaborator {
    userId: ID!
    email: String!
    displayName: String!
    role: String!
  }

  # Input types for creating and updating
  input CreateNoteInput {
    title: String!
    content: String
    isPinned: Boolean
    password: String
  }

  input UpdateNoteInput {
    title: String
    content: String
    isPinned: Boolean
    password: String
  }

  input CreateLabelInput {
    name: String!
  }

  input UpdateLabelInput {
    name: String!
  }

  # File upload types
  scalar Upload
  
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
    url: String!
  }

  # Query type - defines all available queries
  type Query {
    # Note queries
    note(id: ID!): Note
    notes(labelId: ID): [Note!]!
    searchNotes(query: String!): [Note!]!
    
    # Label queries
    label(id: ID!): Label
    labels: [Label!]!
    noteLabels(noteId: ID!): [Label!]!
  }

  # Mutation type - defines all available mutations
  type Mutation {
    # Note mutations
    createNote(input: CreateNoteInput!): Note!
    updateNote(id: ID!, input: UpdateNoteInput!): Note!
    deleteNote(id: ID!): Boolean!
    pinNote(id: ID!, pin: Boolean!): Note!
    setNotePassword(id: ID!, password: String): Note!
    verifyNotePassword(id: ID!, password: String!): Boolean!
    
    # Label mutations
    createLabel(input: CreateLabelInput!): Label!
    updateLabel(id: ID!, input: UpdateLabelInput!): Label!
    deleteLabel(id: ID!): Boolean!
    
    # Note-Label relationship mutations
    addLabelToNote(noteId: ID!, labelId: ID!): Note!
    removeLabelFromNote(noteId: ID!, labelId: ID!): Note!
    
    # Note collaboration mutations
    addCollaborator(noteId: ID!, email: String!, role: String!): Note!
    removeCollaborator(noteId: ID!, userId: ID!): Note!
    
    # File upload mutations
    uploadNoteImages(noteId: ID!, files: [Upload!]!): Note!
  }
`; 
