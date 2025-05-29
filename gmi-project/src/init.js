const fs = require('fs');
const path = require('path');

function initCommand(options) {
  if (!options.y) {
    console.log("❌ Falta la opción -y. Usala para crear el proyecto automáticamente.");
    return;
  }

  const basePath = process.cwd();

  // Crear carpetas
  const folders = ['src', 'const', 'assets', 'gmi_modules'];
  folders.forEach(folder => {
    fs.mkdirSync(path.join(basePath, folder), { recursive: true });
  });

  // Crear src/main.gamo
  fs.writeFileSync(path.join(basePath, 'src', 'main.gamo'), `// Entrada principal del juego
scene "Intro" {
  show_logo()
  wait(3)
  go_to("MainMenu")
}
`);

  // Crear const/settings.cfg
  fs.writeFileSync(path.join(basePath, 'const', 'settings.cfg'), `Fullscreen=false
VSync=true
MaxFPS=60
`);

  // Crear const/audio.cfg
  fs.writeFileSync(path.join(basePath, 'const', 'audio.cfg'), `MasterVolume=1.0
MusicVolume=0.8
SfxVolume=0.9
`);

  // Crear game.json
  fs.writeFileSync(path.join(basePath, 'game.json'), JSON.stringify({
    id: "com.ejemplo.juego",
    name: "Nuevo Juego",
    version: "0.1.0",
    logo: "./assets/logo.png",
    splash: {
      image: "./assets/splash.gif",
      duration: 3,
      bgColor: "#000000"
    },
    window: {
      width: 1280,
      height: 720,
      fullscreen: false,
      vsync: true,
      fpsLimit: 60
    },
    dependencies: {}
  }, null, 2));

  // Crear .gamo-config
  fs.writeFileSync(path.join(basePath, '.gamo-config'), JSON.stringify({
    entry: "src/main.gamo",
    output: "dist",
    typeChecking: true,
    debugOverlay: true
  }, null, 2));

  console.log("✅ Proyecto Gamo creado con éxito.");
}

module.exports = { initCommand };