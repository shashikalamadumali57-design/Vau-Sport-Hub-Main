import fs from 'fs';

const mockDataPath = './src/data/mockData.js';
let content = fs.readFileSync(mockDataPath, 'utf8');

// Function to generate deterministic avatar URL
const getAvatar = (gender, name) => {
    // Encode name for URL
    const encodedName = encodeURIComponent(name);
    return `https://avatar.iran.liara.run/public/${gender}?username=${encodedName}`;
};

// Process boysTeam blocks
content = content.replace(/"boysTeam":\s*\[([\s\S]*?)\]/g, (match, blockContent) => {
    // Inside the boysTeam block, find members and update images
    return `"boysTeam": [` + blockContent.replace(/"name": "([^"]+)",\s*"role": "([^"]+)",\s*"image": "undefined"/g, (m, name, role) => {
        const avatarUrl = getAvatar('boy', name);
        return `"name": "${name}",\n        "role": "${role}",\n        "image": "${avatarUrl}"`;
    }) + `]`;
});

// Process girlsTeam blocks
content = content.replace(/"girlsTeam":\s*\[([\s\S]*?)\]/g, (match, blockContent) => {
    // Inside the girlsTeam block, find members and update images
    return `"girlsTeam": [` + blockContent.replace(/"name": "([^"]+)",\s*"role": "([^"]+)",\s*"image": "undefined"/g, (m, name, role) => {
        const avatarUrl = getAvatar('girl', name);
        return `"name": "${name}",\n        "role": "${role}",\n        "image": "${avatarUrl}"`;
    }) + `]`;
});

// Handle cases where formatting might be slightly different layout (e.g. newlines)
// The above regex expects "name", then "role", then "image" in that order.
// Let's verify commonly if that's the case. In the view_file output it was.
// But to be safer, we can do a more generic replacement if the above fails to catch some.

fs.writeFileSync(mockDataPath, content);
console.log('Updated mockData.js with profile images');
