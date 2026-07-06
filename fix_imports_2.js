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

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Fix ModalCompoment
    content = content.replace(/import\s+\{\s*ModalCompoment\s*\}\s+from\s+["']\.\.?\/[^"']*ModalComponent["'];?/g, 'import { ModalCompoment } from "app/shared/components/ui/ModalComponent";');
    content = content.replace(/import\s+\{\s*ModalCompoment\s*\}\s+from\s+["'](app\/)?shared\/components\/ModalComponent["'];?/g, 'import { ModalCompoment } from "app/shared/components/ui/ModalComponent";');

    // Fix ProductoSliceRequests from app/Middleware/reducers
    if (content.includes('ProductoSliceRequests') && content.includes('app/Middleware/reducers')) {
        content = content.replace(/import\s+\{\s*([^}]*?)(,\s*ProductoSliceRequests|ProductoSliceRequests\s*,?)([^}]*?)\s*\}\s+from\s+["']app\/Middleware\/reducers["'];?/g, (match, p1, p2, p3) => {
            let others = [p1, p3].map(s => s.trim()).filter(s => s.length > 0).join(', ');
            let res = `import { ProductoSliceRequests } from "app/features/trazabilidad/slices/ProductoSlice";\n`;
            if (others.replace(/,/g,'').trim().length > 0) {
                res += `import { ${others} } from "app/Middleware/reducers";`;
            }
            return res;
        });
    }
    
    // Fix PuestoSliceRequests
    if (content.includes('PuestoSliceRequests') && content.includes('app/Middleware/reducers')) {
        content = content.replace(/import\s+\{\s*([^}]*?)(,\s*PuestoSliceRequests|PuestoSliceRequests\s*,?)([^}]*?)\s*\}\s+from\s+["']app\/Middleware\/reducers["'];?/g, (match, p1, p2, p3) => {
            let others = [p1, p3].map(s => s.trim()).filter(s => s.length > 0).join(', ');
            let res = `import { PuestoSliceRequests } from "app/features/trazabilidad/slices/PuestoSlice";\n`;
            if (others.replace(/,/g,'').trim().length > 0) {
                res += `import { ${others} } from "app/Middleware/reducers";`;
            }
            return res;
        });
    }
    
    // Fix TrazaProductoPuestoSliceRequests
    if (content.includes('TrazaProductoPuestoSliceRequests') && content.includes('app/Middleware/reducers')) {
        content = content.replace(/import\s+\{\s*([^}]*?)(,\s*TrazaProductoPuestoSliceRequests|TrazaProductoPuestoSliceRequests\s*,?)([^}]*?)\s*\}\s+from\s+["']app\/Middleware\/reducers["'];?/g, (match, p1, p2, p3) => {
            let others = [p1, p3].map(s => s.trim()).filter(s => s.length > 0).join(', ');
            let res = `import { TrazaProductoPuestoSliceRequests } from "app/features/trazabilidad/slices/TrazaProductoPuestoSlice";\n`;
            if (others.replace(/,/g,'').trim().length > 0) {
                res += `import { ${others} } from "app/Middleware/reducers";`;
            }
            return res;
        });
    }

    // Fix generic.service in trazabilidad
    if (file.includes('trazabilidad') && file.includes('services')) {
        content = content.replace(/import\s+\{\s*GenericService\s*\}\s+from\s+["']\.\.?\/[^"']*generic\.service["'];?/g, 'import { GenericService } from "app/services/generic.service";');
        content = content.replace(/this\.url/g, 'this.Url');
        
        if (content.includes('../models/IPuesto')) {
            content = content.replace(/['"]\.\.\/models\/IPuesto['"]/g, '"app/models/IPuesto"');
        }
    }
    
    // Fix ValidarQrLgSlice
    content = content.replace(/from\s+["']app\/Middleware\/reducers\/ValidarQrLgSlice["']/g, 'from "app/features/trazabilidad/slices/ValidarQrLgSlice"');

    // Fix AuthenticationSlice in errorNotifications
    content = content.replace(/from\s+["']\.\.\/reducers\/AuthenticationSlice["']/g, 'from "app/features/auth/AuthenticationSlice"'); // Assuming auth slice is there, we will check later or just use app/Middleware/reducers/AuthenticationSlice if it exists? Wait, let's look at what the error said.

    // Fix rechazoMultiple.service and valorAuditType.service in reducers
    if (file.includes('rechazoMultipleSlice')) {
        content = content.replace(/app\/services\/rechazoMultiple\.service/g, 'app/features/calidad/services/rechazoMultiple.service');
    }
    if (file.includes('ValorAuditTypeSlice')) {
        content = content.replace(/app\/services\/valorAuditType\.service/g, 'app/features/audit/services/valorAuditType.service');
    }
    
    // Fix productoSlice
    content = content.replace(/from\s+["']app\/Middleware\/reducers\/productoSlice["']/g, 'from "app/features/trazabilidad/slices/ProductoSlice"');
    content = content.replace(/import\s+\{\s*([^}]*?)(,\s*productoSlice|productoSlice\s*,?)([^}]*?)\s*\}\s+from\s+["']app\/Middleware\/reducers["'];?/g, (match, p1, p2, p3) => {
        let others = [p1, p3].map(s => s.trim()).filter(s => s.length > 0).join(', ');
        let res = `import { productoSlice } from "app/features/trazabilidad/slices/ProductoSlice";\n`;
        if (others.replace(/,/g,'').trim().length > 0) {
            res += `import { ${others} } from "app/Middleware/reducers";`;
        }
        return res;
    });

    if (original !== content) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Fixed ${file}`);
    }
});
console.log('Done!');
