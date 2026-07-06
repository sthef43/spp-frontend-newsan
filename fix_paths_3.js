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

    if (file.includes('calidad') && file.includes('slices')) {
        content = content.replace(/\.\.\/HelperMidleware\/errorNotifications/g, 'app/Middleware/HelperMidleware/errorNotifications');
        content = content.replace(/['"]app\/services\/([^'"]+)['"]/g, '"app/features/calidad/services/$1"');
        content = content.replace(/['"]\.\.\/\.\.\/services\/([^'"]+)['"]/g, '"app/features/calidad/services/$1"');
        content = content.replace(/['"]\.\.\/\.\.\/models\/([^'"]+)['"]/g, '"app/models/$1"');
        // also fix trazaUnit2Slice
        content = content.replace(/['"]\.\/genericSlice['"]/g, '"app/Middleware/reducers/genericSlice"');
    }

    if (file.includes('dotaHistorico.service.tsx')) {
        content = content.replace(/this\.Url/g, 'this.url');
    }

    if (file.includes('CalendarScreen.tsx')) {
        content = content.replace(/\.\.\/app\/features\/otrasPaginas\/helpers\/calendar-messages/g, 'app/features/otrasPaginas/helpers/calendar-messages');
    }

    if (file.includes('errorNotifications.tsx')) {
        content = content.replace(/app\/Middleware\/reducers\/AuthenticationSlice/g, 'app/features/cuenta/slices/AuthenticationSlice');
    }

    if (original !== content) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Fixed ${file}`);
    }
});
