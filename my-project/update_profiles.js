import fs from 'fs';
import { sports } from './src/data/mockData.js';

// Since we cannot write back to .js easily while preserving structure (regex is risky for nested objects),
// we will read the file as string and replace the image URLs carefully.
// BUT, mockData.js structure is consistent.

// Function to fetch images
async function fetchImages(gender, count) {
    const url = `https://randomuser.me/api/?results=${count}&gender=${gender}&nat=IN`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results.map(u => u.picture.large);
}

async function run() {
    console.log("Fetching images...");
    const boys = await fetchImages('male', 15); // Fetch extra just in case
    const girls = await fetchImages('female', 15);

    console.log(`Fetched ${boys.length} boys and ${girls.length} girls.`);

    let fileContent = fs.readFileSync('./src/data/mockData.js', 'utf8');

    // Strategy: Replace generic randomuser URLs with specific ones.
    // The current URLs are like "https://randomuser.me/api/portraits/men/12.jpg"
    // We want to replace them cyclicly.

    // Regex for men images
    // "image": "https://randomuser.me/api/portraits/men/\d+.jpg"
    let boyIndex = 0;
    fileContent = fileContent.replace(/"image": "https:\/\/randomuser\.me\/api\/portraits\/men\/\d+\.jpg"/g, (match) => {
        const url = boys[boyIndex % boys.length];
        boyIndex++;
        return `"image": "${url}"`;
    });

    // Regex for women images
    let girlIndex = 0;
    fileContent = fileContent.replace(/"image": "https:\/\/randomuser\.me\/api\/portraits\/women\/\d+\.jpg"/g, (match) => {
        const url = girls[girlIndex % girls.length];
        girlIndex++;
        return `"image": "${url}"`;
    });

    // Also handle possible "0.jpg" etc if regex didn't match perfectly. 
    // The previous regex expects `men/\d+.jpg`.

    fs.writeFileSync('./src/data/mockData.js', fileContent);
    console.log("Updated mockData.js!");
}

run();
