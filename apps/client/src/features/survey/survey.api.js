const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Fetch the active poll configuration from the server
 * @returns {Promise<Object|null>} Poll data or null if not found
 */
export async function getActivePoll() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/active-poll`);
    
    if (!res.ok) {
      console.warn("No active poll found or server error");
      return null;
    }
    
    const data = await res.json();
    
    // Normalize response (handles different AWS response formats)
    return data.poll || data.Item || data;
  } catch (err) {
    // Silent fail when running locally without backend
    if (!API_BASE_URL) {
      console.info("Running in local mode - using fallback survey config");
    } else {
      console.error("Failed to fetch active poll:", err);
    }
    return null;
  }
}

/**
 * Submit a vote for the current poll
 * @param {Object} params - Vote parameters
 * @param {string} params.email - User email
 * @param {string} params.choice - Selected option
 * @returns {Promise<Object>} Success response
 * @throws {Error} If vote fails or already voted
 */
export async function submitVote({ email, choice }) {
  const res = await fetch(`${API_BASE_URL}/api/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.toLowerCase().trim(),
      choice,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (res.ok) return { success: true };

  if (res.status === 409 || JSON.stringify(data).toLowerCase().includes("already")) {
    throw new Error("ALREADY_VOTED");
  }

  throw new Error("SERVER_ERROR");
}
