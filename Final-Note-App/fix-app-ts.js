const fs = require('fs');

// Read the app.ts file
const appTsPath = '/app/src/app.ts';
let appTs = fs.readFileSync(appTsPath, 'utf8');

// Add the search_routes import
if (!appTs.includes('import searchRoutes from')) {
  appTs = appTs.replace(
    'import uploadRoutes from \'./routes/upload.routes\';', 
    'import uploadRoutes from \'./routes/upload.routes\';\nimport searchRoutes from \'./routes/search.routes\';'
  );
}

// Ensure search route handler uses the imported searchRoutes
appTs = appTs.replace(
  'app.get(\'/api/notes/search\'', 
  '// Modified search handler'
);

// Add search routes to app use statements
if (!appTs.includes('app.use(\'/api/notes/search') && !appTs.includes('app.use(\'/notes/search') ) {
  appTs = appTs.replace(
    'app.use(\'/api/uploads\', uploadRoutes);', 
    'app.use(\'/api/uploads\', uploadRoutes);\napp.use(\'/api/notes/search\', searchRoutes);'
  );

  appTs = appTs.replace(
    'app.use(\'/uploads\', uploadRoutes);', 
    'app.use(\'/uploads\', uploadRoutes);\napp.use(\'/notes/search\', searchRoutes);'
  );
}

// Fix CORS for ngrok domains
if (!appTs.includes('process.env.ALLOWED_ORIGINS')) {
  // Replace the CORS configuration
  const corsRegex = /app\.use\(cors\(\{\s*origin:\s*process\.env\.CLIENT_URL\s*\|\|\s*'http:\/\/localhost:3000',\s*credentials:\s*true\s*\}\)\);/;
  
  const newCorsConfig = `app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || 'http://localhost:3000').split(',');
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    
    // Check if the origin is in our allowlist
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        // Handle wildcard domains like *.example.com
        const wildCardPart = allowedOrigin.split('*').filter(Boolean);
        return wildCardPart.every(part => origin.includes(part));
      }
      return origin === allowedOrigin;
    });
    
    if(isAllowed) {
      callback(null, true);
    } else {
      console.warn(\`CORS blocked request from origin: \${origin}\`);
      callback(new Error(\`Origin \${origin} not allowed by CORS\`));
    }
  },
  credentials: true
}));`;
  
  appTs = appTs.replace(corsRegex, newCorsConfig);
}

fs.writeFileSync(appTsPath, appTs);
console.log('Fixed app.ts'); 
