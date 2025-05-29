const fs = require('fs');
const path = require('path');

function installCommand(packages) {
  const gmiModulesPath = path.join(process.cwd(), 'gmi_modules');
  const gameConfigPath = path.join(process.cwd(), 'game.json');

  if (!fs.existsSync(gmiModulesPath)) fs.mkdirSync(gmiModulesPath);

  let gameConfig = {};
  try {
    gameConfig = JSON.parse(fs.readFileSync(gameConfigPath, 'utf-8'));
  } catch (e) {
    console.error("❌ No se pudo leer game.json.");
    return;
  }

  packages.forEach(pkg => {
    const pkgPath = path.join(gmiModulesPath, `${pkg}.gmi.js`);
    fs.writeFileSync(pkgPath, `// ${pkg} instalado`);
    gameConfig.dependencies[pkg] = "^1.0.0";
    console.log(`✅ Paquete "${pkg}" instalado.`);
  });

  fs.writeFileSync(gameConfigPath, JSON.stringify(gameConfig, null, 2));
}

module.exports = { installCommand };
