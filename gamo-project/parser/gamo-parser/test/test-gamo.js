import { parseGamo } from '../parsers/gamoParser.js';
import { transformGamoAST } from '../compiler/ast-to-gamo.js';

const parsed = parseGamo('./examples/example.gamo');
const transformed = transformGamoAST(parsed);

console.log('✅ AST transformado:');
console.dir(transformed, { depth: null });
