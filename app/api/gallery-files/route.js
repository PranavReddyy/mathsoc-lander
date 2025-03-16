import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// Function to get all files from a directory
async function getFilesFromDir(dirPath) {
    try {
        const files = await fs.readdir(dirPath);
        return files;
    } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
        return [];
    }
}

// Function to generate caption from filename
function generateCaption(filename) {
    if (!filename) return "";

    // Remove file extension
    let caption = filename.replace(/\.[^/.]+$/, "");

    // Replace hyphens and underscores with spaces
    caption = caption.replace(/[-_]/g, " ");

    // Title case the caption
    caption = caption.split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");

    return caption;
}

export async function GET() {
    try {
        // Define paths
        const imagesDir = path.join(process.cwd(), 'public', 'images', 'gallery');
        const videosDir = path.join(process.cwd(), 'public', 'videos', 'gallery');

        // Ensure directories exist
        try {
            await fs.access(imagesDir);
        } catch {
            await fs.mkdir(imagesDir, { recursive: true });
        }

        try {
            await fs.access(videosDir);
        } catch {
            await fs.mkdir(videosDir, { recursive: true });
        }

        // Get all files
        const imageFiles = await getFilesFromDir(imagesDir);
        const videoFiles = await getFilesFromDir(videosDir);

        // Process image files
        const images = imageFiles
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .map((file, index) => ({
                id: `image-${index}`,
                type: 'image',
                src: `/images/gallery/${file}`,
                alt: generateCaption(file),
                caption: generateCaption(file),
                // Estimate dimensions based on file name pattern or use default
                width: 1200,
                height: 800
            }));

        // Process video files
        const videos = videoFiles
            .filter(file => /\.(mp4|webm|mov)$/i.test(file))
            .map((file, index) => {
                const baseName = file.replace(/\.[^/.]+$/, "");
                return {
                    id: `video-${index}`,
                    type: 'video',
                    src: `/videos/gallery/${file}`,
                    // Look for matching thumbnail
                    poster: imageFiles.includes(`${baseName}-thumbnail.jpg`)
                        ? `/images/gallery/${baseName}-thumbnail.jpg`
                        : null,
                    caption: generateCaption(file)
                };
            });

        // Combine and shuffle
        const allItems = [...images, ...videos].sort(() => Math.random() - 0.5);

        return NextResponse.json(allItems);
    } catch (error) {
        console.error('Error in gallery files API:', error);
        return NextResponse.json({ error: 'Failed to load gallery files' }, { status: 500 });
    }
}