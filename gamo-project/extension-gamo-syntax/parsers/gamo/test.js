import { parseGamo } from './gamoParser.js';
import { transformGamoAST } from './compiler/ast-to-gamo.js';

const parsed = parseGamo('./example/example.gamo');
const transformed = transformGamoAST(parsed);

console.log('✅ AST transformado:');
console.dir(transformed, { depth: null });
