// Poll Option
export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

// Poll Data
export interface Poll {
  id: string;
  title: string;
  description?: string;
  options: PollOption[];
  status: "active" | "closed" | "draft";
  createdAt: string;
  closedAt?: string;
  totalVotes: number;
}

// DTOs for API calls
export interface CreatePollDTO {
  title: string;
  description?: string;
  options: string[]; // Array of option texts
}

export interface UpdatePollDTO {
  title?: string;
  description?: string;
  options?: PollOption[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PollStats {
  activePolls: number;
  totalVotes: number;
  participants: number;
}
