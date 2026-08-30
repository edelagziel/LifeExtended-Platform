import React, { useState } from "react";
import { useSummarizer } from "../../customHooks/useSummarizer";
import "./researchItem.css";

function ResearchItem({ data }) {
  const articleUrl = `https://europepmc.org/article/${data.source}/${data.id}`;
  const { summarize, summaries, loading } = useSummarizer();
  const [showSummary, setShowSummary] = useState(false);

  const itemId = `${data.source}-${data.id}`;
  const summary = summaries[itemId];
  const isLoading = loading[itemId];

  const handleToggleSummary = async () => {
    if (!showSummary && !summary) {
      // Generate summary if not already generated
      await summarize(itemId, data.abstractText, { maxSentences: 3 });
    }
    setShowSummary(!showSummary);
  };

  const displayText = showSummary && summary ? summary : data.abstractText;

  return (
    <div className="research-card">
      <h3 className="research-title">{data.title}</h3>

      <div className="research-abstract-container">
        <p className="research-abstract">
          {displayText}
        </p>

        {showSummary && summary && (
          <span className="research-summary-badge">
            ✨ AI Summary
          </span>
        )}
      </div>

      <div className="research-actions">
        <button
          onClick={handleToggleSummary}
          className="research-summary-btn"
          disabled={isLoading}
        >
          {isLoading
            ? "Generating..."
            : showSummary
            ? "Show Full Abstract"
            : "Show AI Summary"}
        </button>
      </div>

      <div className="research-footer">
        <span className="research-year">
          Year: {data.pubYear}
        </span>

        <a
          href={articleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="research-link"
        >
          Read article
        </a>
      </div>
    </div>
  );
}

export default ResearchItem;
