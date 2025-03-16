export async function generateMetadata({ params }) {
    const activityType = params.slug.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    return {
        title: activityType,
        description: `Learn about our ${activityType} activities and groups at MathSoc.`,
    };
}

// Add this default export component
export default function ActivityLayout({ children }) {
    return <>{children}</>;
}