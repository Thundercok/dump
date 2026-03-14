const fs = require('fs');
const path = require('path');

// Add the import and route to app.js
const appJsPath = '/app/dist/app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Add the import properly by finding all other imports first and adding ours after them
const importLines = appJs.split('\n').filter(line => line.includes('require(')).join('\n');
const lastImportIndex = appJs.lastIndexOf(importLines) + importLines.length;

// Split the file into parts, add our import, and rejoin
const beforeImports = appJs.substring(0, lastImportIndex);
const afterImports = appJs.substring(lastImportIndex);
appJs = beforeImports + '\nconst search_routes_1 = require("./routes/search.routes");\n' + afterImports;

// Add the route in the right place
appJs = appJs.replace(
  'app.use(\'/api/notes\', note_routes_1.default);',
  'app.use(\'/api/notes\', note_routes_1.default);\napp.use(\'/api/notes/search\', search_routes_1.default);'
);

fs.writeFileSync(appJsPath, appJs);
console.log('Updated app.js to use the search route');

// Create a backup just in case
fs.writeFileSync(appJsPath + '.bak', appJs);
console.log('Created backup of app.js');

console.log('Search endpoint fix complete. Restart the server to apply.'); 
