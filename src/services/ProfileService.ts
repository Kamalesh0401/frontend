// src/services/ProfileService.ts
import { Profile } from "../types";

const API_BASE = "http://localhost:5000";

// Auth headers helper
export const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export class ProfileService {
  private static baseUrl = `${API_BASE}/api/profile`;

  /**
   * ✅ CORRECTED: Fetch profile by userId
   * Backend: GET /api/profile/:userId
   */
  static async getProfile(userId: string): Promise<Profile> {
    const res = await fetch(`${this.baseUrl}/${userId}`, {
      headers: { ...authHeaders() },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch profile");
    }

    const response = await res.json();
    // Backend returns { success: true, data: {...} }
    return response.data || response;
  }

  /**
   * ✅ CORRECTED: Update profile
   * Backend: PUT /api/profile (NOT /api/profile/:id)
   * Backend expects nested structure with 'profile' object
   */
  static async updateProfile(profileData: Partial<Profile>): Promise<Profile> {
    // Transform frontend flat structure to backend nested structure
    const backendPayload = {
      profile: {
        bio: profileData.bio,
        age: profileData.age,
        gender: profileData.gender,
        firstName: profileData.firstName,
        location: {
          city: profileData.location?.city,
          country: profileData.location?.country || "India",
        },
        profileImage: profileData.images?.[0],
        sexualOrientation: profileData.interests || [],
        relationshipIntent: profileData.lookingFor || "dating",
      },
      preferences: {
        ageRange: profileData.preferences?.ageRange || [18, 40],
        maxDistance: profileData.preferences?.maxDistance || 50,
        isVisible: profileData.isVisible !== false,
      },
    };

    console.log("Sending update payload:", backendPayload);

    const res = await fetch(`${this.baseUrl}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(backendPayload),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to update profile");
    }

    const response = await res.json();
    console.log("Update response:", response);

    // Transform backend response to frontend format
    return this.transformBackendProfile(response.data || response);
  }

  /**
   * Create a new profile
   * Backend: POST /api/profile
   */
  static async createProfile(profileData: Partial<Profile>): Promise<Profile> {
    const backendPayload = {
      profile: {
        bio: profileData.bio,
        age: profileData.age,
        gender: profileData.gender,
        firstName: profileData.firstName,
        location: {
          city: profileData.location?.city,
          country: profileData.location?.country || "India",
        },
        profileImage: profileData.images?.[0],
        sexualOrientation: profileData.interests || [],
        relationshipIntent: profileData.lookingFor || "dating",
      },
      preferences: {
        ageRange: [18, 40],
        maxDistance: 50,
        isVisible: true,
      },
    };

    const res = await fetch(`${this.baseUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(backendPayload),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to create profile");
    }

    const response = await res.json();
    return this.transformBackendProfile(response.data || response);
  }

  /**
   * ✅ CORRECTED: Get potential matches
   * Backend: GET /api/profile/matches/potential
   */
  static async getMatches(
    userId?: string,
    page = 1,
    limit = 10
  ): Promise<Profile[]> {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));

    const res = await fetch(
      `${this.baseUrl}/matches/potential?${params.toString()}`,
      {
        headers: { ...authHeaders() },
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch matches");
    }

    const response = await res.json();
    console.log("Matches response:", response);

    // Backend returns { success: true, matches: [...] }
    const matches = response.matches || response.data || response;

    // Transform each match to frontend format
    return Array.isArray(matches)
      ? matches.map((m) => this.transformBackendProfile(m))
      : [];
  }

  /**
   * ✅ Upload profile image
   * You need to create this endpoint or use an image upload service
   */
  static async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${this.baseUrl}/image`, {
      method: "PUT",
      headers: { ...authHeaders() },
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to upload image");
    }

    const response = await res.json();
    // Backend should return { success: true, data: { profileImage: "url" } }
    return (
      response.data?.profileImage ||
      response.profileImage ||
      response.imageUrl ||
      ""
    );
  }

  /**
   * ✅ CORRECTED: Like a profile
   * Backend: POST /api/profile/:profileId/like
   */
  static async likeProfile(profileId: string): Promise<{ matched: boolean }> {
    const res = await fetch(`${this.baseUrl}/${profileId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to like profile");
    }

    const response = await res.json();
    return {
      matched: response.matched || false,
    };
  }

  /**
   * ✅ CORRECTED: Pass a profile
   * Backend: POST /api/profile/:profileId/pass
   */
  static async passProfile(profileId: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${profileId}/pass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to pass profile");
    }
  }

  /**
   * Helper: Transform backend MongoDB profile structure to frontend format
   */
  private static transformBackendProfile(backendProfile: any): Profile {
    return {
      id: backendProfile._id?.toString() || backendProfile.id,
      userId: backendProfile._id?.toString() || backendProfile.userId,
      username: backendProfile.username,
      email: backendProfile.email,
      firstName: backendProfile.profile?.firstName,
      bio: backendProfile.profile?.bio || backendProfile.bio || "",
      age: backendProfile.profile?.age || backendProfile.age || 0,
      gender: backendProfile.profile?.gender || backendProfile.gender,
      location: {
        city:
          backendProfile.profile?.location?.city ||
          backendProfile.location?.city ||
          "",
        country:
          backendProfile.profile?.location?.country ||
          backendProfile.location?.country ||
          "India",
      },
      images: backendProfile.profile?.profileImage
        ? [backendProfile.profile.profileImage]
        : backendProfile.images || [],
      interests:
        backendProfile.profile?.sexualOrientation ||
        backendProfile.interests ||
        [],
      lookingFor:
        backendProfile.profile?.relationshipIntent ||
        backendProfile.lookingFor ||
        "dating",
      completionPercentage: backendProfile.completionPercentage || 0,
      isVisible: !backendProfile.accountStatus?.isDeleted,
      verificationStatus: backendProfile.accountStatus?.isVerified
        ? "verified"
        : backendProfile.verificationStatus || "pending",
      preferences: {
        ageRange: backendProfile.preferences?.ageRange || [18, 40],
        maxDistance: backendProfile.preferences?.maxDistance || 50,
        showOnlineOnly: backendProfile.preferences?.showOnlineOnly || false,
      },
    };
  }
}
