import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Poll } from "../types/poll.types";

interface PollState {
  activePoll: Poll | null;
  liveStats: {
    totalVotes: number;
    standings: Record<string, number>;
  } | null;
}

const initialState: PollState = {
  activePoll: null,
  liveStats: null,
};

const pollSlice = createSlice({
  name: "poll",
  initialState,
  reducers: {
    setActivePoll: (state, action: PayloadAction<Poll | null>) => {
      state.activePoll = action.payload;
    },
    updateLiveStats: (state, action: PayloadAction<{ totalVotes: number; standings: Record<string, number> }>) => {
      state.liveStats = action.payload;
    },
    clearPollData: (state) => {
      state.activePoll = null;
      state.liveStats = null;
    },
  },
});

export const { setActivePoll, updateLiveStats, clearPollData } = pollSlice.actions;
export default pollSlice.reducer;
