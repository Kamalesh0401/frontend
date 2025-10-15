// src/pages/Auth/ProfilePage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import {
  fetchProfile,
  updateProfile,
  getMatches,
  likeProfile,
  passProfile,
} from "../../store/slices/profileSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Edit,
  Upload,
  MapPin,
  Heart,
  X,
  Check,
  Camera,
  User,
  Mail,
  Calendar,
  Search,
  Sparkles,
  AlertCircle,
} from "lucide-react";

// Define types matching backend structure
interface ProfileData {
  firstName?: string;
  gender?: string;
  age?: number;
  bio?: string;
  sexualOrientation?: string[];
  relationshipIntent?: string;
  profileImage?: string;
  additionalImages?: string[];
  location?: {
    city?: string;
    country?: string;
    coordinates?: [number, number];
  };
  interests?: string[];
}

interface Profile {
  _id: string;
  id?: string;
  username: string;
  email: string;
  profile?: ProfileData;
  completionPercentage?: number;
  onlineStatus?: boolean;
  lastSeen?: string;
}

const SmallSpinner: React.FC = () => (
  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
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

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { profile, isLoading, matches, error } = useSelector(
    (state: RootState) => state.profile
  );
  const [editableProfile, setEditableProfile] =
    useState<Partial<Profile> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [likeLoading, setLikeLoading] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    dispatch(fetchProfile(user.id));
    dispatch(getMatches({ userId: user.id }));
  }, [dispatch, user?.id]);

  useEffect(() => {

    console.log("Profile data updated:", profile);
    if (profile) setEditableProfile(profile);
  }, [profile]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!editableProfile) return;
    const { name, value } = e.target;
    setEditableProfile({ ...editableProfile, [name]: value });
  };

  const handleInterestsChange = (val: string) => {
    if (!editableProfile) return;
    setEditableProfile({
      ...editableProfile,
      interests: val
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!editableProfile) return;
    setSaveLoading(true);
    try {
      console.log("Saving profile:", editableProfile);
      await dispatch(updateProfile(editableProfile) as any);
      setIsEditing(false);
      setSelectedFile(null);
      setPreview(null);
      showNotification("success", "Profile updated successfully!");
    } catch (err) {
      showNotification("error", "Failed to update profile");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLike = async (matchId: string) => {
    setLikeLoading(matchId);
    try {
      const result = await dispatch(likeProfile(matchId) as any);
      if (result.payload?.matched) {
        showNotification("success", "It's a match! 🎉");
      } else {
        showNotification("success", "Liked successfully!");
      }
    } catch (err) {
      showNotification("error", "Failed to like profile");
    } finally {
      setLikeLoading(null);
    }
  };

  const handlePass = async (matchId: string) => {
    try {
      await dispatch(passProfile(matchId) as any);
      showNotification("success", "Profile passed");
    } catch (err) {
      showNotification("error", "Failed to pass profile");
    }
  };

  if (isLoading || !editableProfile) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50"
          >
            <div
              className={`px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 ${
                notification.type === "success"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {notification.type === "success" ? (
                <Check className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-gray-600 mt-1">Manage your dating profile</p>
          </div>

          <button
            onClick={() => {
              setIsEditing((prev) => !prev);
              if (!isEditing && profile) setEditableProfile(profile);
              if (isEditing) {
                setSelectedFile(null);
                setPreview(null);
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-pink-200 rounded-xl hover:bg-pink-50 hover:border-pink-300 transition-all duration-200 shadow-sm"
          >
            {isEditing ? (
              <>
                <X className="w-5 h-5 text-pink-600" />
                <span className="font-medium text-gray-700">Cancel</span>
              </>
            ) : (
              <>
                <Edit className="w-5 h-5 text-pink-600" />
                <span className="font-medium text-gray-700">Edit Profile</span>
              </>
            )}
          </button>
        </motion.div>

        {/* Main Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="relative h-40 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600">
            <div className="absolute inset-0 bg-black/10"></div>
            <Sparkles className="absolute top-4 right-4 w-8 h-8 text-white/80" />
          </div>

          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-8 -mt-20">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center md:items-start space-y-4">
                <div className="relative">
                  <div className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-pink-100 to-purple-100">
                    {preview || editableProfile.profile?.profileImage ? (
                      <img
                        src={
                          preview || editableProfile.profile?.profileImage || ""
                        }
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <label
                      htmlFor="fileInput"
                      className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform"
                    >
                      <Camera className="w-5 h-5 text-white" />
                      <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="flex flex-col items-center md:items-start">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-pink-500" />
                    <span className="text-sm">
                      {editableProfile.profile?.location?.city || "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <Mail className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">{editableProfile.email}</span>
                  </div>
                </div>
              </div>

              {/* Profile Info Section */}
              <div className="flex-1 space-y-6 mt-6 md:mt-0">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-600">
                    {editableProfile.username}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={editableProfile.profile?.bio || ""}
                      onChange={(e) =>
                        setEditableProfile({
                          ...editableProfile,
                          profile: {
                            ...editableProfile.profile,
                            bio: e.target.value,
                          },
                        })
                      }
                      rows={4}
                      placeholder="Tell others about yourself..."
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-none"
                    />
                  ) : (
                    <p className="text-gray-700 px-4 py-3 bg-gray-50 rounded-xl min-h-[100px]">
                      {editableProfile.profile?.bio || "No bio yet"}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Age
                    </label>
                    {isEditing ? (
                      <input
                        name="age"
                        type="number"
                        value={editableProfile.profile?.age || ""}
                        onChange={(e) =>
                          setEditableProfile({
                            ...editableProfile,
                            profile: {
                              ...editableProfile.profile,
                              age: parseInt(e.target.value),
                            },
                          })
                        }
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-700">
                        {editableProfile.profile?.age || "-"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        value={editableProfile.profile?.gender || ""}
                        onChange={(e) =>
                          setEditableProfile({
                            ...editableProfile,
                            profile: {
                              ...editableProfile.profile,
                              gender: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-700 capitalize">
                        {editableProfile.profile?.gender || "-"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Looking For
                    </label>
                    {isEditing ? (
                      <select
                        value={
                          editableProfile.profile?.relationshipIntent || ""
                        }
                        onChange={(e) =>
                          setEditableProfile({
                            ...editableProfile,
                            profile: {
                              ...editableProfile.profile,
                              relationshipIntent: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                      >
                        <option value="">Select</option>
                        <option value="friendship">Friendship</option>
                        <option value="dating">Dating</option>
                        <option value="relationship">Relationship</option>
                        <option value="casual">Casual</option>
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-700 capitalize">
                        {editableProfile.profile?.relationshipIntent || "-"}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Interests
                  </label>
                  {isEditing ? (
                    <input
                      name="interests"
                      value={(editableProfile.profile?.interests || []).join(
                        ", "
                      )}
                      onChange={(e) =>
                        setEditableProfile({
                          ...editableProfile,
                          profile: {
                            ...editableProfile.profile,
                            interests: e.target.value
                              .split(",")
                              .map((i) => i.trim())
                              .filter(Boolean),
                          },
                        })
                      }
                      placeholder="e.g., Music, Travel, Photography"
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(editableProfile.profile?.interests || []).length > 0 ? (
                        (editableProfile.profile?.interests || []).map(
                          (interest, idx) => (
                            <span
                              key={idx}
                              className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full text-sm font-medium"
                            >
                              {interest}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-gray-500 text-sm">
                          No interests added
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Profile Completion
                  </label>
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            editableProfile.completionPercentage || 0
                          }%`,
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      {editableProfile.completionPercentage || 0}% complete
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saveLoading}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl px-6 py-3 font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {saveLoading ? (
                        <>
                          <SmallSpinner />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditableProfile(profile || null);
                        setPreview(null);
                      }}
                      className="flex-1 border-2 border-gray-300 rounded-xl px-6 py-3 font-semibold hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Suggested Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Suggested Matches
              </h2>
              <p className="text-gray-600 text-sm">
                Find your perfect connection
              </p>
            </div>
          </div>

          {matches.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No matches yet — check back later
              </p>
              <p className="text-gray-400 text-sm mt-2">
                We're finding the best matches for you
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match, idx) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="relative h-64">
                    <img
                      src={
                        match.profile?.profileImage ||
                        match.profile?.additionalImages?.[0] ||
                        "/placeholder.png"
                      }
                      alt={match.username}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-xl font-bold mb-1">
                        {match.username},{" "}
                        <span className="font-normal">
                          {match.profile?.age}
                        </span>
                      </h3>
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {match.profile?.location?.city || "Unknown"}
                        </span>
                      </div>
                      <p className="text-sm line-clamp-2 text-gray-200">
                        {match.profile?.bio || "No bio available"}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between gap-3 bg-gradient-to-r from-gray-50 to-white">
                    <button
                      onClick={() => handlePass(match.id)}
                      className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Pass
                    </button>

                    <button
                      onClick={() => handleLike(match.id)}
                      disabled={likeLoading === match.id}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl px-4 py-3 font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {likeLoading === match.id ? (
                        <SmallSpinner />
                      ) : (
                        <>
                          <Heart className="w-5 h-5" />
                          Like
                        </>
                      )}
                    </button>
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
