'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { collection, query, getDocs, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../../../lib/firebase';
import { ref, deleteObject } from 'firebase/storage';
import { Trash2, Calendar, Clock, MapPin } from 'lucide-react';
import { Input } from '../../../components/ui/input';

export default function AdminDashboard() {
    const { currentUser, logout } = useAuth();
    const router = useRouter();
    const [events, setEvents] = useState([]);
    const [communityPosts, setCommunityPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [upcomingAlerts, setUpcomingAlerts] = useState([]);
    const [newAlertTitle, setNewAlertTitle] = useState('');
    const [newAlertDate, setNewAlertDate] = useState('');
    const [newAlertTime, setNewAlertTime] = useState('');
    const [newAlertLocation, setNewAlertLocation] = useState('');
    const [newAlertLink, setNewAlertLink] = useState('');
    const [newAlertPrizepool, setNewAlertPrizepool] = useState('');

    async function handleLogout() {
        try {
            await logout();
            router.push('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    useEffect(() => {
        async function fetchContent() {
            try {
                // Fetch events
                const eventsQuery = query(collection(db, 'events'));
                const eventSnapshot = await getDocs(eventsQuery);
                const eventsList = eventSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setEvents(eventsList);

                // Fetch community posts
                const communityQuery = query(collection(db, 'communitys'));
                const communitySnapshot = await getDocs(communityQuery);
                const communityList = communitySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCommunityPosts(communityList);

                try {
                    const alertsQuery = query(collection(db, 'upcomingAlerts'));
                    const alertsSnapshot = await getDocs(alertsQuery);
                    const alertsList = alertsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        dateString: doc.data().date?.toDate().toISOString().split('T')[0] || '',
                        timeString: doc.data().date?.toDate().toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        }) || ''
                    }));
                    setUpcomingAlerts(alertsList);
                } catch (error) {
                    console.error("Error fetching alerts:", error);
                    setUpcomingAlerts([]);
                }
            } catch (error) {
                console.error("Error fetching content:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchContent();
    }, []);

    // Add this function to add a new alert
    const handleAddUpcomingAlert = async (e) => {
        e.preventDefault();

        if (!newAlertTitle) {
            alert('Please fill in the title field');
            return;
        }

        try {
            // Create alert data object
            const alertData = {
                title: newAlertTitle,
                createdAt: serverTimestamp()
            };

            // Add optional fields if they exist
            if (newAlertLocation) {
                alertData.location = newAlertLocation;
            }

            if (newAlertLink) {
                alertData.link = newAlertLink;
            }

            if (newAlertPrizepool) {
                alertData.prizepool = newAlertPrizepool;
            }

            // Only add date if both date and time are provided
            if (newAlertDate && newAlertTime) {
                const dateTime = new Date(`${newAlertDate}T${newAlertTime}`);
                alertData.date = dateTime;
            }

            // Add the alert to Firestore
            const docRef = await addDoc(collection(db, 'upcomingAlerts'), alertData);

            // Add to local state
            setUpcomingAlerts([...upcomingAlerts, {
                id: docRef.id,
                title: newAlertTitle,
                ...(newAlertLocation && { location: newAlertLocation }),
                ...(newAlertLink && { link: newAlertLink }),
                ...(newAlertPrizepool && { prizepool: newAlertPrizepool }),
                ...(newAlertDate && newAlertTime && {
                    date: new Date(`${newAlertDate}T${newAlertTime}`),
                    dateString: newAlertDate,
                    timeString: newAlertTime
                })
            }]);

            // Reset form
            setNewAlertTitle('');
            setNewAlertDate('');
            setNewAlertTime('');
            setNewAlertLocation('');
            setNewAlertLink('');
            setNewAlertPrizepool('');

            setDeleteMessage('Upcoming alert added successfully');
            setTimeout(() => setDeleteMessage(''), 3000);
        } catch (error) {
            console.error("Error adding upcoming alert:", error);
            alert('Failed to add upcoming alert');
        }
    };

    // Add this function to delete an alert
    const handleDeleteAlert = async (id) => {
        if (!confirm("Are you sure you want to delete this upcoming alert?")) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'upcomingAlerts', id));
            setUpcomingAlerts(upcomingAlerts.filter(alert => alert.id !== id));

            setDeleteMessage('Upcoming alert deleted successfully');
            setTimeout(() => setDeleteMessage(''), 3000);
        } catch (error) {
            console.error("Error deleting alert:", error);
            alert('Failed to delete alert');
        }
    };

    const handleDelete = async (id, type, images) => {
        if (!confirm(`Are you sure you want to delete this ${type}?`)) {
            return;
        }

        try {
            // Delete document
            await deleteDoc(doc(db, `${type}s`, id));

            // Delete associated images
            if (images.mainImageUrl) {
                try {
                    const mainImageRef = ref(storage, images.mainImageUrl);
                    await deleteObject(mainImageRef);
                } catch (e) {
                    console.log("Main image may already be deleted or inaccessible");
                }
            }

            if (images.additionalImageUrls && images.additionalImageUrls.length > 0) {
                for (const imageUrl of images.additionalImageUrls) {
                    try {
                        const imageRef = ref(storage, imageUrl);
                        await deleteObject(imageRef);
                    } catch (e) {
                        console.log("Additional image may already be deleted or inaccessible");
                    }
                }
            }

            // Update the state to remove the deleted item
            if (type === 'event') {
                setEvents(events.filter(event => event.id !== id));
            } else {
                setCommunityPosts(communityPosts.filter(post => post.id !== id));
            }

            setDeleteMessage(`${type === 'event' ? 'Event' : 'Community post'} successfully deleted.`);
            setTimeout(() => setDeleteMessage(''), 3000);

        } catch (error) {
            console.error("Error deleting content:", error);
            alert(`Failed to delete. Please try again.`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div>
                    <span className="mr-4 text-sm text-gray-600 dark:text-gray-300">
                        Signed in as: {currentUser?.email}
                    </span>
                    <Button variant="outline" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-all">
                    <h2 className="text-xl font-semibold mb-3">Create New Event</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Add a new event to be displayed on the events timeline.
                    </p>
                    <Button onClick={() => router.push('/admin/publish?type=event')}>
                        Create Event
                    </Button>
                </div>

                <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-all">
                    <h2 className="text-xl font-semibold mb-3">Create Community Service Post</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Add a new community service post to the website.
                    </p>
                    <Button onClick={() => router.push('/admin/publish?type=community')}>
                        Create Post
                    </Button>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-6">Manage Content</h2>

                {deleteMessage && (
                    <Alert className="mb-4 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                        <AlertDescription>{deleteMessage}</AlertDescription>
                    </Alert>
                )}

                <Tabs defaultValue="events">
                    <TabsList className="mb-4">
                        <TabsTrigger value="events">Events</TabsTrigger>
                        <TabsTrigger value="community">Community Posts</TabsTrigger>
                        <TabsTrigger value="alerts">Upcoming Alerts</TabsTrigger>
                    </TabsList>

                    <TabsContent value="events">
                        {isLoading ? (
                            <p className="text-center py-8 text-gray-500">Loading events...</p>
                        ) : events.length === 0 ? (
                            <p className="text-center py-8 text-gray-500">No events found.</p>
                        ) : (
                            <div className="space-y-4">
                                {events.map(event => (
                                    <div key={event.id} className="flex justify-between items-center p-4 border rounded-lg">
                                        <div>
                                            <h3 className="font-medium">{event.title}</h3>
                                            <p className="text-sm text-gray-500">
                                                {event.date ? new Date(event.date).toLocaleDateString() : 'No date'}
                                                {event.location && ` • ${event.location}`}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                            onClick={() => handleDelete(event.id, 'event', {
                                                mainImageUrl: event.mainImageUrl,
                                                additionalImageUrls: event.additionalImageUrls
                                            })}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="community">
                        {isLoading ? (
                            <p className="text-center py-8 text-gray-500">Loading community posts...</p>
                        ) : communityPosts.length === 0 ? (
                            <p className="text-center py-8 text-gray-500">No community posts found.</p>
                        ) : (
                            <div className="space-y-4">
                                {communityPosts.map(post => (
                                    <div key={post.id} className="flex justify-between items-center p-4 border rounded-lg">
                                        <div>
                                            <h3 className="font-medium">{post.title}</h3>
                                            <p className="text-sm text-gray-500">
                                                {post.author && `By ${post.author}`}
                                                {post.category && ` • ${post.category}`}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                            onClick={() => handleDelete(post.id, 'community', {
                                                mainImageUrl: post.mainImageUrl,
                                                additionalImageUrls: post.additionalImageUrls
                                            })}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="alerts" id="alertSection">
                        <div className="border rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-medium mb-4">Add New Alert</h3>

                            <form onSubmit={handleAddUpcomingAlert} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Title*
                                        </label>
                                        <Input
                                            value={newAlertTitle}
                                            onChange={(e) => setNewAlertTitle(e.target.value)}
                                            placeholder="Enter event title"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Location
                                        </label>
                                        <Input
                                            value={newAlertLocation}
                                            onChange={(e) => setNewAlertLocation(e.target.value)}
                                            placeholder="Enter location"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Date
                                        </label>
                                        <Input
                                            type="date"
                                            value={newAlertDate}
                                            onChange={(e) => setNewAlertDate(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Time
                                        </label>
                                        <Input
                                            type="time"
                                            value={newAlertTime}
                                            onChange={(e) => setNewAlertTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Redirect Link
                                    </label>
                                    <Input
                                        value={newAlertLink}
                                        onChange={(e) => setNewAlertLink(e.target.value)}
                                        placeholder="e.g., /events/upcoming-event"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Prize Pool (optional)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                                        <Input
                                            type="number"
                                            value={newAlertPrizepool}
                                            onChange={(e) => setNewAlertPrizepool(e.target.value)}
                                            placeholder="e.g., 5000"
                                            className="pl-7"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Leave empty if not applicable</p>
                                </div>

                                <Button type="submit">
                                    Add Alert
                                </Button>
                            </form>
                        </div>

                        <h3 className="text-lg font-medium mb-4">Current Alerts</h3>

                        {upcomingAlerts.length === 0 ? (
                            <p className="text-center py-4 text-gray-500">No alerts found.</p>
                        ) : (
                            <div className="space-y-4">
                                {upcomingAlerts.map(alert => (
                                    <div key={alert.id} className="flex justify-between items-center p-4 border rounded-lg">
                                        <div>
                                            <div className="flex items-center">
                                                <h4 className="font-medium">{alert.title}</h4>
                                                {alert.prizepool && (
                                                    <span className="ml-2 text-xs font-medium text-amber-600 px-2 py-0.5 bg-amber-50 rounded-full">
                                                        ₹{alert.prizepool}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-x-4 mt-1">
                                                {alert.date ? (
                                                    <>
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Calendar className="h-3.5 w-3.5 mr-1" />
                                                            {new Date(alert.date?.seconds * 1000).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Clock className="h-3.5 w-3.5 mr-1" />
                                                            {new Date(alert.date?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex items-center text-sm italic text-gray-500">
                                                        Coming soon
                                                    </div>
                                                )}
                                                {alert.location && (
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <MapPin className="h-3.5 w-3.5 mr-1" />
                                                        {alert.location}
                                                    </div>
                                                )}
                                                {alert.link && (
                                                    <div className="flex items-center text-sm text-blue-500">
                                                        <span className="mx-1">→</span>
                                                        <span className="truncate max-w-[150px]">
                                                            {alert.link}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                            onClick={() => handleDeleteAlert(alert.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}