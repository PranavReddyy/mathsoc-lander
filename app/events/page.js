'use client';

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import BlogPostCard from "../../components/BlogPostCard";
import { Loader2 } from "lucide-react";
import { DM_Serif_Display, Source_Serif_4 } from "next/font/google";

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

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            try {
                // Create a query against the events collection, ordered by date
                const eventsRef = collection(db, "events");
                const q = query(eventsRef, orderBy("date", "desc"));

                const querySnapshot = await getDocs(q);
                const eventsList = [];

                querySnapshot.forEach((doc) => {
                    eventsList.push({
                        id: doc.id,
                        ...doc.data(),
                        slug: doc.data().slug || doc.id
                    });
                });

                setEvents(eventsList);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, []);

    // Group events by year for the timeline
    const groupedEvents = events.reduce((groups, event) => {
        const date = event.date ? new Date(event.date) : new Date();
        const year = date.getFullYear();

        if (!groups[year]) {
            groups[year] = [];
        }

        groups[year].push(event);
        return groups;
    }, {});

    // Sort years in descending order
    const years = Object.keys(groupedEvents).sort((a, b) => b - a);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h1 className={`${dmSerifDisplay.className} text-4xl sm:text-5xl font-normal mb-6`}>
                    Society Events
                </h1>
                <p className={`${sourceSerif.className} text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto`}>
                    Discover our events, competitions, workshops, and more that bring mathematics to life.
                </p>
            </div>

            {/* Events timeline */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-20">
                    <p className={`${sourceSerif.className} text-lg text-gray-500 dark:text-gray-400`}>
                        No events found
                    </p>
                </div>
            ) : (
                <div className="relative">
                    {/* Timeline connector */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800/70 -translate-x-1/2 hidden md:block"></div>

                    <div className="space-y-12">
                        {years.map((year) => (
                            <div key={year} className="relative">
                                {/* Year marker */}
                                <div className="flex justify-center items-center mb-6">
                                    <div className={`${dmSerifDisplay.className} bg-blue-600 text-white py-1.5 px-8 rounded-full text-xl font-normal z-10 shadow-sm`}>
                                        {year}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {groupedEvents[year].map((event, index) => (
                                        <div key={event.id} className="relative group">
                                            {/* Timeline dot */}
                                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 hidden md:block z-10"></div>

                                            {/* Event card - alternating left and right */}
                                            <div className={`md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-8 md:ml-0' : 'md:ml-auto md:pl-8 md:mr-0'} relative`}>
                                                <BlogPostCard post={event} postType="event" hideUpcoming={true} />
                                            </div>

                                            {/* Preview text on hover - appears on the opposite side */}
                                            <div
                                                className={`
                                                    absolute top-0 
                                                    ${index % 2 === 0 ? 'md:left-[52%]' : 'md:right-[52%]'} 
                                                    md:w-5/12 
                                                    hidden md:block 
                                                    opacity-0 group-hover:opacity-100 
                                                    transition-all duration-800 ease-in-out
                                                    ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8'}
                                                    pointer-events-none
                                                    max-h-0 group-hover:max-h-[500px] overflow-hidden
                                                `}
                                            >
                                                <div className={`${sourceSerif.className} text-gray-600 dark:text-gray-300 py-2`}>
                                                    <p className="italic text-lg font-medium mb-3 text-blue-700 dark:text-blue-300">
                                                        {event.title}
                                                    </p>
                                                    <div className="text-sm prose-sm dark:prose-invert prose-p:my-2 whitespace-pre-wrap line-clamp-[15]">
                                                        {event.content}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}