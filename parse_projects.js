const fs = require('fs');
const data = fs.readFileSync('src/data/projects.ts', 'utf8');
const idMatches = [...data.matchAll(/id: "([^"]+)"/g)];
const titleMatches = [...data.matchAll(/title: "([^"]+)"/g)];
const slugMatches = [...data.matchAll(/slug: "([^"]+)"/g)];
const urlMatches = [...data.matchAll(/liveUrl: "([^"]+)"/g)];

console.log("IDs:", idMatches.map(m => m[1]));
console.log("Titles:", titleMatches.map(m => m[1]));
console.log("Slugs:", slugMatches.map(m => m[1]));
console.log("LiveURLs:", urlMatches.map(m => m[1]));
