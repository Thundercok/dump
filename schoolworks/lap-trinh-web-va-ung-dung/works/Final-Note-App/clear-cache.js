const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Function to remove a directory recursively
function removeDir(dir) {
  if (fs.existsSync(dir)) {
    console.log(`Removing directory: ${dir}`);
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Directory removed: ${dir}`);
  } else {
    console.log(`Directory does not exist: ${dir}`);
  }
}

// Clear client build directories
console.log('Clearing client build cache...');
removeDir(path.join(__dirname, 'client', 'build'));
removeDir(path.join(__dirname, 'client', 'node_modules', '.cache'));

// Run npm commands to clear cache
console.log('Running npm cache clean...');
exec('npm cache clean --force', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Stdout: ${stdout}`);
  
  console.log('Cache cleaning complete!');
  console.log('\nTo completely fix the issue:');
  console.log('1. Run this script: node clear-cache.js');
  console.log('2. Rebuild the client: cd client && npm run build');
  console.log('3. Restart your application: docker-compose down && docker-compose up -d');
  console.log('4. Clear your browser cache completely or try in incognito mode');
}); 
