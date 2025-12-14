const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
    let files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file === 'route.ts') {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const apiDir = path.join(__dirname, 'src', 'app', 'api');
const files = getAllFiles(apiDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('export const dynamic')) {
        console.log(`Fixing ${file}`);

        const lines = content.split('\n');
        let lastImportIndex = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().startsWith('import ') || lines[i].trim().startsWith('import"')) {
                lastImportIndex = i;
            }
        }

        if (lastImportIndex !== -1) {
            lines.splice(lastImportIndex + 1, 0, "\nexport const dynamic = 'force-dynamic';");
        } else {
            lines.unshift("export const dynamic = 'force-dynamic';\n");
        }

        fs.writeFileSync(file, lines.join('\n'));
    }
});
