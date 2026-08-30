import type { Poll, CreatePollDTO, UpdatePollDTO, ApiResponse } from "../types/poll.types";

const API_KEY = "da2-p4q37etihjbuhifsro67t3epfm";
const BASE_URL = "/admin";

// Headers for all requests
const getHeaders = () => ({
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
});

/**
 * Get the currently active poll
 */
export async function getActivePoll(): Promise<Poll | null> {
  try {
    const res = await fetch(`${BASE_URL}/active-poll`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!res.ok) {
      console.error("Failed to fetch poll - status:", res.status);
      return null;
    }

    const data = await res.json();
    console.log("Server response (active-poll):", data);

    // --- Smart fix: Check all possible formats ---
    let poll = null;
    
    if (data.poll) {
      poll = data.poll;           // Wrapped in {poll: ...}
    } else if (data.pollId) {
      poll = data;                // Flat format with pollId
    } else if (data.Item) {
      poll = data.Item;           // Direct DynamoDB format
    } else if (data.id) {
      poll = data;                // Direct Poll object
    }
    
    // If we found a poll, normalize its status to lowercase
    if (poll && poll.status) {
      poll.status = poll.status.toLowerCase();
    }
    
    console.log("Processed poll:", poll);
    return poll;
  } catch (error) {
    console.error("Error fetching active poll:", error);
    return null;
  }
}

/**
 * Create a new poll
 */
export async function createPoll(data: CreatePollDTO): Promise<ApiResponse<Poll>> {
  try {
    const res = await fetch(`${BASE_URL}/create-poll`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error("Failed to create poll - status:", res.status);
      throw new Error("Failed to create poll");
    }

    const response = await res.json();
    console.log("Server response (create-poll):", response);
    
    // Normalize response format
    return {
      success: response.success !== false,
      data: response.data || response.poll || response,
      message: response.message,
      error: response.error,
    };
  } catch (error) {
    console.error("Error creating poll:", error);
    throw error;
  }
}

/**
 * Update an existing poll
 */
export async function updatePoll(
  pollId: string,
  data: UpdatePollDTO
): Promise<ApiResponse<Poll>> {
  try {
    const res = await fetch(`${BASE_URL}/update-poll`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ pollId, ...data }),
    });

    if (!res.ok) {
      console.error("Failed to update poll - status:", res.status);
      throw new Error("Failed to update poll");
    }

    const response = await res.json();
    console.log("Server response (update-poll):", response);
    
    return {
      success: response.success !== false,
      data: response.data || response.poll || response,
      message: response.message,
      error: response.error,
    };
  } catch (error) {
    console.error("Error updating poll:", error);
    throw error;
  }
}

/**
 * Delete a poll
 */
export async function deletePoll(pollId: string): Promise<ApiResponse<void>> {
  try {
    const res = await fetch(`${BASE_URL}/delete-poll`, {
      method: "DELETE",
      headers: getHeaders(),
      body: JSON.stringify({ pollId }),
    });

    if (!res.ok) {
      console.error("Failed to delete poll - status:", res.status);
      throw new Error("Failed to delete poll");
    }

    const response = await res.json();
    console.log("Server response (delete-poll):", response);
    
    return {
      success: response.success !== false,
      message: response.message,
      error: response.error,
    };
  } catch (error) {
    console.error("Error deleting poll:", error);
    throw error;
  }
}

/**
 * Close the active poll
 */
export async function closePoll(pollId: string): Promise<ApiResponse<Poll>> {
  try {
    const res = await fetch(`${BASE_URL}/close-poll`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ pollId }),
    });

    if (!res.ok) {
      console.error("Failed to close poll - status:", res.status);
      throw new Error("Failed to close poll");
    }

    const response = await res.json();
    console.log("Server response (close-poll):", response);
    
    return {
      success: response.success !== false,
      data: response.data || response.poll || response,
      message: response.message,
      error: response.error,
    };
  } catch (error) {
    console.error("Error closing poll:", error);
    throw error;
  }
}
