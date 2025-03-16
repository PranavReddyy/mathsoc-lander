'use client';

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import BlogPostCard from "../../../components/BlogPostCard";
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

export default function CommunityServicePage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                // Create a query against the communitys collection, ordered by creation date
                const postsRef = collection(db, "communitys");
                const q = query(postsRef, orderBy("createdAt", "desc"));

                const querySnapshot = await getDocs(q);
                const postsList = [];

                querySnapshot.forEach((doc) => {
                    postsList.push({
                        id: doc.id,
                        ...doc.data(),
                        slug: doc.data().slug || doc.id
                    });
                });

                setPosts(postsList);
            } catch (error) {
                console.error("Error fetching community service posts:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h1 className={`${dmSerifDisplay.className} text-4xl sm:text-5xl font-normal mb-6`}>
                    Community Service
                </h1>
                <p className={`${sourceSerif.className} text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto`}>
                    Learn about our initiatives to serve the community through mathematics education and outreach.
                </p>
            </div>

            {/* Community service posts grid */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-20">
                    <p className={`${sourceSerif.className} text-lg text-gray-500 dark:text-gray-400`}>
                        No community service posts found
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <div key={post.id} className="transform transition-all duration-300 hover:-translate-y-1">
                            <BlogPostCard post={post} postType="community" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}