import { useState } from "react";
import { useSelector } from "react-redux";
import { useActivePoll, useClosePoll, useDeletePoll, useUpdatePoll } from "../../customHooks/usePolls";
import type { RootState } from "../../store/store";
import "./DashboardPage.css";

export default function DashboardPage() {
  const { poll, loading: pollLoading, refetch } = useActivePoll();
  const { closePoll, loading: closeLoading } = useClosePoll();
  const { deletePoll, loading: deleteLoading } = useDeletePoll();
  const { updatePoll, loading: updateLoading } = useUpdatePoll();
  const liveStats = useSelector((state: RootState) => state.poll.liveStats);

  // Case-insensitive check - works with both "ACTIVE" and "active"
  const isActive = poll?.status?.toUpperCase() === 'ACTIVE';

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const onClose = async () => {
    if (!poll) return;

    try {
      await closePoll(poll.id);
      alert("Poll closed successfully");
      refetch(); // Refresh poll data
    } catch {
      alert("Error closing poll");
    }
  };

  const onDelete = async () => {
    if (!poll) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${poll.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deletePoll(poll.id);
      alert("Poll deleted successfully");
      refetch(); // Refresh poll data
    } catch {
      alert("Error deleting poll");
    }
  };

  const startEdit = () => {
    if (!poll) return;
    setEditTitle(poll.title);
    setEditDescription(poll.description || "");
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditTitle("");
    setEditDescription("");
  };

  const saveEdit = async () => {
    if (!poll) return;

    try {
      await updatePoll(poll.id, {
        title: editTitle,
        description: editDescription,
      });
      alert("Poll updated successfully");
      setIsEditing(false);
      refetch(); // Refresh poll data
    } catch {
      alert("Error updating poll");
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">Manage your polls and view analytics</p>
      </div>

      <div className="dashboard-grid">
        {/* Quick Stats */}
        <div className="dashboard-card stats-card">
          <h2 className="card-title">Quick Stats</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{poll ? 1 : 0}</div>
              <div className="stat-label">Active Polls</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{liveStats?.totalVotes || poll?.totalVotes || 0}</div>
              <div className="stat-label">Participants</div>
            </div>
          </div>
        </div>

        {/* Current Poll Management */}
        <div className="dashboard-card action-card">
          <h2 className="card-title">Current Poll</h2>
          {pollLoading ? (
            <p className="card-description">Loading poll...</p>
          ) : poll ? (
            <>
              {!isEditing ? (
                <>
                  <p className="card-description">
                    <strong>{poll.title}</strong>
                    <br />
                    {poll.description}
                  </p>
                  <p className="card-description">
                    Status: <span className={`status-${poll.status?.toLowerCase()}`}>
                      {poll.status?.toUpperCase()}
                    </span>
                  </p>
                  <div className="button-group">
                    <button 
                      className="btn-secondary" 
                      disabled={closeLoading || deleteLoading || updateLoading} 
                      onClick={startEdit}
                    >
                      Edit Poll
                    </button>
                    <button 
                      className="btn-primary" 
                      disabled={closeLoading || deleteLoading || !isActive} 
                      onClick={onClose}
                    >
                      {closeLoading ? "Closing…" : "Close Poll"}
                    </button>
                    <button 
                      className="btn-danger" 
                      disabled={closeLoading || deleteLoading} 
                      onClick={onDelete}
                    >
                      {deleteLoading ? "Deleting…" : "Delete Poll"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="edit-form">
                    <label>
                      Poll Title
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Enter poll title"
                      />
                    </label>
                    <label>
                      Poll Description
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Enter poll description (optional)"
                        rows={3}
                      />
                    </label>
                  </div>
                  <div className="button-group">
                    <button 
                      className="btn-primary" 
                      disabled={updateLoading || !editTitle.trim()} 
                      onClick={saveEdit}
                    >
                      {updateLoading ? "Saving…" : "Save Changes"}
                    </button>
                    <button 
                      className="btn-secondary" 
                      disabled={updateLoading} 
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <p className="card-description">No active poll found</p>
          )}
        </div>
      </div>
    </div>
  );
}
