const fs = require('fs');
const path = require('path');

function installCommand(packages) {
  const nodeModulesPath = path.join(process.cwd(), 'node_modules_gmi');
  const gameConfigPath = path.join(process.cwd(), 'game.json');

  if (!fs.existsSync(nodeModulesPath)) fs.mkdirSync(nodeModulesPath);

  let gameConfig = {};
  try {
    gameConfig = JSON.parse(fs.readFileSync(gameConfigPath, 'utf-8'));
  } catch (e) {
    console.error("❌ No se pudo leer game.json.");
    return;
  }

  packages.forEach(pkg => {
    const pkgPath = path.join(nodeModulesPath, `${pkg}.gmi.js`);
    fs.writeFileSync(pkgPath, `// ${pkg} instalado`);
    gameConfig.dependencies[pkg] = "^1.0.0";
    console.log(`✅ Paquete "${pkg}" instalado.`);
  });

  fs.writeFileSync(gameConfigPath, JSON.stringify(gameConfig, null, 2));
}

module.exports = { installCommand };
