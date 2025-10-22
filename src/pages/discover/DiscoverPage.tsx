// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useAppDispatch } from "../../hooks/hooks";
// import {
//   motion,
//   AnimatePresence,
//   PanInfo,
//   useMotionValue,
//   useTransform,
// } from "framer-motion";
// import { Heart, X, Zap, MapPin, Camera, Star } from "lucide-react";
// import { RootState } from "../../store";
// import {
//   getMatches,
//   addViewedProfile,
//   removeMatch,
// } from "../../store/slices/profileSlice";
// import { ProfileService } from "../../services/ProfileService";
// import Card from "../../components/ui/Card";
// import Button from "../../components/ui/Button";
// import LoadingSpinner from "../../components/ui/LoadingSpinner";
// import toast from "react-hot-toast";

// const DiscoverPage: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { matches, isLoading } = useSelector(
//     (state: RootState) => state.profile
//   );
//   const { user } = useSelector((state: RootState) => state.auth);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [imageIndex, setImageIndex] = useState(0);

//   const x = useMotionValue(0);
//   const rotate = useTransform(x, [-150, 0, 150], [-15, 0, 15]); // clamp between -15 and +15

//   useEffect(() => {
//     // Only call when we have a logged-in user id
//     if (user?.id) {
//       dispatch(getMatches({ userId: user.id }));
//     }
//   }, [dispatch, user?.id]);

//   const currentProfile = matches[currentIndex];

//   const handleLike = async () => {
//     if (!currentProfile) return;

//     try {
//       const result = await ProfileService.likeProfile(currentProfile.id);
//       if (result.matched) {
//         toast.success("🎉 It's a match!");
//       } else {
//         toast.success("Like sent!");
//       }

//       dispatch(addViewedProfile(currentProfile.id));
//       dispatch(removeMatch(currentProfile.id));
//       setCurrentIndex((prev) => Math.min(prev, matches.length - 2));
//       setImageIndex(0);
//     } catch (error) {
//       toast.error("Failed to like profile");
//     }
//   };

//   const handlePass = async () => {
//     if (!currentProfile) return;

//     try {
//       await ProfileService.passProfile(currentProfile.id);
//       dispatch(addViewedProfile(currentProfile.id));
//       dispatch(removeMatch(currentProfile.id));
//       setCurrentIndex((prev) => Math.min(prev, matches.length - 2));
//       setImageIndex(0);
//     } catch (error) {
//       toast.error("Failed to pass profile");
//     }
//   };

//   const handleDragEnd = (info: PanInfo) => {
//     const threshold = 100;

//     if (info.offset.x > threshold) {
//       handleLike();
//     } else if (info.offset.x < -threshold) {
//       handlePass();
//     }
//   };

//   const nextImage = () => {
//     if (currentProfile && currentProfile.images.length > 1) {
//       setImageIndex((prev) => (prev + 1) % currentProfile.images.length);
//     }
//   };

//   const prevImage = () => {
//     if (currentProfile && currentProfile.images.length > 1) {
//       setImageIndex(
//         (prev) =>
//           (prev - 1 + currentProfile.images.length) %
//           currentProfile.images.length
//       );
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <LoadingSpinner message="Finding amazing people for you..." />
//       </div>
//     );
//   }

//   if (matches.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="text-center">
//           <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">
//             No more profiles
//           </h2>
//           <p className="text-gray-600 mb-6">
//             Check back later for new people to connect with!
//           </p>
//           <button
//             onClick={() =>
//               user?.id && dispatch(getMatches({ userId: user.id }))
//             }
//           >
//             Refresh
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-md mx-auto">
//         <div className="relative h-[600px] perspective-1000">
//           <AnimatePresence>
//             {matches
//               .slice(currentIndex, currentIndex + 3)
//               .map((profile, index) => (
//                 <motion.div
//                   key={profile.id}
//                   className={`absolute inset-0 ${
//                     index === 0 ? "z-30" : index === 1 ? "z-20" : "z-10"
//                   }`}
//                   style={{
//                     transform: `scale(${1 - index * 0.02}) translateY(${
//                       index * 4
//                     }px)`,
//                     x, // bind horizontal drag
//                     rotate, // bind rotation based on drag
//                   }}
//                   drag={index === 0 ? "x" : false}
//                   dragConstraints={{ left: 0, right: 0 }}
//                   onDragEnd={(_, info) => index === 0 && handleDragEnd(info)}
//                   whileDrag={{
//                     scale: 1.02, // only scale is static
//                   }}
//                   exit={{
//                     x: Math.random() > 0.5 ? 300 : -300,
//                     opacity: 0,
//                     scale: 0.8,
//                     transition: { duration: 0.3 },
//                   }}
//                 >
//                   <Card className="h-full overflow-hidden">
//                     {/* Image Section */}
//                     <div className="relative h-3/4 bg-gray-200">
//                       <img
//                         src={profile?.images || profile?.images}
//                         alt={`${profile.bio}`}
//                         className="w-full h-full object-cover"
//                       />

//                       {/* Image Navigation */}
//                       {profile.images !== "" && index === 0 && (
//                         <>
//                           <div
//                             className="absolute top-0 left-0 w-1/2 h-full z-10"
//                             onClick={prevImage}
//                           />
//                           <div
//                             className="absolute top-0 right-0 w-1/2 h-full z-10"
//                             onClick={nextImage}
//                           />

//                           {/* Image Indicators */}
//                           <div className="absolute top-4 left-4 right-4 flex space-x-1">
//                             {/* {profile.images.map((_, i) => (
//                               <div
//                                 key={i}
//                                 className={`flex-1 h-1 rounded-full ${
//                                   i === imageIndex ? "bg-white" : "bg-white/30"
//                                 }`}
//                               />
//                             ))} */}
//                           </div>
//                         </>
//                       )}

//                       {/* Premium Badge */}
//                       <div className="absolute top-4 right-4">
//                         <div className="bg-black/50 rounded-full p-2">
//                           <Zap className="h-4 w-4 text-yellow-400" />
//                         </div>
//                       </div>

//                       {/* Verified Badge */}
//                       {profile.verificationStatus === "verified" && (
//                         <div className="absolute bottom-4 right-4">
//                           <div className="bg-blue-500 rounded-full p-1">
//                             <Star className="h-3 w-3 text-white fill-current" />
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     {/* Profile Info */}
//                     <div className="p-4 h-1/4 flex flex-col justify-between">
//                       <div>
//                         <h3 className="text-xl font-bold text-gray-900">
//                           Profile #{profile.id}, {profile.age}
//                         </h3>
//                         <div className="flex items-center text-gray-600 text-sm mt-1">
//                           <MapPin className="h-4 w-4 mr-1" />
//                           <span>{profile.location.city}</span>
//                         </div>
//                         <p className="text-gray-700 text-sm mt-2 line-clamp-2">
//                           {profile.bio}
//                         </p>
//                       </div>

//                       {/* Interests */}
//                       <div className="flex flex-wrap gap-1 mt-2">
//                         {profile.interests.slice(0, 3).map((interest) => (
//                           <span
//                             key={interest}
//                             className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full"
//                           >
//                             {interest}
//                           </span>
//                         ))}
//                         {profile.interests.length > 3 && (
//                           <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
//                             +{profile.interests.length - 3} more
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </Card>
//                 </motion.div>
//               ))}
//           </AnimatePresence>
//         </div>

//         {/* Action Buttons */}
//         {currentProfile && (
//           <div className="flex justify-center items-center space-x-4 mt-6">
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={handlePass}
//               className="w-14 h-14 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center shadow-lg hover:border-red-300 hover:bg-red-50 transition-colors"
//             >
//               <X className="h-6 w-6 text-gray-600 hover:text-red-500" />
//             </motion.button>

//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => toast("Super Like feature coming soon!")}
//               className="w-12 h-12 bg-white border-2 border-blue-300 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-50 transition-colors"
//             >
//               <Star className="h-5 w-5 text-blue-500" />
//             </motion.button>

//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={handleLike}
//               className="w-14 h-14 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
//             >
//               <Heart className="h-6 w-6 text-white fill-current" />
//             </motion.button>

//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => toast("Boost feature available with Premium!")}
//               className="w-12 h-12 bg-white border-2 border-purple-300 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-50 transition-colors"
//             >
//               <Zap className="h-5 w-5 text-purple-500" />
//             </motion.button>
//           </div>
//         )}

//         {/* Swipe Instructions */}
//         <div className="text-center mt-4 text-gray-500 text-sm">
//           <p>Swipe right to like • Swipe left to pass</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DiscoverPage;

// src/pages/Discover/DiscoverPage.tsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  PanInfo,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  Heart,
  X,
  Zap,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { RootState } from "../../store";
import { getMatches, removeMatch } from "../../store/slices/profileSlice";
import { ProfileService } from "../../services/ProfileService";
import toast from "react-hot-toast";

interface Profile {
  id: string;
  userId: string;
  bio: string;
  age: number;
  location: {
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  interests: string[];
  lookingFor: "relationship" | "dating" | "friends" | "networking";
  completionPercentage: number;
  isVisible: boolean;
  verificationStatus: "pending" | "verified" | "rejected";
  preferences: {
    ageRange: [number, number];
    maxDistance: number;
    showOnlineOnly: boolean;
  };
}

const DiscoverPage: React.FC = () => {
  const dispatch = useDispatch();
  const { matches, isLoading } = useSelector(
    (state: RootState) => state.profile
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 0, 150], [-25, 0, 25]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

  useEffect(() => {
    if (user?.id) {
      dispatch(getMatches({ userId: user.id }) as any);
    }
  }, [dispatch, user?.id]);

  const currentProfile = matches[currentIndex] as Profile;

  const handleLike = async () => {
    if (!currentProfile || likeLoading) return;

    setLikeLoading(true);
    try {
      const result = await ProfileService.likeProfile(currentProfile.id);
      if (result.matched) {
        toast.success("🎉 It's a match!");
      } else {
        toast.success("❤️ Like sent!");
      }

      // Remove from matches list
      dispatch(removeMatch(currentProfile.id) as any);
      setImageIndex(0);
    } catch (error: any) {
      toast.error(error.message || "Failed to like profile");
    } finally {
      setLikeLoading(false);
    }
  };

  const handlePass = async () => {
    if (!currentProfile || passLoading) return;

    setPassLoading(true);
    try {
      await ProfileService.passProfile(currentProfile.id);
      toast.success("Profile skipped");

      // Remove from matches list
      dispatch(removeMatch(currentProfile.id) as any);
      setImageIndex(0);
    } catch (error: any) {
      toast.error(error.message || "Failed to pass profile");
    } finally {
      setPassLoading(false);
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;

    if (info.offset.x > threshold) {
      handleLike();
    } else if (info.offset.x < -threshold) {
      handlePass();
    }
  };

  const handleClick = () => {
    const chatId = `user?.id`;
    toast.success("Boost available with Premium!");
    setTimeout(() => navigate(`/chat/${chatId}`), 1500);
  };

  const nextImage = () => {
    if (currentProfile?.images && currentProfile.images.length > 1) {
      setImageIndex((prev) => (prev + 1) % currentProfile.images.length);
    }
  };

  const prevImage = () => {
    if (currentProfile?.images && currentProfile.images.length > 1) {
      setImageIndex(
        (prev) =>
          (prev - 1 + currentProfile.images.length) %
          currentProfile.images.length
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Finding amazing people for you...
          </p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <Heart className="h-20 w-20 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            No more profiles
          </h2>
          <p className="text-gray-600 mb-8">
            You've checked out everyone nearby. Check back later for new people!
          </p>
          <button
            onClick={() =>
              user?.id && dispatch(getMatches({ userId: user.id }) as any)
            }
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 pb-32">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Discover People
          </h1>
          <p className="text-gray-600">
            {matches.length - currentIndex} profile
            {matches.length - currentIndex !== 1 ? "s" : ""} remaining
          </p>
        </div>

        {/* Card Stack */}
        <div className="relative h-[680px] mb-8">
          <AnimatePresence mode="wait">
            {matches
              .slice(currentIndex, currentIndex + 3)
              .map((profile: any, index: number) => (
                <motion.div
                  key={profile.id}
                  className={`absolute inset-0 ${
                    index === 0
                      ? "z-30 cursor-grab active:cursor-grabbing"
                      : index === 1
                      ? "z-20"
                      : "z-10"
                  }`}
                  initial={{ scale: 1 - index * 0.025, y: index * 12 }}
                  style={
                    index === 0
                      ? {
                          x,
                          rotate,
                          opacity,
                        }
                      : { scale: 1 - index * 0.025, y: index * 12 }
                  }
                  drag={index === 0 ? "x" : false}
                  dragConstraints={{ left: -200, right: 200 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => index === 0 && handleDragEnd(_, info)}
                  whileDrag={{ scale: 1.02 }}
                  exit={{
                    x: Math.random() > 0.5 ? 500 : -500,
                    opacity: 0,
                    scale: 0.8,
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-white">
                    {/* Image Section */}
                    <div className="relative w-full h-4/5 bg-gray-200">
                      {profile.images && profile.images.length > 0 ? (
                        <img
                          src={profile.images[index === 0 ? imageIndex : 0]}
                          alt={profile.bio}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/400x600?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300">
                          <p className="text-gray-600 font-medium">
                            No image available
                          </p>
                        </div>
                      )}

                      {/* Image Navigation - Only for front card */}
                      {index === 0 &&
                        profile.images &&
                        profile.images.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-0 top-0 w-1/3 h-full z-10 hover:bg-black/5 transition-all flex items-center justify-start pl-2"
                              aria-label="Previous image"
                            >
                              <ChevronLeft className="w-8 h-8 text-white drop-shadow-lg" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-0 top-0 w-1/3 h-full z-10 hover:bg-black/5 transition-all flex items-center justify-end pr-2"
                              aria-label="Next image"
                            >
                              <ChevronRight className="w-8 h-8 text-white drop-shadow-lg" />
                            </button>

                            {/* Image Indicators */}
                            <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
                              {profile.images.map((_: any, i: number) => (
                                <div
                                  key={i}
                                  className={`flex-1 h-1 rounded-full transition-all ${
                                    i === imageIndex
                                      ? "bg-white shadow-lg"
                                      : "bg-white/40"
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}

                      {/* Badges */}
                      <div className="absolute top-4 right-4 flex gap-2 z-20">
                        {profile.verificationStatus === "verified" && (
                          <div className="bg-blue-500 backdrop-blur rounded-full p-2">
                            <Star className="w-4 h-4 text-white fill-white" />
                          </div>
                        )}
                      </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
                    </div>

                    {/* Profile Info Section */}
                    <div className="p-6 h-1/5 flex flex-col justify-between bg-white">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {profile.bio}, {profile.age}
                        </h3>
                        <div className="flex items-center text-gray-600 text-sm mb-3">
                          <MapPin className="w-4 h-4 mr-2 text-pink-500 flex-shrink-0" />
                          <span>
                            {profile.location?.city},{" "}
                            {profile.location?.country}
                          </span>
                        </div>
                        <p className="text-gray-700 text-xs line-clamp-1">
                          {profile.lookingFor &&
                            `Looking for ${profile.lookingFor}`}
                        </p>
                      </div>

                      {/* Interests */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {profile.interests
                          ?.slice(0, 3)
                          .map((interest: string) => (
                            <span
                              key={interest}
                              className="px-3 py-1 bg-pink-100 text-pink-700 text-xs rounded-full font-medium"
                            >
                              {interest}
                            </span>
                          ))}
                        {profile.interests && profile.interests.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{profile.interests.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        {currentProfile && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex justify-center items-center gap-6 z-40">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePass}
              disabled={passLoading}
              className="w-16 h-16 bg-white border-3 border-gray-300 rounded-full flex items-center justify-center shadow-lg hover:border-red-400 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Pass"
            >
              <X className="w-7 h-7 text-gray-600" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toast.success("Super Like coming soon!")}
              className="w-14 h-14 bg-white border-3 border-blue-400 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-50 transition-all"
              title="Super Like"
            >
              <Star className="w-6 h-6 text-blue-500" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              disabled={likeLoading}
              className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Like"
            >
              {likeLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Heart className="w-7 h-7 text-white fill-white" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClick}
              className="w-14 h-14 bg-white border-3 border-purple-400 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-50 transition-all"
              title="Boost"
            >
              <Zap className="w-6 h-6 text-purple-500" />
            </motion.button>
          </div>
        )}

        {/* Swipe Instructions */}
        <div className="text-center mt-24 text-gray-500 text-sm px-4">
          <p>Swipe right to like • Swipe left to pass</p>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
