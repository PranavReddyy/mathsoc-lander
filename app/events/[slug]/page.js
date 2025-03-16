'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import { Calendar, Clock, MapPin, Tag, User, ArrowLeft } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../../components/ui/carousel";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 hour in milliseconds
const eventCache = {
    data: {},
    timestamp: {}
};

export default function EventDetailPage() {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { slug } = useParams();

    useEffect(() => {
        // Initialize cache from localStorage when component mounts
        try {
            const savedCache = localStorage.getItem('eventDetailPageCache');
            if (savedCache) {
                const parsedCache = JSON.parse(savedCache);
                if (parsedCache.data && parsedCache.timestamp) {
                    eventCache.data = parsedCache.data;
                    eventCache.timestamp = parsedCache.timestamp;
                }
            }
        } catch (e) {
            console.error('Error restoring cache:', e);
        }

        async function fetchEvent() {
            try {
                // Check if we have cached data that's still valid
                const cachedData = eventCache.data[slug];
                const cachedTime = eventCache.timestamp[slug];
                const now = Date.now();

                // Use cached data if it exists and hasn't expired
                if (cachedData && cachedTime && (now - cachedTime < CACHE_DURATION)) {
                    console.log("Using cached event data for:", slug);
                    setEvent(cachedData);
                    setLoading(false);
                    return;
                }

                const eventsRef = collection(db, "events");
                const q = query(eventsRef, where("slug", "==", slug), limit(1));

                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setError("Event not found");
                    return;
                }

                const eventData = {
                    id: querySnapshot.docs[0].id,
                    ...querySnapshot.docs[0].data()
                };

                // Update cache
                eventCache.data[slug] = eventData;
                eventCache.timestamp[slug] = now;

                // Save cache to localStorage
                try {
                    localStorage.setItem('eventDetailPageCache', JSON.stringify(eventCache));
                } catch (e) {
                    console.error('Error saving cache:', e);
                }

                setEvent(eventData);
            } catch (error) {
                console.error("Error fetching event:", error);
                setError("Failed to load event");
            } finally {
                setLoading(false);
            }
        }

        if (slug) {
            fetchEvent();
        }
    }, [slug]);

    // Format date for display
    const formattedDate = event?.date ? new Date(event.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    }) : null;

    // Check if event is upcoming
    const isUpcoming = event?.date ? new Date(event.date) > new Date() : false;

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
                <p className="mb-8">The event you&apos;re looking for couldn&apos;t be found.</p>
                <Button onClick={() => router.push("/events")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <Button
                variant="ghost"
                className="mb-6"
                onClick={() => router.push("/events")}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
            </Button>

            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-6">{event.title}</h1>

                {/* Meta information */}
                <div className="flex flex-wrap gap-4 mb-6">
                    {event.date && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Calendar className="h-4 w-4" />
                            <span>{formattedDate}</span>
                            {isUpcoming && (
                                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-0.5 rounded-md ml-2">
                                    Upcoming
                                </span>
                            )}
                        </div>
                    )}

                    {event.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                        </div>
                    )}

                    {event.author && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <User className="h-4 w-4" />
                            <span>By {event.author}</span>
                        </div>
                    )}

                    {event.category && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Tag className="h-4 w-4" />
                            <span>{event.category}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main image */}
            {event.mainImageUrl && (
                <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-8 shadow-md">
                    <Image
                        src={event.mainImageUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            {/* Content */}
            <div className="prose dark:prose-invert max-w-none mb-12">
                <p className="text-xl font-medium mb-6 text-gray-700 dark:text-gray-200">{event.summary}</p>
                <div className="whitespace-pre-wrap">{event.content}</div>
            </div>

            {/* Gallery */}
            {event.additionalImageUrls?.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Event Gallery</h2>
                    <Carousel className="w-full" opts={{ loop: true, align: "center" }}>
                        <CarouselContent>
                            {event.additionalImageUrls.map((imageUrl, index) => (
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
                <Button onClick={() => router.push("/events")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
                </Button>
            </div>
        </div>
    );
}