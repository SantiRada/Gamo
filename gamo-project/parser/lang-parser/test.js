const fs = require('fs');
const parser = require('./lang.gamo.js');

// Leé un archivo .dialog.gamo
const source = fs.readFileSync('./example.lang', 'utf8');

try {
    const result = parser.parse(source);
    console.log('✅ PARSEADO CORRECTAMENTE:\n');
    console.log(JSON.stringify(result, null, 2));
} catch (err) {
    console.error('❌ ERROR DE PARSEO:\n');
    console.error(err.message);
}
