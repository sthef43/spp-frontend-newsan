const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const srcDir = path.join(__dirname, 'src', 'app');
const files = walk(srcDir);

// Build map of filename to absolute path
const fileMap = {};
files.forEach(f => {
    const base = path.basename(f);
    if (!fileMap[base]) {
        fileMap[base] = [];
    }
    fileMap[base].push(f);
});

function getAppPath(absolutePath) {
    const relative = path.relative(path.join(__dirname, 'src'), absolutePath);
    return relative.replace(/\\/g, '/').replace(/\.tsx?$/, '');
}

console.log("DobHMaquinaSlice path: ", fileMap['DobHMaquinaSlice.tsx']);
console.log("DobHTipoUbicacionSlice path: ", fileMap['DobHTipoUbicacionSlice.tsx']);
console.log("ValidarQrLgSlice path: ", fileMap['ValidarQrLgSlice.tsx']);
console.log("AuthenticationSlice path: ", fileMap['AuthenticationSlice.tsx']);
console.log("Dashboard.Service path: ", fileMap['Dashboard.Service.tsx'] || fileMap['Dashboard.service.tsx'] || fileMap['Dashboard.service.ts'] || fileMap['Dashboard.Service.ts']);
console.log("pagina_en_mantenimiento path: ", fileMap['pagina_en_mantenimiento.json']);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Fix generic.service in ingenieria and programacionIndustrial
    if ((file.includes('ingenieria') || file.includes('programacionIndustrial')) && file.includes('services')) {
        content = content.replace(/import\s+\{\s*GenericService\s*\}\s+from\s+["']\.\.?\/[^"']*generic\.service["'];?/g, 'import { GenericService } from "app/services/generic.service";');
        content = content.replace(/this\.url/g, 'this.Url');
    }

    // Fix AuthenticationSlice in errorNotifications
    if (file.includes('errorNotifications')) {
        content = content.replace(/app\/features\/auth\/AuthenticationSlice/g, 'app/Middleware/reducers/AuthenticationSlice');
    }

    // Fix ValidarQrLgSlice
    if (file.includes('escanearQrLg') || file.includes('validarQrLg')) {
        content = content.replace(/app\/features\/trazabilidad\/slices\/ValidarQrLgSlice/g, 'app/Middleware/reducers/ValidarQrLgSlice');
    }

    // Fix DobHMaquinaSlice
    content = content.replace(/app\/Middleware\/reducers\/DobHMaquinaSlice/g, 'app/features/dobladora/middleware/DobHMaquinaSlice');

    // Fix DobHTipoUbicacionSlice
    content = content.replace(/app\/Middleware\/reducers\/DobHTipoUbicacionSlice/g, 'app/features/dobladora/middleware/DobHTipoUbicacionSlice');

    // Fix DashboardService
    if (file.includes('DashboardPage.tsx')) {
        content = content.replace(/\.\.\/\.\.\/services\/Dashboard\.Service/g, 'app/features/gerencia/services/Dashboard.Service');
    }
    
    // Fix calendar-messages
    if (file.includes('CalendarScreen.tsx')) {
        content = content.replace(/\.\.\/helpers\/calendar-messages/g, 'app/features/otrasPaginas/helpers/calendar-messages');
    }
    
    // Fix DotacionSlice missing model IDotacion
    if (file.includes('DotacionSlice.tsx')) {
        content = content.replace(/\.\.\/\.\.\/features\/ingenieria\/modules\/dotacionMantenimiento\/models\/IDotacion/g, 'app/models/IDotacion');
    }
    
    // Fix AccesoDenegado
    if (file.includes('AccesoDenegado.tsx')) {
        // Change the json import to the correct one if needed. Let's see what the path is first.
    }

    if (original !== content) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Fixed ${file}`);
    }
});

