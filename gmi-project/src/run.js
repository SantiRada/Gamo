const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function runCommand() {
  const filePath = path.join(process.cwd(), "package.gmi");

  if (!fs.existsSync(filePath)) {
    console.error("❌ No se encontró el archivo package.gmi en la raíz del proyecto.");
    process.exit(1);
  }

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    console.error("❌ Error al parsear package.gmi: no es un JSON válido.");
    process.exit(1);
  }

  const lines = parsed.package;
  if (!Array.isArray(lines)) {
    console.error("❌ La propiedad 'package' debe ser un array de comandos.");
    process.exit(1);
  }

  const gmiExecutable = path.join(__dirname, "..", "bin", "gmi.js");

  console.log("📦 Ejecutando comandos del paquete...\n");

  for (const line of lines) {
    console.log(`▶️ ${line}`);
    const [cmd, ...args] = line.trim().split(" ");

    // Si el comando es "gmi", usar el ejecutable local
    const command = (cmd === "gmi") ? "node" : cmd;
    const finalArgs = (cmd === "gmi") ? [gmiExecutable, ...args] : args;

    const result = spawnSync(command, finalArgs, {
      stdio: "inherit",
      shell: true
    });

    if (result.error || result.status !== 0) {
      console.error(`❌ Error al ejecutar: ${line}`);
      process.exit(1);
    }
  }

  console.log("\n✅ Todos los comandos se ejecutaron correctamente.");
}

module.exports = { runCommand };
