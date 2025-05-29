export function transformGamoAST(ast) {
  const result = {
    imports: [],
    functions: []
  };

  for (const node of ast.body) {
    if (node.type === 'ImportDeclaration') {
      const alias = node.specifiers[0]?.local?.name;
      const path = node.source.value;
      result.imports.push({ alias, path });
    }

    if (node.type === 'FunctionDeclaration') {
      const func = {
        name: node.id.name,
        body: []
      };

      for (const stmt of node.body.body) {
        if (stmt.type === 'ExpressionStatement' && stmt.expression.type === 'CallExpression') {
          func.body.push({
            type: 'call',
            name: stmt.expression.callee.name,
            args: stmt.expression.arguments.map(arg => arg.name)
          });
        }
      }

      result.functions.push(func);
    }
  }

  return result;
}