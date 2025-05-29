#!/usr/bin/env node

const { Command } = require('commander');
const { initCommand } = require('../src/init.js');
const { installCommand } = require('../src/install.js');
const { buildCommand } = require('../src/build.js');
const { prebuildCommand } = require('../src/prebuild.js');
const { helpCommand } = require('../src/help.js');
const { addCommand } = require('../src/add.js');
const { runCommand } = require('../src/run.js');

const program = new Command();

const args = process.argv.slice(2);
if (args[0] === 'help') {
  const { helpCommand } = require('../src/help.js');
  helpCommand(args.slice(1));
  process.exit(0);
}

program.parse();

program
  .name('gmi')
  .description('CLI para desarrollo de videojuegos con Gamo')
  .version('1.0.0');

program
  .command('init')
  .option('-y', 'Usar configuración por defecto')
  .action(initCommand);

program
  .command('install <packages...>')
  .description('Instala paquetes simulados')
  .action(installCommand);

program
  .command('build')
  .description('Genera el ejecutable del juego en modo producción')
  .action(buildCommand);

program
  .command('run')
  .argument('<target>', 'Nombre del script a ejecutar (ej: package)')
  .description('Ejecuta un script definido en un archivo .gmi')
  .action((target) => {
    if (target === 'package') runCommand();
    else {
      console.error(`❌ Script '${target}' no reconocido. Actualmente solo se soporta 'package'.`);
      process.exit(1);
    }
  });

program
  .command('prebuild')
  .description('Genera una build de desarrollo con archivos de debug')
  .action(prebuildCommand);

program
  .command('help')
  .description('Muestra ayuda general o de un comando específico.')
  .action(helpCommand);

program
  .command('add')
  .argument('<type>', 'Tipo de recurso a crear (scene, audio, sound, art, ui, dialog, lang, etc.)')
  .argument('<name>', 'Nombre del recurso')
  .argument('[optionalType]', 'Tipo extra en caso de art (character, skin, etc.)')
  .description('Crea un nuevo archivo base del tipo especificado')
  .action(addCommand);

program.parse();