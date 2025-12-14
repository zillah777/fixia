const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
    let files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file === 'page.tsx' || file === 'layout.tsx') {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const appDir = path.join(__dirname, 'src', 'app');
const files = getAllFiles(appDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('prisma') || content.includes('@/lib/prisma')) {
        if (!content.includes('export const dynamic')) {
            console.log(`Missing dynamic export in: ${file}`);
        }
    }
});
