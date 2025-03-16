'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { DM_Serif_Display, Source_Serif_4 } from "next/font/google";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ImageIcon, Film } from "lucide-react";
import Masonry from 'react-masonry-css';

const masonryStyles = `
.my-masonry-grid {
  display: flex;
  width: auto;
  margin-left: -16px; /* gutter size offset */
}
.my-masonry-grid_column {
  padding-left: 16px; /* gutter size */
  background-clip: padding-box;
}
`;


// Import the fonts
const dmSerifDisplay = DM_Serif_Display({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
    variable: "--font-dm-serif",
});

const sourceSerif = Source_Serif_4({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-source-serif",
});

// Function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// Function to generate an "infinite" array of gallery items with unique IDs
const generateInfiniteGallery = (originalItems, multiplier = 10) => {
    if (!originalItems || originalItems.length === 0) {
        return [];
    }

    let extendedItems = [];
    const timestamp = Date.now(); // Use timestamp to ensure uniqueness

    for (let i = 0; i < multiplier; i++) {
        // Create a shuffled copy of the original items
        const shuffled = shuffleArray([...originalItems]);

        // Add to extended items with unique IDs
        extendedItems = [...extendedItems, ...shuffled.map((item, idx) => ({
            ...item,
            id: `${item.id}-${timestamp}-${i}-${idx}` // Truly unique ID
        }))];
    }

    return extendedItems;
};

// Video component with play/pause and mute controls
function VideoItem({ src, poster, caption, width, height }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [hasError, setHasError] = useState(false);
    const aspectRatio = width && height ? width / height : 16 / 9;
    // Set up Intersection Observer to play/pause video based on visibility
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Auto play when in view, pause when out of view
                if (entry.isIntersecting && !isPlaying && !hasError) {
                    videoRef.current?.play().catch((error) => {
                        console.log("Video playback error:", error);
                        setHasError(true);
                    });
                    setIsPlaying(true);
                } else if (!entry.isIntersecting && isPlaying) {
                    videoRef.current?.pause();
                    setIsPlaying(false);
                }
            },
            { threshold: 0.5, rootMargin: '0px 0px 200px 0px' } // Start loading earlier
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, [isPlaying, hasError]);

    const togglePlay = (e) => {
        e.stopPropagation();
        if (hasError) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play().catch(err => {
                console.log("Play failed:", err);
                setHasError(true);
            });
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="relative group overflow-hidden rounded-lg h-full bg-slate-200 dark:bg-slate-800">
            {hasError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-800">
                    <Film size={40} className="text-slate-400 dark:text-slate-600 mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Video unavailable</p>
                </div>
            ) : (
                <>
                    <video
                        ref={videoRef}
                        loop
                        muted={isMuted}
                        poster={poster}
                        className="w-full h-full object-cover"
                        onError={() => setHasError(true)}
                        playsInline
                    >
                        <source src={src} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Video badge */}
                    <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center">
                        <Film size={12} className="mr-1" /> Video
                    </div>

                    {/* Video controls */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <div className="flex items-center justify-between text-white">
                            <button
                                onClick={togglePlay}
                                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                aria-label={isPlaying ? "Pause video" : "Play video"}
                            >
                                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                            </button>

                            <button
                                onClick={toggleMute}
                                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                aria-label={isMuted ? "Unmute video" : "Mute video"}
                            >
                                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// Image component with caption overlay
function ImageItem({ src, alt, width, height, caption }) {
    const [imageError, setImageError] = useState(false);

    // Calculate aspect ratio for proper sizing
    const aspectRatio = width && height ? width / height : 1.5;

    return (
        <div className="relative group overflow-hidden rounded-lg h-full bg-slate-200 dark:bg-slate-800">
            {imageError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <ImageIcon size={40} className="text-slate-400 dark:text-slate-600 mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Image unavailable</p>
                </div>
            ) : (
                <>
                    <div style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }} className="relative w-full">
                        <Image
                            src={src}
                            alt={alt || "Gallery image"}
                            fill
                            className="absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            onError={() => setImageError(true)}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

// Modal component for fullscreen view
function GalleryModal({ item, isOpen, onClose }) {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-lg"
                onClick={e => e.stopPropagation()}
            >
                {item?.type === 'video' ? (
                    <div className="w-full h-full max-h-[80vh]">
                        <VideoItem
                            src={item.src}
                            poster={item.poster}
                            caption={item.caption}
                            width={item.width}
                            height={item.height}
                        />
                    </div>
                ) : (
                    <div className="relative">
                        <Image
                            src={item.src}
                            alt={item.alt || "Gallery image"}
                            width={item.width || 1200}
                            height={item.height || 800}
                            className="max-h-[80vh] w-auto object-contain"
                        />
                    </div>
                )}
                <button
                    className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default function GalleryPage() {
    const [galleryData, setGalleryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [visibleCount, setVisibleCount] = useState(12);
    const loaderRef = useRef(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Fetch gallery files from API
    useEffect(() => {
        async function fetchGalleryFiles() {
            setIsLoading(true);
            try {
                const response = await fetch('/api/gallery-files');

                if (!response.ok) {
                    throw new Error('Failed to load gallery files');
                }

                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                if (data && data.length > 0) {
                    // Generate infinite gallery from the loaded files
                    const infiniteItems = generateInfiniteGallery(data, 10);
                    setGalleryData(infiniteItems);
                } else {
                    console.log('No gallery files found');
                }
            } catch (error) {
                console.error('Gallery error:', error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        }

        fetchGalleryFiles();
    }, []);

    // Set up Intersection Observer for infinite scrolling
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading) {
                    loadMoreItems();
                }
            },
            { threshold: 0.1, rootMargin: '200px' }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [isLoading]);

    // Load more items function
    const loadMoreItems = () => {
        setIsLoading(true);
        setTimeout(() => {
            setVisibleCount(prevCount => prevCount + 8);

            // If we're getting near the end of our array, add more items
            if (visibleCount + 16 >= galleryData.length) {
                // Generate more items if needed by using the first few items as source
                const sourceItems = galleryData.slice(0, Math.min(galleryData.length, 20));
                const moreItems = generateInfiniteGallery(sourceItems, 5);
                setGalleryData(prev => [...prev, ...moreItems]);
            }

            setIsLoading(false);
        }, 500); // Simulate loading delay for smoothness
    };

    // Handle modal opening
    const openModal = (item) => {
        setSelectedItem(item);
        setModalOpen(true);
    };

    return (
        <div className="min-h-screen">
            <style jsx>{masonryStyles}</style>
            {/* Hero Section */}
            <section className="py-16 md:py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className={`${dmSerifDisplay.className} text-4xl md:text-5xl lg:text-6xl font-normal mb-6 text-blue-800 dark:text-blue-300`}>
                        Gallery
                    </h1>
                    <p className={`${sourceSerif.className} text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed`}>
                        Explore memorable moments from our events, workshops, and activities through photos and videos.
                    </p>
                </div>
            </section>

            {/* Infinite Gallery Section */}
            <section className="py-8 px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    {isError && (
                        <div className="text-center mb-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                            <p>There was an error loading the gallery. Showing sample images.</p>
                        </div>
                    )}

                    {/* Masonry Grid */}
                    <Masonry
                        breakpointCols={{
                            default: 4,
                            1100: 3,
                            700: 2,
                            500: 1
                        }}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        {galleryData.slice(0, visibleCount).map((item, index) => {
                            const itemKey = `gallery-item-${item.id}-pos${index}`;

                            return (
                                <motion.div
                                    key={itemKey}
                                    className="mb-4 overflow-hidden cursor-pointer"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(index % 12 * 0.05, 0.5) }}
                                    onClick={() => openModal(item)}
                                >
                                    {item.type === 'video' ? (
                                        <VideoItem
                                            src={item.src}
                                            poster={item.poster}
                                            caption={item.caption}
                                        />
                                    ) : (
                                        <ImageItem
                                            src={item.src}
                                            alt={item.alt}
                                            width={item.width}
                                            height={item.height}
                                            caption={item.caption}
                                        />
                                    )}
                                </motion.div>
                            );
                        })}
                    </Masonry>

                    {/* Loading indicator */}
                    <div
                        ref={loaderRef}
                        className="w-full flex justify-center py-16"
                    >
                        {isLoading && (
                            <div className="flex flex-col items-center">
                                <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">Loading more items...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Modal for fullscreen view */}
            <GalleryModal
                item={selectedItem}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
}