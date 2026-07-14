const fs = require("fs");
const path = require("path");
const baseDir = "c:\\Users\\Renzo.Zurita.NWSN\\Documents\\Projectos-Newsan\\spp-vite\\SPP.Api\\ClientApp\\src";
const ticketsDir = path.join(baseDir, "app", "features", "tickets");
const externalFiles = [
  path.join(baseDir, "app", "Middleware", "reducers", "EmailSlice.tsx"),
  path.join(baseDir, "app", "routers", "CliRouter.tsx"),
  path.join(baseDir, "app", "services", "Email.Service.tsx"),
  path.join(
    baseDir,
    "app",
    "shared",
    "Pages",
    "ingenieria",
    "dotacionMantenimiento",
    "modals",
    "DotacionModals",
    "CrearNuevaDotacionModal.tsx"
  )
];
function getAllFiles(dir, filesList = []) {
  if (!fs.existsSync(dir)) return filesList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getAllFiles(name, filesList);
    } else {
      if (name.endsWith(".ts") || name.endsWith(".tsx")) {
        filesList.push(name);
      }
    }
  }
  return filesList;
}
const allFiles = [...getAllFiles(ticketsDir), ...externalFiles];
console.log(`Encontrados ${allFiles.length} archivos para analizar.`);
let modifiedCount = 0;
for (const file of allFiles) {
  if (!fs.existsSync(file)) {
    console.warn(`Archivo no encontrado: ${file}`);
    continue;
  }
  let content = fs.readFileSync(file, "utf8");
  let originalContent = content;
  // 1. Reemplazar imports absolutos a app/shared/Pages/cli/
  content = content.replace(/(["'])app\/shared\/Pages\/cli\//g, "$1app/features/cli/");
  content = content.replace(/(["'])@app\/shared\/Pages\/cli\//g, "$1app/features/cli/");
  // 2. Reemplazar imports relativos rotos que suben y buscan en shared/Pages/cli/
  // Ejemplo: "../../shared/Pages/cli/models/..." -> "app/features/cli/models/..."
  content = content.replace(/(["'])(\.\.\/)+shared\/Pages\/cli\//g, "$1app/features/cli/");
  // 3. Reemplazar imports relativos que suben y buscan en features/cli/ (ej. en subcarpetas de cli)
  // Ejemplo: "../../../../features/tickets/reducers/..." -> "app/features/tickets/reducers/..."
  content = content.replace(/(["'])(\.\.\/)+features\/cli\//g, "$1app/features/cli/");
  // Si hubo cambios, guardar
  if (content !== originalContent) {
    fs.writeFileSync(file, content, "utf8");
    console.log(`Corregido: ${path.relative(baseDir, file)}`);
    modifiedCount++;
  }
}
console.log(`Proceso terminado. Se modificaron ${modifiedCount} archivos.`);
