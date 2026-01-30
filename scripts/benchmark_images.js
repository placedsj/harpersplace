
import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('constants.tsx', 'utf8');
const regex = /image:\s*"(https:\/\/[^"]+)"/g;
let match;
const urls = [];

while ((match = regex.exec(content)) !== null) {
    urls.push(match[1]);
}

console.log(`Found ${urls.length} images.`);

async function getSize(url) {
    try {
        const res = await fetch(url, { method: 'HEAD' });
        if (!res.ok) {
             // Try GET if HEAD fails (sometimes servers reject HEAD)
             const resGet = await fetch(url, { method: 'GET' });
             if (!resGet.ok) return { url, size: 0, error: resGet.status };
             const len = resGet.headers.get('content-length');
             return { url, size: len ? parseInt(len, 10) : 0 };
        }
        const len = res.headers.get('content-length');
        if (!len) {
             // If no content-length, maybe try GET and read body?
             // But for Unsplash it should be there.
             // If chunked, we might need to read the whole body.
             const resGet = await fetch(url);
             const blob = await resGet.blob();
             return { url, size: blob.size };
        }
        return { url, size: parseInt(len, 10) };
    } catch (e) {
        return { url, size: 0, error: e.message };
    }
}

(async () => {
    let totalSize = 0;
    console.log('--- Benchmarking Images ---');
    for (const url of urls) {
        const data = await getSize(url);
        if (data.error) {
            console.log(`[ERROR] ${url}: ${data.error}`);
        } else {
            const sizeMB = (data.size / 1024 / 1024).toFixed(2);
            console.log(`[${sizeMB} MB] ${url}`);
            totalSize += data.size;
        }
    }
    console.log('---------------------------');
    console.log(`Total Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
})();
