import { parseGamo } from '../parsers/gamoParser.js';
import { transformGamoAST } from '../compiler/ast-to-gamo.js';

const ast = parseGamo('./examples/example.gamo');
const json = transformGamoAST(ast);

console.log("✅ AST transformado:");
console.dir(json, { depth: null });
