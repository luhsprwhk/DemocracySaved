const fs = require('fs').promises;
const path = require('path');

async function concatenateFiles(directory, outputFileName) {
    try {
        const files = await fs.readdir(directory);
        
        const contents = await Promise.all(
            files
                .filter(file => file.endsWith('.md'))
                .map(async file => {
                    const content = await fs.readFile(path.join(directory, file), 'utf8');
                    return `# ${path.basename(file, '.md')}\n\n${content}\n\n`;
                })
        );

        // Just join with newlines instead of separators
        const concatenatedContent = contents.join('\n');

        await fs.writeFile(outputFileName, concatenatedContent);
        console.log(`Successfully created ${outputFileName}`);
    } catch (error) {
        console.error(`Error processing files: ${error}`);
    }
}

// Get the root directory path
const rootDir = path.resolve(__dirname, '..');

// Update the concatenateFiles function calls with the full paths
const charactersDir = path.join(rootDir, 'src', 'characters');
const templatesDir = path.join(rootDir, 'src', 'templates');
const aiGuideDir = path.join(rootDir, 'src');

const distDir = path.join(rootDir, 'dist');

// Ensure the dist directory exists
fs.mkdir(distDir, { recursive: true }).catch(console.error);

concatenateFiles(charactersDir, `${distDir}/character-book.md`);
concatenateFiles(templatesDir, `${distDir}/templates.md`);
concatenateFiles(aiGuideDir, `${distDir}/ai-content-generation-guide.md`);