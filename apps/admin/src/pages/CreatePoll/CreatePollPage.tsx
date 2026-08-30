import { useState } from "react";
import { useCreatePoll } from "../../customHooks/usePolls";
import "./CreatePollPage.css";

export default function CreatePollPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  
  const { createPoll, loading, error, success, reset } = useCreatePoll();

  function updateOption(index: number, value: string) {
    const copy = [...options];
    copy[index] = value;
    setOptions(copy);
  }

  function addOption() {
    setOptions([...options, ""]);
  }

  async function submitPoll() {
    reset();

    try {
      const pollData: any = {
        title,
        options: options.filter(Boolean),
      };
      
      // Only add description if it has a value
      if (description.trim()) {
        pollData.description = description;
      }

      await createPoll(pollData);

      // Reset form on success
      setTitle("");
      setDescription("");
      setOptions(["", ""]);
    } catch (err) {
      // Error is handled by the hook
      console.error("Failed to create poll:", err);
    }
  }

  return (
    <div className="create-poll">
      <h1>Create New Poll</h1>

      <label>
        Poll Title
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter poll title"
        />
      </label>

      <label>
        Poll Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter poll description (optional)"
          rows={4}
        />
      </label>

      <div className="options">
        <h3>Options</h3>

        {options.map((opt, i) => (
          <input
            key={i}
            value={opt}
            onChange={(e) => updateOption(i, e.target.value)}
            placeholder={`Option ${i + 1}`}
          />
        ))}

        <button onClick={addOption}>+ Add option</button>
      </div>

      <button onClick={submitPoll} disabled={loading || !title}>
        {loading ? "Creating..." : "Create Poll"}
      </button>

      {success && <p className="message success">Poll created successfully</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
}
