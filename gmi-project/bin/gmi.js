#!/usr/bin/env node

const { Command } = require('commander');
const { initCommand } = require('../src/init.js');
const { installCommand } = require('../src/install.js');
const { buildCommand } = require('../src/build.js');
const { prebuildCommand } = require('../src/prebuild.js');

const program = new Command();

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
  .command('prebuild')
  .description('Genera una build de desarrollo con archivos de debug')
  .action(prebuildCommand);

program.parse();