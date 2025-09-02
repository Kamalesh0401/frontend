import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAppDispatch } from '../../hooks/hooks';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, Zap, MapPin, Camera, Star } from 'lucide-react';
import { RootState } from '../../store';
import { getMatches, addViewedProfile, removeMatch } from '../../store/slices/profileSlice';
import { ProfileService } from '../../services/ProfileService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const DiscoverPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { matches, isLoading } = useSelector((state: RootState) => state.profile);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageIndex, setImageIndex] = useState(0);

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-150, 0, 150], [-15, 0, 15]); // clamp between -15 and +15

    useEffect(() => {
        dispatch(getMatches());
    }, [dispatch]);

    const currentProfile = matches[currentIndex];

    const handleLike = async () => {
        if (!currentProfile) return;

        try {
            const result = await ProfileService.likeProfile(currentProfile.id);
            if (result.matched) {
                toast.success('🎉 It\'s a match!');
            } else {
                toast.success('Like sent!');
            }

            dispatch(addViewedProfile(currentProfile.id));
            dispatch(removeMatch(currentProfile.id));
            setCurrentIndex(prev => Math.min(prev, matches.length - 2));
            setImageIndex(0);
        } catch (error) {
            toast.error('Failed to like profile');
        }
    };

    const handlePass = async () => {
        if (!currentProfile) return;

        try {
            await ProfileService.passProfile(currentProfile.id);
            dispatch(addViewedProfile(currentProfile.id));
            dispatch(removeMatch(currentProfile.id));
            setCurrentIndex(prev => Math.min(prev, matches.length - 2));
            setImageIndex(0);
        } catch (error) {
            toast.error('Failed to pass profile');
        }
    };

    const handleDragEnd = (info: PanInfo) => {
        const threshold = 100;

        if (info.offset.x > threshold) {
            handleLike();
        } else if (info.offset.x < -threshold) {
            handlePass();
        }
    };

    const nextImage = () => {
        if (currentProfile && currentProfile.images.length > 1) {
            setImageIndex((prev) => (prev + 1) % currentProfile.images.length);
        }
    };

    const prevImage = () => {
        if (currentProfile && currentProfile.images.length > 1) {
            setImageIndex((prev) => (prev - 1 + currentProfile.images.length) % currentProfile.images.length);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner message="Finding amazing people for you..." />
            </div>
        );
    }

    if (matches.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No more profiles</h2>
                    <p className="text-gray-600 mb-6">Check back later for new people to connect with!</p>
                    <Button onClick={() => dispatch(getMatches())}>
                        Refresh
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-md mx-auto">
                <div className="relative h-[600px] perspective-1000">
                    <AnimatePresence>
                        {matches.slice(currentIndex, currentIndex + 3).map((profile, index) => (

                            <motion.div
                                key={profile.id}
                                className={`absolute inset-0 ${index === 0 ? "z-30" : index === 1 ? "z-20" : "z-10"}`}
                                style={{
                                    transform: `scale(${1 - index * 0.02}) translateY(${index * 4}px)`,
                                    x,   // bind horizontal drag
                                    rotate, // bind rotation based on drag
                                }}
                                drag={index === 0 ? "x" : false}
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={(_, info) => index === 0 && handleDragEnd(info)}
                                whileDrag={{
                                    scale: 1.02, // only scale is static
                                }}
                                exit={{
                                    x: Math.random() > 0.5 ? 300 : -300,
                                    opacity: 0,
                                    scale: 0.8,
                                    transition: { duration: 0.3 },
                                }}
                            >
                                <Card className="h-full overflow-hidden">
                                    {/* Image Section */}
                                    <div className="relative h-3/4 bg-gray-200">
                                        <img
                                            src={profile.images[imageIndex] || profile.images[0]}
                                            alt={`${profile.bio}`}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Image Navigation */}
                                        {profile.images.length > 1 && index === 0 && (
                                            <>
                                                <div className="absolute top-0 left-0 w-1/2 h-full z-10" onClick={prevImage} />
                                                <div className="absolute top-0 right-0 w-1/2 h-full z-10" onClick={nextImage} />

                                                {/* Image Indicators */}
                                                <div className="absolute top-4 left-4 right-4 flex space-x-1">
                                                    {profile.images.map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`flex-1 h-1 rounded-full ${i === imageIndex ? 'bg-white' : 'bg-white/30'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}

                                        {/* Premium Badge */}
                                        <div className="absolute top-4 right-4">
                                            <div className="bg-black/50 rounded-full p-2">
                                                <Zap className="h-4 w-4 text-yellow-400" />
                                            </div>
                                        </div>

                                        {/* Verified Badge */}
                                        {profile.verificationStatus === 'verified' && (
                                            <div className="absolute bottom-4 right-4">
                                                <div className="bg-blue-500 rounded-full p-1">
                                                    <Star className="h-3 w-3 text-white fill-current" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Profile Info */}
                                    <div className="p-4 h-1/4 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                Profile #{profile.id}, {profile.age}
                                            </h3>
                                            <div className="flex items-center text-gray-600 text-sm mt-1">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                <span>{profile.location.city}</span>
                                            </div>
                                            <p className="text-gray-700 text-sm mt-2 line-clamp-2">
                                                {profile.bio}
                                            </p>
                                        </div>

                                        {/* Interests */}
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {profile.interests.slice(0, 3).map((interest) => (
                                                <span
                                                    key={interest}
                                                    className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full"
                                                >
                                                    {interest}
                                                </span>
                                            ))}
                                            {profile.interests.length > 3 && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                                    +{profile.interests.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Action Buttons */}
                {currentProfile && (
                    <div className="flex justify-center items-center space-x-4 mt-6">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handlePass}
                            className="w-14 h-14 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center shadow-lg hover:border-red-300 hover:bg-red-50 transition-colors"
                        >
                            <X className="h-6 w-6 text-gray-600 hover:text-red-500" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toast('Super Like feature coming soon!')}
                            className="w-12 h-12 bg-white border-2 border-blue-300 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-50 transition-colors"
                        >
                            <Star className="h-5 w-5 text-blue-500" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleLike}
                            className="w-14 h-14 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <Heart className="h-6 w-6 text-white fill-current" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toast('Boost feature available with Premium!')}
                            className="w-12 h-12 bg-white border-2 border-purple-300 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-50 transition-colors"
                        >
                            <Zap className="h-5 w-5 text-purple-500" />
                        </motion.button>
                    </div>
                )}

                {/* Swipe Instructions */}
                <div className="text-center mt-4 text-gray-500 text-sm">
                    <p>Swipe right to like • Swipe left to pass</p>
                </div>
            </div>
        </div>
    );
};

export default DiscoverPage;