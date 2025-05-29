const fs = require('fs');
const path = require('path');

function prebuildCommand() {
  const cwd = process.cwd();
  const distPath = path.join(cwd, 'dist-dev');

  if (!fs.existsSync('game.json')) {
    console.error("❌ No se encontró game.json. ¿Estás en un proyecto válido?");
    return;
  }

  const gameData = JSON.parse(fs.readFileSync('game.json', 'utf-8'));
  const gameName = (gameData.name || 'Juego').replace(/\s+/g, '');

  // Crear carpeta dist-dev
  fs.mkdirSync(distPath, { recursive: true });

  // Ejecutable de desarrollo
  fs.writeFileSync(path.join(distPath, `${gameName}.exe`), `// [DEBUG] Simulación ejecutable de ${gameName}`);

  // Copiar game.json
  fs.copyFileSync('game.json', path.join(distPath, 'game.json'));

  // Crear carpeta gamo-runtime (simulada)
  fs.mkdirSync(path.join(distPath, 'gamo-runtime'), { recursive: true });
  fs.writeFileSync(path.join(distPath, 'gamo-runtime', 'runtime-dev.dll'), '// Motor Gamo modo DEBUG');

  // Copiar assets
  const assetsSrc = path.join(cwd, 'assets');
  const assetsDst = path.join(distPath, 'assets');
  if (fs.existsSync(assetsSrc)) {
    fs.mkdirSync(assetsDst, { recursive: true });
    fs.readdirSync(assetsSrc).forEach(file => {
      fs.copyFileSync(path.join(assetsSrc, file), path.join(assetsDst, file));
    });
  }

  // Agregar archivos de desarrollo
  fs.writeFileSync(path.join(distPath, 'dev.log'), 'LOG DE DEBUG: arranque correcto.\n');
  fs.writeFileSync(path.join(distPath, '.dev-mode'), 'true');

  console.log(`✅ Prebuild completo. Ejecutable en modo debug disponible en dist-dev/${gameName}.exe`);
}

module.exports = { prebuildCommand };
