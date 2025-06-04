export function transformGamoAST(parsed) {
  const result = {
    imports: [],
    functions: [],
    scenes: []
  };

  // Copiar imports directamente
  result.imports = parsed.imports;

  // Copiar funciones si están presentes
  if (parsed.functions) {
    result.functions = parsed.functions;
  }

  // Copiar escenas si están presentes
  if (parsed.scenes) {
    result.scenes = parsed.scenes;
  }

  return result;
}