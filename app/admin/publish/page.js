'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { db, storage } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { AlertCircle, ArrowLeft, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function PublishPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const postType = searchParams.get('type') || 'event'; // Default to event
    const { currentUser } = useAuth();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [location, setLocation] = useState('');
    const [author, setAuthor] = useState('');
    const [summary, setSummary] = useState('');
    const [category, setCategory] = useState('');
    const [mainImage, setMainImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);
    const [mainImagePreview, setMainImagePreview] = useState('');
    const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (mainImage) {
            const objectUrl = URL.createObjectURL(mainImage);
            setMainImagePreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [mainImage]);

    useEffect(() => {
        const previews = [];
        additionalImages.forEach(file => {
            const objectUrl = URL.createObjectURL(file);
            previews.push(objectUrl);
        });
        setAdditionalImagePreviews(previews);

        return () => {
            previews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [additionalImages]);

    const handleMainImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setMainImage(e.target.files[0]);
        }
    };

    const handleAdditionalImagesChange = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            // If they select less than 5 images, show an error
            if (files.length !== 5) {
                setError('Please select exactly 5 additional images');
                return;
            }
            setAdditionalImages(files);
            setError(''); // Clear any previous error
        }
    };

    const uploadImage = async (image, index = '') => {
        if (!image) return null;

        // Create path that matches your storage rules
        const imagePath = postType === 'event'
            ? `event_images/${uuidv4()}${index ? `_${index}` : ''}`
            : `community_images/${uuidv4()}${index ? `_${index}` : ''}`;

        console.log(`Uploading to path: ${imagePath}`);
        const storageRef = ref(storage, imagePath);
        const uploadTask = uploadBytesResumable(storageRef, image);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Progress tracking
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload progress: ${progress.toFixed(1)}%`);
                },
                (error) => {
                    console.error('Upload error:', error);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {
                            console.log(`Upload complete, URL: ${downloadURL}`);
                            resolve(downloadURL);
                        })
                        .catch((urlError) => {
                            console.error('Error getting download URL:', urlError);
                            reject(urlError);
                        });
                }
            );
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Check required fields
        if (!title || !content || !summary || !author || !category || !mainImage) {
            setError('Please fill in all required fields');
            return;
        }

        // Validate exactly 5 additional images
        if (additionalImages.length !== 5) {
            setError('Please select exactly 5 additional images');
            return;
        }

        // Additional validation for events
        if ((!eventDate || !location)) {
            setError('Date and location are required');
            return;
        }

        setLoading(true);

        try {
            console.log("Starting upload process...");

            // Upload main image
            console.log("Uploading main image...");
            const mainImageUrl = await uploadImage(mainImage, 'main');
            console.log("Main image uploaded successfully");

            // Upload additional images
            console.log("Uploading additional images...");
            const additionalImageUrls = [];

            for (let i = 0; i < additionalImages.length; i++) {
                console.log(`Uploading additional image ${i + 1} of 5...`);
                const imageUrl = await uploadImage(additionalImages[i], i);
                if (imageUrl) {
                    additionalImageUrls.push(imageUrl);
                    console.log(`Additional image ${i + 1} uploaded successfully`);
                } else {
                    throw new Error(`Failed to get URL for additional image ${i + 1}`);
                }
            }

            if (additionalImageUrls.length !== 5) {
                throw new Error(`Only ${additionalImageUrls.length} of 5 images were successfully uploaded`);
            }

            // Generate a slug from the title
            const slug = title
                .toLowerCase()
                .replace(/[^\w\s]/gi, '')
                .replace(/\s+/g, '-');

            console.log("Creating Firestore document...");

            // Create the document
            const docRef = await addDoc(collection(db, `${postType}s`), {
                title,
                content,
                summary,
                slug,
                mainImageUrl,
                additionalImageUrls,
                author,
                createdAt: serverTimestamp(),
                createdBy: currentUser.uid,
                date: eventDate,
                location: location,
                category: category,
            });

            console.log(`Document created with ID: ${docRef.id}`);
            setSuccess(`${postType === 'event' ? 'Event' : 'Community service post'} published successfully!`);

            // Reset form
            setTitle('');
            setContent('');
            setSummary('');
            setEventDate('');
            setLocation('');
            setAuthor('');
            setCategory('');
            setMainImage(null);
            setMainImagePreview('');
            setAdditionalImages([]);
            setAdditionalImagePreviews([]);

            console.log("Redirecting to dashboard in 2 seconds...");
            setTimeout(() => {
                router.push('/admin/dashboard');
            }, 2000);

        } catch (error) {
            console.error('Error publishing post:', error);
            setError(`Failed to publish: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Button
                variant="ghost"
                className="mb-6 flex items-center"
                onClick={() => router.push('/admin/dashboard')}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Publish {postType === 'event' ? 'Event' : 'Community Service Post'}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Fill in the details below to publish your content
                </p>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="mb-6 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <Label htmlFor="title">Title*</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title"
                        required
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="summary">Summary*</Label>
                    <Textarea
                        id="summary"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Brief summary of the post"
                        className="mt-1 h-20"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="content">Content*</Label>
                    <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter full content"
                        required
                        className="mt-1 h-60"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="author">Author*</Label>
                        <Input
                            id="author"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Author name"
                            className="mt-1"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="category">Category*</Label>
                        <Input
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Category (e.g., Seminar, Workshop)"
                            className="mt-1"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="eventDate">Date*</Label>
                        <Input
                            id="eventDate"
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className="mt-1"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="location">Location*</Label>
                        <Input
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Location"
                            className="mt-1"
                            required
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="mainImage">Main Image*</Label>
                    <div className="mt-2 flex items-center gap-4">
                        <Input
                            id="mainImage"
                            type="file"
                            accept="image/*"
                            onChange={handleMainImageChange}
                            className="w-auto"
                            required
                        />
                        {mainImagePreview && (
                            <div className="w-24 h-24 relative border rounded overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={mainImagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <Label htmlFor="additionalImages">Additional Images (Exactly 5 required)*</Label>
                    <div className="mt-2">
                        <Input
                            id="additionalImages"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleAdditionalImagesChange}
                            required
                        />
                        {additionalImagePreviews.length > 0 && additionalImagePreviews.length !== 5 && (
                            <p className="text-red-500 text-sm mt-1">Please select exactly 5 images (you selected {additionalImagePreviews.length})</p>
                        )}
                        {additionalImagePreviews.length > 0 && (
                            <div className="mt-4 flex gap-2 flex-wrap">
                                {additionalImagePreviews.map((url, index) => (
                                    <div key={index} className="w-20 h-20 relative border rounded overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={url}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <Button
                        type="submit"
                        className="mr-4"
                        disabled={loading || additionalImages.length !== 5 || !title || !content || !summary || !author || !category || !mainImage}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            'Publish'
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/admin/dashboard')}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}