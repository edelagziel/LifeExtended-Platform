import { useSurvey } from "./useSurvey";
import "./survey.css";

function SurveyPage() {
  const {
    pollData,
    pollLoading,
    pollError,
    email,
    setEmail,
    voteLoading,
    voteError,
    voteSuccess,
    handleVote,
    resetSurvey,
    isEmailLocked,
  } = useSurvey();

  /* ===== Loading state ===== */
  if (pollLoading) {
    return (
      <div className="survey-page">
        <div className="survey-loading">Loading survey...</div>
      </div>
    );
  }

  /* ===== Error loading poll ===== */
  if (pollError && !pollData) {
    return (
      <div className="survey-page">
        <div className="survey-error">
          Failed to load survey. Please try again later.
        </div>
      </div>
    );
  }

  /* ===== Main survey ===== */
  return (
    <div className="survey-page">
      <h1>{pollData?.title || "Survey"}</h1>
      <p>{pollData?.description || ""}</p>

      <input
        type="email"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={voteLoading || isEmailLocked || voteSuccess}
      />

      {isEmailLocked && !voteSuccess && (
        <small className="survey-email-note">
          Answering as <strong>{email}</strong>
        </small>
      )}

      <div className="survey-options">
        {pollData?.options?.map((opt) => (
          <button
            key={opt}
            className="survey-option"
            onClick={() => handleVote(opt)}
            disabled={voteLoading || voteSuccess}
          >
            {opt}
          </button>
        ))}
      </div>

      {voteLoading && (
        <div className="survey-loading">Processing response…</div>
      )}

      {voteError && <div className="survey-error">{voteError}</div>}

      {voteSuccess && (
        <div className="survey-success-message">
          Thank you for contributing to LifeExtended research!
        </div>
      )}
    </div>
  );
}

export default SurveyPage;
