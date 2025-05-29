const fs = require('fs');
const path = require('path');

function buildCommand() {
  const cwd = process.cwd();
  const distPath = path.join(cwd, 'dist');

  if (!fs.existsSync('game.json')) {
    console.error("❌ No se encontró game.json. Asegurate de estar en un proyecto válido.");
    return;
  }

  // Leer el nombre del juego desde game.json
  const gameData = JSON.parse(fs.readFileSync('game.json', 'utf-8'));
  const gameName = gameData.name?.replace(/\s+/g, '') || 'Juego';

  // Crear carpeta dist
  fs.mkdirSync(distPath, { recursive: true });

  // Crear ejecutable simulado
  fs.writeFileSync(path.join(distPath, `${gameName}.exe`), `// Simulador de juego ejecutable para ${gameName}`);

  // Copiar game.json
  fs.copyFileSync('game.json', path.join(distPath, 'game.json'));

  // Simular motor de ejecución
  fs.mkdirSync(path.join(distPath, 'gamo-runtime'), { recursive: true });
  fs.writeFileSync(path.join(distPath, 'gamo-runtime', 'runtime.dll'), '// Simulador de motor Gamo');

  // Copiar carpeta assets si existe
  const assetsSrc = path.join(cwd, 'assets');
  const assetsDst = path.join(distPath, 'assets');
  if (fs.existsSync(assetsSrc)) {
    fs.mkdirSync(assetsDst, { recursive: true });
    const files = fs.readdirSync(assetsSrc);
    files.forEach(file => {
      fs.copyFileSync(path.join(assetsSrc, file), path.join(assetsDst, file));
    });
  }

  console.log(`✅ Build exitoso. Ejecutable disponible en dist/${gameName}.exe`);
}

module.exports = { buildCommand };
