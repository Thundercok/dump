const fs = require('fs');
const path = require('path');

// List of pages that import Header
const pageFiles = [
  'client/src/pages/VerifyEmail.js',
  'client/src/pages/Trash.js',
  'client/src/pages/SharedNotes.jsx',
  'client/src/pages/AccountManagement.js',
  'client/src/pages/ResetPassword.js',
  'client/src/pages/Settings.js',
  'client/src/pages/Login.js',
  'client/src/pages/ForgotPassword.js',
  'client/src/pages/Register.js',
  'client/src/pages/SharedNotes.js',
  'client/src/pages/Profile.js',
  'client/src/pages/NotFound.js'
];

pageFiles.forEach(filePath => {
  try {
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Remove the import statement
    let newContent = content.replace(/import\s+Header\s+from\s+['"]\.\.\/components\/Header['"];?\n?/g, '');
    
    // Remove Header usage - this pattern may need adjustments based on how Header is used in each file
    newContent = newContent.replace(/<Header[^\/]*\/>/g, '');
    newContent = newContent.replace(/<Header[^>]*>[^<]*<\/Header>/g, '');
    
    // Write the file back
    fs.writeFileSync(filePath, newContent);
    console.log(`Removed Header from ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
});

console.log('Header removal complete'); 
