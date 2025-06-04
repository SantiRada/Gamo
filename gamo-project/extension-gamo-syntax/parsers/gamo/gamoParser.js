import { parse } from 'acorn';
import * as walk from 'acorn-walk';

/** 🔧 Preprocesador de sintaxis personalizada de Gamo */
export function preprocessGamoCode(source) {
  // Eliminar importaciones de "scene"
  source = source.replace(/^import\s+scene\s+from\s+.*;\s*$/gm, '');

  // Reemplazar declaraciones scene Nombre() {
  source = source.replace(
    /scene\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(\)\s*{/g,
    'export const __scene = { name: "$1", body: () => {'
  );

  // Cierre automático del bloque scene
  source = source.replace(/^\s*}\s*$/gm, '}}');

  return source;
}

/** 🧠 Parser principal que analiza texto fuente de un archivo .gamo */
export function parseGamoFromText(sourceText) {
  const preprocessed = preprocessGamoCode(sourceText);

  const ast = parse(preprocessed, {
    ecmaVersion: 2020,
    sourceType: 'module',
    locations: true
  });

  const errores = [];
  const result = {
    imports: [],
    functions: [],
    scenes: []
  };

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
    },
    ImportDeclaration(node) {
      result.imports.push({
        alias: node.specifiers[0]?.local?.name || null,
        path: node.source.value
      });
    },
    FunctionDeclaration(node) {
      result.functions.push({
        name: node.id.name,
        body: node.body.body.map(stmt => {
          if (
            stmt.type === 'ExpressionStatement' &&
            stmt.expression.type === 'CallExpression'
          ) {
            return {
              type: 'call',
              name: stmt.expression.callee.name,
              args: stmt.expression.arguments.map(arg => arg.name)
            };
          }
        }).filter(Boolean)
      });
    },
    VariableDeclaration(node) {
      for (const decl of node.declarations) {
        if (
          decl.id.name === '__scene' &&
          decl.init?.type === 'ObjectExpression'
        ) {
          const scene = { name: '', body: [] };

          for (const prop of decl.init.properties) {
            if (prop.key.name === 'name' && prop.value.type === 'Literal') {
              scene.name = prop.value.value;
            }

            if (
              prop.key.name === 'body' &&
              prop.value.type === 'ArrowFunctionExpression'
            ) {
              const block = prop.value.body;
              if (block.type === 'BlockStatement') {
                for (const stmt of block.body) {
                  if (
                    stmt.type === 'ExpressionStatement' &&
                    stmt.expression.type === 'CallExpression'
                  ) {
                    const call = stmt.expression;
                    scene.body.push({
                      type: 'call',
                      name: call.callee.name,
                      args: call.arguments.map(arg => arg.name)
                    });
                  }
                }
              }
            }
          }

          result.scenes.push(scene);
        }
      }
    }
  });

  if (errores.length) {
    const mensaje = errores.map(e => `❌ Línea ${e.line}: ${e.msg}`).join('\n');
    const error = new Error(mensaje);
    error.details = errores;
    throw error;
  }

  return result;
}