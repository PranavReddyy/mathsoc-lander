export async function generateMetadata({ params }) {
    const eventTitle = params.slug.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    return {
        title: eventTitle,
        description: `Details about ${eventTitle} - a MathSoc event at Mahindra University.`,
    };
}

// Add this default export component
export default function EventLayout({ children }) {
    return <>{children}</>;
}