
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Find the last <script> tag content
const lastScriptStart = htmlContent.lastIndexOf('<script>');
const lastScriptEnd = htmlContent.lastIndexOf('</script>');

if (lastScriptStart === -1 || lastScriptEnd === -1) {
    console.error('Could not find script tag');
    process.exit(1);
}

const jsContent = htmlContent.substring(lastScriptStart + '<script>'.length, lastScriptEnd);

// Add mock objects for browser globals to avoid ReferenceErrors during execution (though we only care about syntax)
const mockGlobals = `
const window = { location: { origin: '', pathname: '', search: '' }, onerror: null, supabaseClient: { auth: { getSession: () => Promise.resolve({ data: {} }), onAuthStateChange: () => {} } } };
const document = { getElementById: () => ({ addEventListener: () => {} }), querySelectorAll: () => [], addEventListener: () => {}, readyState: 'complete', CreateElement: () => ({}) };
const navigator = { clipboard: { writeText: () => Promise.resolve() } };
const Fuse = class { constructor() {} search() { return []; } };
const alert = () => {};
`;

// Write to temp file
const tempJsPath = path.join(__dirname, 'temp_debug.js');
fs.writeFileSync(tempJsPath, mockGlobals + jsContent);

console.log('Extracted JS to', tempJsPath);
console.log('Run: node --check ' + tempJsPath);
