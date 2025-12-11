#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const publicDir = path.join(__dirname, '..', 'public');
const buildDir = path.join(__dirname, '..', 'build');
const tempDir = path.join(__dirname, '..', '.temp');

// Clean and create directories
if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true });
}
fs.mkdirSync(tempDir, { recursive: true });

if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true });
}
fs.mkdirSync(buildDir, { recursive: true });

// Process HTML files
const htmlFiles = ['index.html', 'portfolio.html'];

htmlFiles.forEach(file => {
    const htmlPath = path.join(publicDir, file);
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    
    // Extract inline script
    const scriptMatch = htmlContent.match(/<script type="module">([\s\S]*?)<\/script>/);
    if (scriptMatch) {
        const scriptContent = scriptMatch[1];
        
        // Save script to temp file
        const tempScriptPath = path.join(tempDir, `${path.parse(file).name}.js`);
        fs.writeFileSync(tempScriptPath, scriptContent);
        
        // Bundle with esbuild
        const bundledScriptPath = path.join(buildDir, `${path.parse(file).name}.bundle.js`);
        execSync(`npx esbuild ${tempScriptPath} --bundle --format=esm --outfile=${bundledScriptPath} --minify`, {
            cwd: path.join(__dirname, '..'),
            stdio: 'inherit'
        });
        
        // Read bundled script
        const bundledScript = fs.readFileSync(bundledScriptPath, 'utf-8');
        
        // Replace inline script with bundled version
        const updatedHtml = htmlContent.replace(
            /<script type="module">[\s\S]*?<\/script>/,
            `<script type="module">\n${bundledScript}\n    </script>`
        );
        
        // Write to build directory
        fs.writeFileSync(path.join(buildDir, file), updatedHtml);
        
        // Clean up bundled JS file (we've inlined it)
        fs.unlinkSync(bundledScriptPath);
    } else {
        // No script to bundle, just copy
        fs.copyFileSync(htmlPath, path.join(buildDir, file));
    }
});

// Copy other files
const filesToCopy = ['manifest.json', 'robots.txt'];
filesToCopy.forEach(file => {
    const src = path.join(publicDir, file);
    const dest = path.join(buildDir, file);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
    }
});

// Copy CSS directory
const cssDir = path.join(publicDir, 'css');
const cssDest = path.join(buildDir, 'css');
if (fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDest, { recursive: true });
    fs.readdirSync(cssDir).forEach(file => {
        fs.copyFileSync(path.join(cssDir, file), path.join(cssDest, file));
    });
}

// Clean up temp directory
fs.rmSync(tempDir, { recursive: true });

console.log('✅ Build completed successfully!');
