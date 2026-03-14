const fs = require('fs');
const appJsPath = '/app/dist/app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Check if search_routes_1 is already defined
if (!appJs.includes('var search_routes_1 = require')) {
  // Add the missing import at the top
  appJs = appJs.replace(
    'var upload_routes_1 = require("./routes/upload.routes");', 
    'var upload_routes_1 = require("./routes/upload.routes");\nvar search_routes_1 = require("./routes/search.routes");'
  );
}

fs.writeFileSync(appJsPath, appJs);
console.log('Fixed app.js'); 
