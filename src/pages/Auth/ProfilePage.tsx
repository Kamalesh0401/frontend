// src/pages/Auth/ProfilePage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store"; // adjust path if your store file is elsewhere
import {
  fetchProfile,
  updateProfile,
  getMatches,
  likeProfile,
  passProfile,
} from "../../store/slices/profileSlice";
import { Profile } from "../../types";
import { motion } from "framer-motion";
import { Loader2, Edit, Upload, MapPin, Heart } from "lucide-react";

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
  const { profile, isLoading, matches } = useSelector(
    (state: RootState) => state.profile
  );
  const [editableProfile, setEditableProfile] =
    useState<Partial<Profile> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [likeLoading, setLikeLoading] = useState<string | null>(null);

  // Fetch on mount — replace '1' with real auth user id from your auth state if available
  useEffect(() => {
    if (!user?.id) return; // Ensure user ID exists

    dispatch(fetchProfile(user.id));
    dispatch(getMatches({ userId: user.id }));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (profile) setEditableProfile(profile);
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    // You may want to upload the image first via ProfileService.uploadImage and set editableProfile.images
    await dispatch(updateProfile(editableProfile) as any);
    setIsEditing(false);
    setSelectedFile(null);
    setPreview(null);
  };

  const handleLike = async (matchId: string) => {
    setLikeLoading(matchId);
    try {
      await dispatch(likeProfile(matchId) as any);
      // Optionally show toast if matched; keep it simple now
    } finally {
      setLikeLoading(null);
    }
  };

  const handlePass = async (matchId: string) => {
    await dispatch(passProfile(matchId) as any);
  };

  if (isLoading || !editableProfile) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800"
        >
          My Profile
        </motion.h1>

        <button
          onClick={() => {
            setIsEditing((prev) => !prev);
            if (!isEditing && profile) setEditableProfile(profile);
            if (isEditing) {
              setSelectedFile(null);
              setPreview(null);
            }
          }}
          className="flex items-center gap-2 px-3 py-2 border rounded-xl hover:bg-gray-50"
        >
          <Edit className="w-4 h-4" />
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Image + Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-pink-500 shadow">
              <img
                src={
                  preview || editableProfile.images?.[0] || "/placeholder.png"
                }
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>

            {isEditing && (
              <div className="flex flex-col items-center">
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="fileInput"
                  className="cursor-pointer text-sm text-pink-600 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload new photo
                </label>
                {preview && (
                  <p className="text-xs text-gray-500 mt-2">
                    Preview shown — save to upload
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-600 mt-2">
              <MapPin className="w-4 h-4 text-pink-500" />
              <span className="text-sm">
                {editableProfile.location?.city || "Unknown"},{" "}
                {editableProfile.location?.country || ""}
              </span>
            </div>
          </div>

          {/* Right: Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editableProfile.bio || ""}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              ) : (
                <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                  {editableProfile.bio || "No bio yet"}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                {isEditing ? (
                  <input
                    name="age"
                    type="number"
                    value={editableProfile.age || ""}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                ) : (
                  <p className="text-gray-700 mt-1">{editableProfile.age}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Looking For
                </label>
                {isEditing ? (
                  <input
                    name="lookingFor"
                    value={editableProfile.lookingFor || ""}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                ) : (
                  <p className="text-gray-700 mt-1 capitalize">
                    {editableProfile.lookingFor || "-"}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Interests
              </label>
              {isEditing ? (
                <input
                  name="interests"
                  value={(editableProfile.interests || []).join(", ")}
                  onChange={(e) => handleInterestsChange(e.target.value)}
                  placeholder="comma separated (e.g. Music, Travel)"
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              ) : (
                <div className="flex flex-wrap gap-2 mt-1">
                  {(editableProfile.interests || []).map((it, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Completion
              </label>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-pink-500"
                  style={{
                    width: `${editableProfile.completionPercentage || 0}%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {editableProfile.completionPercentage || 0}% complete
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-pink-600 text-white rounded-lg px-4 py-2 hover:bg-pink-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditableProfile(profile || null);
                  }}
                  className="flex-1 border rounded-lg px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Matches */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-5 h-5 text-pink-500" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Suggested Matches
          </h2>
        </div>

        {matches.length === 0 ? (
          <div className="text-gray-500">
            No matches yet — check back later.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl shadow overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={m.images?.[0] || "/placeholder.png"}
                    alt={m.bio}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {m.age}
                          {m.location?.city ? `, ${m.location.city}` : ""}
                        </h3>
                        <p className="text-sm line-clamp-2 max-w-xs">{m.bio}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handlePass(m.id)}
                    className="flex-1 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    Pass
                  </button>

                  <button
                    onClick={() => handleLike(m.id)}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg px-3 py-2 ml-2 flex items-center justify-center gap-2"
                    disabled={likeLoading === m.id}
                  >
                    {likeLoading === m.id ? <SmallSpinner /> : "Like"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
