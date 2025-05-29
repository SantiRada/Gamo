const helpTexts = {
  general: `
Uso: gmi <comando> [opciones]

Comandos disponibles:
  init        Crea un nuevo proyecto Gamo
  build       Compila el juego para distribución
  run         Ejecuta el juego en modo desarrollo
  install     Instala dependencias Gamo
  uninstall   Elimina una dependencia instalada
  add         Crea nuevos archivos base (scene, script, dialog)
  version     Muestra la versión actual de GMI
  help        Muestra ayuda general o específica de un comando

Para ayuda específica:
  gmi help <comando>
`,

  init: `
gmi init [-y]

Crea un nuevo proyecto Gamo en la carpeta actual.

Opciones:
  -y      Omite las preguntas interactivas y usa valores por defecto

Ejemplos:
  gmi init       (modo interactivo)
  gmi init -y    (modo automático)
`,

  build: `
gmi build [--release]

Compila el juego a un ejecutable. Por defecto genera en modo debug.

Opciones:
  --release    Genera una versión optimizada para distribución

Ejemplos:
  gmi build
  gmi build --release
`,

  run: `
gmi run

Ejecuta el juego en modo desarrollo con recarga en caliente.
`,

  install: `
gmi install <paquete>

Instala una dependencia oficial del ecosistema Gamo.

Ejemplos:
  gmi install particles
`,

  uninstall: `
gmi uninstall <paquete>

Elimina una dependencia previamente instalada.

Ejemplo:
  gmi uninstall particles
`,

  add: `
gmi add <tipo> <nombre>

Crea un archivo base según el tipo especificado.

Tipos válidos:
  scene       Crea un archivo .scene.gamo
  script      Crea un archivo .script.gamo
  dialog      Crea un archivo .dialog.gamo

Ejemplo:
  gmi add script PlayerController
`,

  version: `
gmi version

Muestra la versión actual del CLI GMI.
`,

  help: `
gmi help [comando]

Muestra ayuda general o detallada sobre un comando específico.
`
};

function helpCommand(args) {
  const command = args[0]?.toLowerCase();
  if (command && helpTexts[command]) {
    console.log(helpTexts[command]);
  } else {
    console.log(helpTexts.general);
  }
}

module.exports = { helpCommand };
