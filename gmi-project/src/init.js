const fs = require('fs');
const path = require('path');
const readline = require('readline');

function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function validatedPrompt(question, validator, defaultValue) {
  while (true) {
    const input = await prompt(`${question}${defaultValue ? ` (${defaultValue})` : ''}: `);
    const value = input || defaultValue;
    if (validator(value)) return value;
    console.log("❌ Entrada inválida. Intentá de nuevo.");
  }
}

function initCommand(options) {
  if (options.y) {
    return createProject({
      id: "con.startup.game",
      name: "Nuevo Juego",
      version: "0.1.0",
      fullscreen: false,
      fpsLimit: 60
    });
  }

  (async () => {
    console.log("⚙️ Modo interactivo iniciado para crear el proyecto Gamo.\n(Dejá vacío para usar los valores por defecto)");

    const id = await validatedPrompt("1. ID del proyecto", v => /^com\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/.test(v), "con.startup.game");
    const name = await validatedPrompt("2. Nombre del proyecto", v => /^[a-zA-Z0-9\s]+$/.test(v), "Nuevo Juego");
    const version = await validatedPrompt("3. Versión inicial", v => /^\d+\.\d+(\.\d+)?$/.test(v), "0.1.0");
    const fullscreenInput = await validatedPrompt("4. Inicia en Fullscreen [s/N]", v => /^[sSnN]$/.test(v), "n");
    const fullscreen = fullscreenInput.toLowerCase() === 's';

    const fps = await validatedPrompt("5. Límite de FPS", v => /^(10|20|30|60|120)$/.test(v), "60");

    createProject({
      id,
      name,
      version,
      fullscreen,
      fpsLimit: parseInt(fps)
    });
  })();
}

function createProject(data) {
  const basePath = process.cwd();

  const folders = ['src', 'const', 'assets', 'gmi_modules'];
  folders.forEach(folder => {
    fs.mkdirSync(path.join(basePath, folder), { recursive: true });
  });

  fs.writeFileSync(path.join(basePath, 'src', 'main.gamo'), `// Entrada principal del juego
scene "Intro" {
  show_logo()
  wait(3)
  go_to("MainMenu")
}
`);

  fs.writeFileSync(path.join(basePath, 'const', 'settings.cfg'), `Fullscreen=${data.fullscreen}
VSync=true
MaxFPS=${data.fpsLimit}
`);

  fs.writeFileSync(path.join(basePath, 'const', 'audio.cfg'), `MasterVolume=1.0
MusicVolume=0.8
SfxVolume=0.9
`);

  fs.writeFileSync(path.join(basePath, 'game.json'), JSON.stringify({
    id: data.id,
    name: data.name,
    version: data.version,
    logo: "./assets/logo.png",
    splash: {
      image: "./assets/splash.gif",
      duration: 3,
      bgColor: "#000000"
    },
    window: {
      width: 1280,
      height: 720,
      fullscreen: data.fullscreen,
      vsync: true,
      fpsLimit: data.fpsLimit
    },
    dependencies: {}
  }, null, 2));

  fs.writeFileSync(path.join(basePath, '.gamo-config'), JSON.stringify({
    entry: "src/main.gamo",
    output: "dist",
    typeChecking: true,
    debugOverlay: true
  }, null, 2));

  console.log("✅ Proyecto Gamo creado con éxito.");
}

module.exports = { initCommand };
