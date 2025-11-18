import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Edit,
  MapPin,
  Heart,
  X,
  Check,
  Camera,
  User,
  Mail,
  Sparkles,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  Search,
  Plus,
  Trash2,
  Lock,
  Eye,
  Calendar,
  Briefcase,
  MessageCircle,
  Shield,
  Award,
} from "lucide-react";

// Mock Redux types - replace with your actual types
interface RootState {
  auth: { user: { id: string; email?: string; username?: string } | null };
  profile: {
    profile: UserProfile | null;
    isLoading: boolean;
    matches: UserProfile[];
  };
}

interface AppDispatch {
  (action: any): any;
}

interface UserProfile {
  _id?: string;
  id?: string;
  userId?: string;
  username?: string;
  email?: string;
  firstName?: string;
  bio?: string;
  age?: number;
  gender?: string;
  location?: {
    city?: string;
    country?: string;
  };
  images?: string[];
  interests?: string[];
  lookingFor?: string;
  completionPercentage?: number;
  verificationStatus?: string;
}

// Mock services - replace with actual imports
const ProfileService = {
  uploadImage: async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(URL.createObjectURL(file)), 1000);
    });
  },
  likeProfile: async (id: string) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ matched: Math.random() > 0.5 }), 500);
    });
  },
  passProfile: async (id: string) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 500);
    });
  },
};

const mockDispatch = (action: any) => {
  console.log("Mock dispatch:", action);
  return Promise.resolve({ payload: {} });
};

const mockSelector = (selector: any) => {
  return selector({
    auth: {
      user: { id: "123", email: "user@example.com", username: "johndoe" },
    },
    profile: {
      profile: {
        id: "123",
        userId: "123",
        username: "johndoe",
        email: "user@example.com",
        bio: "Adventure seeker and coffee enthusiast",
        age: 28,
        gender: "Male",
        location: { city: "Mumbai", country: "India" },
        images: [
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        ],
        interests: ["Travel", "Photography", "Music", "Hiking"],
        lookingFor: "relationship",
        verificationStatus: "verified",
        completionPercentage: 85,
      },
      isLoading: false,
      matches: [
        {
          id: "m1",
          bio: "Love to explore new places",
          age: 26,
          location: { city: "Mumbai" },
          images: [
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
          ],
          verificationStatus: "verified",
        },
        {
          id: "m2",
          bio: "Fitness enthusiast and foodie",
          age: 29,
          location: { city: "Pune" },
          images: [
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
          ],
          verificationStatus: "pending",
        },
      ],
    },
  });
};

const SmallSpinner = () => (
  <svg className="w-5 h-5 animate-spin text-white" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

const Notification: React.FC<{
  notif: { type: "success" | "error"; message: string };
  onClose: () => void;
}> = ({ notif, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -50, scale: 0.9 }}
    className="fixed top-4 right-4 z-50 max-w-md"
    onAnimationComplete={() => setTimeout(onClose, 3000)}
  >
    <div
      className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl border-2 ${
        notif.type === "success"
          ? "bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white border-green-300"
          : "bg-gradient-to-r from-red-500/90 to-pink-500/90 text-white border-red-300"
      }`}
    >
      {notif.type === "success" ? (
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <Check className="w-5 h-5" />
        </div>
      ) : (
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <AlertCircle className="w-5 h-5" />
        </div>
      )}
      <span className="font-semibold flex-1">{notif.message}</span>
      <button
        onClick={onClose}
        className="hover:bg-white/20 p-1 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </motion.div>
);

const ProfilePage: React.FC = () => {
  // Use mock versions for demo - replace with actual Redux hooks
  const dispatch = mockDispatch as any;
  const { user } = mockSelector((state: RootState) => state.auth);
  const { profile, isLoading, matches } = mockSelector(
    (state: RootState) => state.profile
  );

  const [editableProfile, setEditableProfile] = useState<UserProfile | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [likeLoadingId, setLikeLoadingId] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [newInterest, setNewInterest] = useState("");

  useEffect(() => {
    if (profile) {
      setEditableProfile(profile);
    }
  }, [profile]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
  };

  const handleFieldChange = (field: string, value: any) => {
    if (!editableProfile) return;
    setEditableProfile({
      ...editableProfile,
      [field]: value,
    });
  };

  const handleNestedFieldChange = (
    parent: string,
    field: string,
    value: any
  ) => {
    if (!editableProfile) return;
    setEditableProfile({
      ...editableProfile,
      [parent]: {
        ...(editableProfile[parent as keyof UserProfile] as any),
        [field]: value,
      },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification("error", "Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification("error", "Image must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!editableProfile) return;

    // Validation
    if (!editableProfile.bio?.trim()) {
      showNotification("error", "Bio is required");
      return;
    }

    if (!editableProfile.age || editableProfile.age < 18) {
      showNotification("error", "Age must be 18 or above");
      return;
    }

    if (!editableProfile.location?.city?.trim()) {
      showNotification("error", "City is required");
      return;
    }

    setSaveLoading(true);
    try {
      let imageUrl = editableProfile.images?.[0];

      if (selectedFile) {
        imageUrl = await ProfileService.uploadImage(selectedFile);
      }

      // ✅ CORRECTED: Match backend expected structure
      const updateData = {
        profile: {
          bio: editableProfile.bio,
          age: editableProfile.age,
          gender: editableProfile.gender,
          firstName: editableProfile.firstName,
          location: {
            city: editableProfile.location?.city,
            country: editableProfile.location?.country || "India",
          },
          profileImage: imageUrl,
          sexualOrientation: editableProfile.interests || [],
          relationshipIntent: editableProfile.lookingFor || "dating",
        },
        preferences: {
          ageRange: [18, 40],
          maxDistance: 50,
          isVisible: true,
        },
      };

      // Mock API call - replace with actual dispatch
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsEditing(false);
      setSelectedFile(null);
      setPreview(null);
      showNotification("success", "Profile updated successfully!");
    } catch (err: any) {
      console.error("Save error:", err);
      showNotification("error", err.message || "Failed to update profile");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLike = async (matchId: string) => {
    setLikeLoadingId(matchId);
    try {
      const result = await ProfileService.likeProfile(matchId);
      if (result?.matched) {
        showNotification(
          "success",
          "🎉 It's a match! You can now start chatting!"
        );
      } else {
        showNotification("success", "Like sent successfully!");
      }
    } catch (err: any) {
      showNotification("error", "Failed to like profile");
    } finally {
      setLikeLoadingId(null);
    }
  };

  const handlePass = async (matchId: string) => {
    try {
      await ProfileService.passProfile(matchId);
      showNotification("success", "Profile skipped");
    } catch (err: any) {
      showNotification("error", "Failed to skip profile");
    }
  };

  const addInterest = () => {
    if (!newInterest.trim() || !editableProfile) return;
    if ((editableProfile.interests?.length || 0) >= 10) {
      showNotification("error", "Maximum 10 interests allowed");
      return;
    }
    handleFieldChange("interests", [
      ...(editableProfile.interests || []),
      newInterest.trim(),
    ]);
    setNewInterest("");
  };

  const removeInterest = (index: number) => {
    if (!editableProfile) return;
    const updated = [...(editableProfile.interests || [])];
    updated.splice(index, 1);
    handleFieldChange("interests", updated);
  };

  const allImages = (editableProfile?.images || []).filter(Boolean);

  const calculateCompletion = () => {
    const profile = editableProfile;
    let filled = 0;
    const total = 7;

    if (profile?.bio?.trim()) filled++;
    if (profile?.age && profile.age >= 18) filled++;
    if (profile?.location?.city?.trim()) filled++;
    if (profile?.interests && profile.interests.length > 0) filled++;
    if (profile?.images && profile.images.length > 0) filled++;
    if (profile?.gender) filled++;
    if (profile?.lookingFor) filled++;

    return Math.round((filled / total) * 100);
  };

  const completion = calculateCompletion();

  if (isLoading || !editableProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-6"></div>
            <Heart className="w-8 h-8 text-pink-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-700 font-semibold text-lg">
            Loading your profile...
          </p>
          <p className="text-gray-500 text-sm mt-2">Getting things ready</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 pb-20">
      <AnimatePresence>
        {notification && (
          <Notification
            notif={notification}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              My Profile
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    completion === 100 ? "bg-green-500" : "bg-amber-500"
                  } animate-pulse`}
                ></div>
                <p className="text-gray-600 font-medium">
                  {completion}% Complete
                </p>
              </div>
              {editableProfile.verificationStatus === "verified" && (
                <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  <Shield className="w-4 h-4" />
                  Verified
                </div>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsEditing(!isEditing);
              if (isEditing) {
                setEditableProfile(profile || null);
                setPreview(null);
                setSelectedFile(null);
              }
            }}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold shadow-lg transition-all duration-300 ${
              isEditing
                ? "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
                : "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700"
            }`}
          >
            {isEditing ? (
              <>
                <X className="w-5 h-5" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="w-5 h-5" />
                Edit Profile
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Main Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Decorative Header */}
          <div className="relative h-40 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
            </div>
            <Sparkles className="absolute top-6 right-6 w-10 h-10 text-white/80 animate-pulse" />
            <Heart className="absolute top-6 left-6 w-8 h-8 text-white/60" />
          </div>

          <div className="px-6 lg:px-10 pb-10">
            {/* Profile Section */}
            <div className="flex flex-col lg:flex-row gap-10 -mt-20">
              {/* Left Column - Image & Quick Info */}
              <div className="flex flex-col items-center space-y-6 lg:w-80">
                {/* Profile Image */}
                <div className="relative group">
                  <div className="w-48 h-48 rounded-3xl overflow-hidden border-6 border-white shadow-2xl bg-gradient-to-br from-pink-100 to-purple-100">
                    {allImages.length > 0 ? (
                      <img
                        src={preview || allImages[imageIndex]}
                        alt="Profile"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/400x400?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-24 h-24 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {allImages.length > 1 && (
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {allImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === imageIndex
                              ? "bg-pink-600 w-6"
                              : "bg-gray-300 hover:bg-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {isEditing && (
                    <label className="absolute -bottom-3 -right-3 w-14 h-14 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center cursor-pointer shadow-xl hover:scale-110 transition-transform group">
                      <Camera className="w-6 h-6 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Quick Info Card */}
                <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 space-y-4">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {editableProfile.username || "User"}
                    </h3>
                    <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4 text-purple-500" />
                      {editableProfile.email}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">
                        Profile Views
                      </span>
                      <span className="font-bold text-gray-900">1,234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Matches</span>
                      <span className="font-bold text-pink-600">
                        {matches.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Completion</span>
                      <span
                        className={`font-bold ${
                          completion === 100
                            ? "text-green-600"
                            : "text-amber-600"
                        }`}
                      >
                        {completion}%
                      </span>
                    </div>
                  </div>

                  {completion < 100 && !isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full mt-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all"
                    >
                      Complete Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="flex-1 space-y-8 pt-6">
                {/* Bio Section */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <MessageCircle className="w-4 h-4 text-purple-600" />
                    About Me
                    <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editableProfile.bio || ""}
                      onChange={(e) => handleFieldChange("bio", e.target.value)}
                      placeholder="Tell others about yourself... What makes you unique?"
                      rows={4}
                      maxLength={500}
                      className="w-full rounded-2xl border-2 border-gray-200 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent resize-none text-gray-700 placeholder:text-gray-400"
                    />
                  ) : (
                    <p
                      className={`px-5 py-4 rounded-2xl min-h-[100px] ${
                        !editableProfile.bio
                          ? "bg-red-50 text-red-700 italic border-2 border-red-200"
                          : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {editableProfile.bio ||
                        "No bio added yet. Add a bio to tell others about yourself!"}
                    </p>
                  )}
                  {isEditing && (
                    <p className="text-xs text-gray-500 mt-2 text-right">
                      {editableProfile.bio?.length || 0}/500 characters
                    </p>
                  )}
                </div>

                {/* Personal Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Age */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      Age <span className="text-red-500">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        min="18"
                        max="100"
                        value={editableProfile.age || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            "age",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                      />
                    ) : (
                      <div
                        className={`px-4 py-3 rounded-xl text-center font-semibold ${
                          !editableProfile.age || editableProfile.age === 0
                            ? "bg-red-50 text-red-700 border-2 border-red-200"
                            : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {editableProfile.age || "-"}
                      </div>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-2">
                      <User className="w-4 h-4 text-purple-600" />
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        value={editableProfile.gender || ""}
                        onChange={(e) =>
                          handleFieldChange("gender", e.target.value)
                        }
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <div className="px-4 py-3 rounded-xl bg-gray-50 text-gray-700 text-center font-semibold">
                        {editableProfile.gender || "-"}
                      </div>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      City <span className="text-red-500">*</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editableProfile.location?.city || ""}
                        onChange={(e) =>
                          handleNestedFieldChange(
                            "location",
                            "city",
                            e.target.value
                          )
                        }
                        placeholder="Mumbai"
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                      />
                    ) : (
                      <div
                        className={`px-4 py-3 rounded-xl text-center font-semibold ${
                          !editableProfile.location?.city
                            ? "bg-red-50 text-red-700 border-2 border-red-200"
                            : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {editableProfile.location?.city || "-"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Looking For */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <Heart className="w-4 h-4 text-purple-600" />
                    Looking For
                  </label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        "dating",
                        "relationship",
                        "friendship",
                        "networking",
                      ].map((option) => (
                        <button
                          key={option}
                          onClick={() =>
                            handleFieldChange("lookingFor", option)
                          }
                          className={`py-3 px-4 rounded-xl font-semibold capitalize transition-all ${
                            editableProfile.lookingFor === option
                              ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-5 py-4 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 text-gray-800 capitalize font-semibold border-2 border-pink-100">
                      {editableProfile.lookingFor || "Not specified"}
                    </div>
                  )}
                </div>

                {/* Interests */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Interests & Hobbies
                  </label>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addInterest()}
                          placeholder="Add an interest (e.g., Travel, Music)"
                          className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={addInterest}
                          className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all"
                        >
                          <Plus className="w-5 h-5" />
                        </motion.button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(editableProfile.interests || []).map(
                          (interest, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full font-medium group"
                            >
                              <span>{interest}</span>
                              <button
                                onClick={() => removeInterest(idx)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4 hover:text-red-600" />
                              </button>
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(editableProfile.interests || []).length > 0 ? (
                        (editableProfile.interests || []).map(
                          (interest, idx) => (
                            <motion.span
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full font-semibold text-sm"
                            >
                              {interest}
                            </motion.span>
                          )
                        )
                      ) : (
                        <span className="text-gray-500 italic">
                          No interests added yet
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile Completion Progress */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <Award className="w-5 h-5 text-purple-600" />
                      Profile Strength
                    </label>
                    <span
                      className={`text-2xl font-black ${
                        completion === 100
                          ? "text-green-600"
                          : completion >= 70
                          ? "text-blue-600"
                          : completion >= 40
                          ? "text-amber-600"
                          : "text-red-600"
                      }`}
                    >
                      {completion}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completion}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-3 rounded-full ${
                        completion === 100
                          ? "bg-gradient-to-r from-green-400 to-green-600"
                          : completion >= 70
                          ? "bg-gradient-to-r from-blue-400 to-blue-600"
                          : completion >= 40
                          ? "bg-gradient-to-r from-amber-400 to-amber-600"
                          : "bg-gradient-to-r from-red-400 to-red-600"
                      }`}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {completion === 100
                      ? "🎉 Your profile is complete!"
                      : completion >= 70
                      ? "Almost there! A complete profile gets more matches."
                      : "Complete your profile to increase your visibility"}
                  </p>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-4 pt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      disabled={saveLoading}
                      className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl px-8 py-4 font-bold hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saveLoading ? (
                        <>
                          <SmallSpinner />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Check className="w-6 h-6" />
                          Save Changes
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsEditing(false);
                        setEditableProfile(profile || null);
                        setPreview(null);
                        setSelectedFile(null);
                      }}
                      className="px-8 py-4 border-2 border-gray-300 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Suggested Matches Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900">
                  Suggested Matches
                </h2>
                <p className="text-gray-600 text-sm">
                  Find your perfect connection
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-pink-200 rounded-xl hover:bg-pink-50 transition-all font-semibold text-pink-600">
              <Search className="w-5 h-5" />
              Advanced Search
            </button>
          </div>

          {matches.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-lg p-16 text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No matches yet
              </h3>
              <p className="text-gray-500 mb-6">
                Complete your profile to see potential matches
              </p>
              {completion < 100 && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold hover:from-pink-700 hover:to-purple-700 transition-all"
                >
                  Complete Profile
                </button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match: any, idx: number) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group"
                >
                  {/* Image Section */}
                  <div className="relative h-80 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                    <img
                      src={
                        match.images?.[0] ||
                        "https://via.placeholder.com/400x600?text=No+Image"
                      }
                      alt={match.bio || "Match"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/400x600?text=No+Image";
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Verification Badge */}
                    {match.verificationStatus === "verified" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className="absolute top-4 right-4 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Shield className="w-5 h-5 text-white" />
                      </motion.div>
                    )}

                    {/* Match Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-black mb-1">
                        {match.bio?.split(" ")[0] || "User"}, {match.age}
                      </h3>
                      <div className="flex items-center gap-2 text-sm opacity-90">
                        <MapPin className="w-4 h-4" />
                        <span>{match.location?.city || "Unknown"}</span>
                      </div>

                      {/* Online Status */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs opacity-75">
                          Active recently
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 flex gap-3 bg-gradient-to-br from-gray-50 to-white">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePass(match.id)}
                      className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold hover:bg-gray-100 hover:border-gray-300 transition-all flex items-center justify-center gap-2 group"
                    >
                      <X className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                      Pass
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLike(match.id)}
                      disabled={likeLoadingId === match.id}
                      className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl px-4 py-3 text-sm font-bold hover:from-pink-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {likeLoadingId === match.id ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Heart className="w-5 h-5 fill-white" />
                          Like
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
