// parsers/gamoParser.js
import { parse } from 'acorn';
import * as walk from 'acorn-walk';
import fs from 'fs';

/** Preprocesador de sintaxis personalizada de Gamo */
function preprocessGamoCode(source) {
  return source.replace(
    /scene\s+"([a-zA-Z0-9_]+)"\s*{/g,
    'export const __scene = { name: "$1",'
  );
}

export function parseGamo(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const preprocessed = preprocessGamoCode(code);

  const ast = parse(code, {
    ecmaVersion: 2020,
    sourceType: 'module',
    locations: true
  });

  const errores = [];

  walk.simple(ast, {
    Identifier(node) {
      if (node.name === 'eval') {
        errores.push({ msg: "Uso de 'eval' no permitido", line: node.loc.start.line });
      }
    },
    MemberExpression(node) {
      if (node.object?.name === 'console') {
        errores.push({ msg: "Uso de 'console' no permitido", line: node.loc.start.line });
      }
    },
    AwaitExpression(node) {
      errores.push({ msg: "Uso de 'await' no permitido en Gamo", line: node.loc.start.line });
    },
    NewExpression(node) {
      if (node.callee.name === 'Promise') {
        errores.push({ msg: "Uso de 'Promise' no permitido", line: node.loc.start.line });
      }
    }
  });

  if (errores.length) {
    throw new Error("Errores de sintaxis:\n" + errores.map(e => `❌ Línea ${e.line}: ${e.msg}`).join('\n'));
  }

  return ast;
}
