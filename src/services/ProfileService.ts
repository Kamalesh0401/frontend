// src/services/ProfileService.ts
import { Profile } from "../types";

const API_BASE = "http://localhost:5000";

// src/utils/authHeaders.ts or inside ProfileService.ts

export const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export class ProfileService {
  private static baseUrl = `${API_BASE}/api/profile`;

  static async createProfile(profileData: Partial<Profile>): Promise<Profile> {
    const res = await fetch(`${this.baseUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(profileData),
    });
    if (!res.ok)
      throw new Error((await res.json()).message || "Failed to create profile");
    return res.json();
  }

  static async updateProfile(profileData: Partial<Profile>): Promise<Profile> {
    
    if (!profileData?.id) throw new Error("Profile id required for update");
    
    const res = await fetch(`${this.baseUrl}/${profileData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(profileData),
    });
    if (!res.ok)
      throw new Error((await res.json()).message || "Failed to update profile");
    return res.json();
  }

  static async getProfile(userId: string): Promise<Profile> {
    const res = await fetch(`${this.baseUrl}/${userId}`, {
      headers: { ...authHeaders() },
    });
    if (!res.ok)
      throw new Error((await res.json()).message || "Failed to fetch profile");

    return res.json();
  }

  // getMatches optionally accepts userId (for server to filter by preferences)
  static async getMatches(
    userId?: string,
    page = 1,
    limit = 10
  ): Promise<Profile[]> {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    params.append("page", String(page));
    params.append("limit", String(limit));

    const res = await fetch(`${this.baseUrl}/matches/potential?${params.toString()}`, {
      headers: { ...authHeaders() },
    });
    
    if (!res.ok)
      throw new Error((await res.json()).message || "Failed to fetch matches");
    const payload = await res.json();
    console.log("Fetching matches with payload:", payload);
    // Assume backend returns { matches: [...] } or direct array — normalize
    return Array.isArray(payload) ? payload : payload.matches || [];
  }

  static async uploadImage(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch(`${this.baseUrl}/upload`, {
      method: "POST",
      headers: { ...authHeaders() },
      body: fd,
    });
    if (!res.ok)
      throw new Error((await res.json()).message || "Failed to upload image");
    const json = await res.json();
    // backend should return { imageUrl: "..." }
    return json.imageUrl || json.url || "";
  }

  static async likeProfile(profileId: string): Promise<{ matched: boolean }> {
    const res = await fetch(`${this.baseUrl}/${profileId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
    });
    if (!res.ok)
      throw new Error((await res.json()).message || "Failed to like profile");
    return res.json();
  }

  static async passProfile(profileId: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${profileId}/pass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
    });
    if (!res.ok)
      throw new Error((await res.json()).message || "Failed to pass profile");
    return;
  }
}
