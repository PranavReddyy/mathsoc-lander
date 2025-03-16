'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import Image from "next/image";
import { Button } from "../../../../components/ui/button";
import { ArrowLeft, User, Tag, Calendar } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../../../components/ui/carousel";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 hour in milliseconds
const communityCache = {
    data: {},
    timestamp: {}
};

function prepareDataForCache(data) {
    const processedData = { ...data }; // Create a shallow copy

    // Process Firestore timestamps
    if (processedData.createdAt && typeof processedData.createdAt.toDate === 'function') {
        processedData.createdAt = processedData.createdAt.toDate().toISOString();
    }

    // Process event date timestamp (check both possible field names)
    if (processedData.date && typeof processedData.date.toDate === 'function') {
        processedData.date = processedData.date.toDate().toISOString();
    }

    if (processedData.eventDate && typeof processedData.eventDate.toDate === 'function') {
        processedData.eventDate = processedData.eventDate.toDate().toISOString();
    }

    return processedData;
}

export default function CommunityServiceDetailPage() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug;

    const pageTitle = slug ?
        slug.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ') + ' | MathSoc' :
        'MathSoc Community Service';

    useEffect(() => {
        if (post?.title) {
            document.title = `${post.title} | MathSoc Community Service`;
        } else if (pageTitle) {
            document.title = pageTitle;
        }
    }, [post, pageTitle]);


    useEffect(() => {
        // Initialize cache from localStorage when component mounts
        try {
            const savedCache = localStorage.getItem('communityDetailPageCache');
            if (savedCache) {
                const parsedCache = JSON.parse(savedCache);
                if (parsedCache.data && parsedCache.timestamp) {
                    communityCache.data = parsedCache.data;
                    communityCache.timestamp = parsedCache.timestamp;
                }
            }
        } catch (e) {
            console.error('Error restoring cache:', e);
        }

        async function fetchPost() {
            try {
                // Check if we have cached data that's still valid
                const cachedData = communityCache.data[slug];
                const cachedTime = communityCache.timestamp[slug];
                const now = Date.now();

                // Use cached data if it exists and hasn't expired
                if (cachedData && cachedTime && (now - cachedTime < CACHE_DURATION)) {
                    console.log("Using cached community service data for:", slug);
                    setPost(cachedData);
                    setLoading(false);
                    return;
                }

                const postsRef = collection(db, "communitys");
                const q = query(postsRef, where("slug", "==", slug), limit(1));

                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setError("Post not found");
                    return;
                }

                const postData = {
                    id: querySnapshot.docs[0].id,
                    ...querySnapshot.docs[0].data()
                };

                // Update cache
                const processedData = prepareDataForCache(postData);
                communityCache.data[slug] = processedData;
                communityCache.timestamp[slug] = now;

                // Save cache to localStorage
                try {
                    localStorage.setItem('communityDetailPageCache', JSON.stringify(communityCache));
                } catch (e) {
                    console.error('Error saving cache:', e);
                }

                setPost(postData);
            } catch (error) {
                console.error("Error fetching post:", error);
                setError("Failed to load post");
            } finally {
                setLoading(false);
            }
        }

        if (slug) {
            fetchPost();
        }
    }, [slug]);

    // Format timesta
    const formattedDate = post?.date
        ? (typeof post.date.toDate === 'function'
            ? new Date(post.date.toDate()).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            })
            : new Date(post.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            })
        )
        : post?.eventDate
            ? (typeof post.eventDate.toDate === 'function'
                ? new Date(post.eventDate.toDate()).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })
                : new Date(post.eventDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })
            )
            : null;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
                <p className="mb-8">The post you&apos;re looking for couldn&apos;t be found.</p>
                <Button onClick={() => router.push("/activities/community-service")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Community Service
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <Button
                variant="ghost"
                className="mb-6"
                onClick={() => router.push("/activities/community-service")}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Community Service
            </Button>

            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>

                {/* Meta information */}
                <div className="flex flex-wrap gap-4 mb-6">
                    {formattedDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Calendar className="h-4 w-4" />
                            <span>{formattedDate}</span> {/* Display the formatted date, not post.eventDate */}
                        </div>
                    )}

                    {post.author && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <User className="h-4 w-4" />
                            <span>By {post.author}</span>
                        </div>
                    )}

                    {post.category && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Tag className="h-4 w-4" />
                            <span>{post.category}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main image */}
            {post.mainImageUrl && (
                <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-8 shadow-md">
                    <Image
                        src={post.mainImageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            {/* Content */}
            <div className="prose dark:prose-invert max-w-none mb-12">
                <p className="text-xl font-medium mb-6 text-gray-700 dark:text-gray-200">{post.summary}</p>
                <div className="whitespace-pre-wrap">{post.content}</div>
            </div>

            {/* Gallery */}
            {post.additionalImageUrls?.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Gallery</h2>
                    <Carousel className="w-full" opts={{ loop: true, align: "center" }}>
                        <CarouselContent>
                            {post.additionalImageUrls.map((imageUrl, index) => (
                                <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/3 pl-4">
                                    <div className="relative aspect-square overflow-hidden rounded-lg">
                                        <Image
                                            src={imageUrl}
                                            alt={`Gallery image ${index + 1}`}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-1" />
                        <CarouselNext className="right-1" />
                    </Carousel>
                </div>
            )}

            <div className="text-center mt-12">
                <Button onClick={() => router.push("/activities/community-service")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Community Service
                </Button>
            </div>
        </div>
    );
}