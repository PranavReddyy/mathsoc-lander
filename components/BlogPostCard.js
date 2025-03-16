import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, User, Clock, Tag } from "lucide-react";

export default function BlogPostCard({ post, postType }) {
    // Format date for display
    const formattedDate = post.date ? new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    }) : null;

    // Determine if event is upcoming
    const isUpcoming = post.date ? new Date(post.date) > new Date() : false;

    // Format timestamp for display
    const timestamp = post.createdAt ?
        new Date(post.createdAt.toDate()).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        }) : "Recent";

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
            {/* Image section */}
            <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                {post.mainImageUrl ? (
                    <Image
                        src={post.mainImageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
                        <span className="text-blue-500 dark:text-blue-400">{postType === 'event' ? 'Event' : 'Community Service'}</span>
                    </div>
                )}

                {/* Tag for upcoming events */}
                {postType === 'event' && isUpcoming && (
                    <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-medium">
                        Upcoming
                    </div>
                )}
            </div>

            {/* Content section */}
            <div className="flex flex-col flex-grow p-5">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                    {post.title}
                </h3>

                {/* Meta information */}
                <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-600 dark:text-gray-400">
                    {post.date && (
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formattedDate}</span>
                        </div>
                    )}

                    {post.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{post.location}</span>
                        </div>
                    )}

                    {post.author && (
                        <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{post.author}</span>
                        </div>
                    )}

                    {post.category && (
                        <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            <span>{post.category}</span>
                        </div>
                    )}
                </div>

                {/* Summary */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
                    {post.summary}
                </p>

                {/* Footer */}
                <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-xs text-gray-500 dark:text-gray-400">

                    </span>

                    <Link
                        href={postType === 'event'
                            ? `/events/${post.slug}`
                            : `/activities/community-service/${post.slug}`}
                        className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Read more →
                    </Link>
                </div>
            </div>
        </div>
    );
}