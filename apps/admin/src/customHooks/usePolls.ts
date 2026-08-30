import { useState, useEffect } from "react";
import type { Poll, CreatePollDTO, UpdatePollDTO } from "../types/poll.types";
import * as pollService from "../services/pollService";

/**
 * Hook to manage and fetch the active poll
 */
export function useActivePoll() {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPoll = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pollService.getActivePoll();
      // data can be null if no active poll exists
      setPoll(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch poll");
      setPoll(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
  }, []);

  return { poll, loading, error, refetch: fetchPoll };
}

/**
 * Hook to handle poll creation
 */
export function useCreatePoll() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createPoll = async (data: CreatePollDTO) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await pollService.createPoll(data);
      
      // Handle both formats: {success: true, data: poll} or {poll, message}
      if (response.success === false) {
        throw new Error(response.error || response.message || "Failed to create poll");
      }
      
      setSuccess(true);
      // Return either response.data or response.poll or the whole response
      return response.data || (response as any).poll || response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create poll");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return { createPoll, loading, error, success, reset };
}

/**
 * Hook to handle poll closure
 */
export function useClosePoll() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closePoll = async (pollId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await pollService.closePoll(pollId);
      
      // Handle both formats: {success: true, data: poll} or {poll, message}
      if (response.success === false) {
        throw new Error(response.error || response.message || "Failed to close poll");
      }
      
      // Return either response.data or response.poll or the whole response
      return response.data || (response as any).poll || response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to close poll");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { closePoll, loading, error };
}

/**
 * Hook to handle poll update
 */
export function useUpdatePoll() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updatePoll = async (pollId: string, data: UpdatePollDTO) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await pollService.updatePoll(pollId, data);
      
      // Handle both formats: {success: true, data: poll} or {poll, message}
      if (response.success === false) {
        throw new Error(response.error || response.message || "Failed to update poll");
      }
      
      setSuccess(true);
      return response.data || (response as any).poll || response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update poll");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return { updatePoll, loading, error, success, reset };
}

/**
 * Hook to handle poll deletion
 */
export function useDeletePoll() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePoll = async (pollId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await pollService.deletePoll(pollId);
      
      // Handle both formats: {success: true} or {message}
      if (response.success === false) {
        throw new Error(response.error || response.message || "Failed to delete poll");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete poll");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deletePoll, loading, error };
}
