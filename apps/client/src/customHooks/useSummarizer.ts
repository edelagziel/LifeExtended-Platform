import { useState, useCallback } from "react";

/**
 * Smart Text Summarizer Hook
 * 
 * Uses extractive summarization algorithm to identify and extract
 * the most important sentences from research abstracts.
 * 
 * Algorithm:
 * 1. Split text into sentences
 * 2. Score each sentence based on:
 *    - Keywords frequency (longevity, health, etc.)
 *    - Position (first/last sentences are important)
 *    - Length (too short/long = less important)
 * 3. Select top-scored sentences
 * 4. Return in original order
 */

interface SummarizerOptions {
  maxSentences?: number;
  minSentenceLength?: number;
  maxSentenceLength?: number;
}

// Important keywords for longevity/health research
const IMPORTANT_KEYWORDS = [
  "longevity", "aging", "lifespan", "healthspan", "mortality",
  "intervention", "treatment", "therapy", "effect", "increase",
  "decrease", "reduce", "improve", "significant", "clinical",
  "health", "disease", "prevention", "risk", "benefit",
  "study", "trial", "results", "findings", "conclusion",
  "patients", "participants", "human", "adults"
];

/**
 * Calculate importance score for a sentence
 */
function scoreSentence(
  sentence: string,
  position: number,
  totalSentences: number
): number {
  let score = 0;
  const lowerSentence = sentence.toLowerCase();
  const words = lowerSentence.split(/\s+/);

  // 1. Keyword score (most important)
  IMPORTANT_KEYWORDS.forEach((keyword) => {
    if (lowerSentence.includes(keyword)) {
      score += 2;
    }
  });

  // 2. Position score (first and last sentences are important)
  if (position === 0) score += 3; // First sentence
  if (position === totalSentences - 1) score += 2; // Last sentence
  if (position === 1) score += 1; // Second sentence

  // 3. Length score (moderate length is better)
  const wordCount = words.length;
  if (wordCount >= 10 && wordCount <= 25) {
    score += 2;
  } else if (wordCount >= 8 && wordCount <= 30) {
    score += 1;
  }

  // 4. Contains numbers/statistics (often important)
  if (/\d+/.test(sentence)) {
    score += 1;
  }

  return score;
}

/**
 * Split text into sentences intelligently
 */
function splitIntoSentences(text: string): string[] {
  // Split by period, exclamation, or question mark followed by space
  return text
    .split(/[.!?]+\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Generate extractive summary
 */
export function extractiveSummary(
  text: string,
  options: SummarizerOptions = {}
): string {
  const {
    maxSentences = 3,
    minSentenceLength = 50,
    maxSentenceLength = 300,
  } = options;

  if (!text || text.length < 100) {
    return text; // Too short to summarize
  }

  // Split into sentences
  const sentences = splitIntoSentences(text);

  if (sentences.length <= maxSentences) {
    return text; // Already short enough
  }

  // Filter by length
  const validSentences = sentences.filter(
    (s) => s.length >= minSentenceLength && s.length <= maxSentenceLength
  );

  if (validSentences.length <= maxSentences) {
    return validSentences.join(". ") + ".";
  }

  // Score each sentence
  const scoredSentences = validSentences.map((sentence, index) => ({
    sentence,
    score: scoreSentence(sentence, index, validSentences.length),
    originalIndex: index,
  }));

  // Sort by score and take top N
  const topSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .sort((a, b) => a.originalIndex - b.originalIndex); // Restore original order

  return topSentences.map((s) => s.sentence).join(". ") + ".";
}

/**
 * Hook for managing summarization state
 */
export function useSummarizer() {
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const summarize = useCallback(
    async (
      id: string,
      text: string,
      options?: SummarizerOptions
    ): Promise<string> => {
      // Check cache
      if (summaries[id]) {
        return summaries[id];
      }

      setLoading((prev) => ({ ...prev, [id]: true }));

      try {
        // Simulate async processing (in case we want to add API later)
        await new Promise((resolve) => setTimeout(resolve, 300));

        const summary = extractiveSummary(text, options);

        setSummaries((prev) => ({ ...prev, [id]: summary }));
        setLoading((prev) => ({ ...prev, [id]: false }));

        return summary;
      } catch (error) {
        setLoading((prev) => ({ ...prev, [id]: false }));
        console.error("Summarization error:", error);
        return text; // Fallback to original text
      }
    },
    [summaries]
  );

  const clearSummary = useCallback((id: string) => {
    setSummaries((prev) => {
      const newSummaries = { ...prev };
      delete newSummaries[id];
      return newSummaries;
    });
  }, []);

  return {
    summarize,
    clearSummary,
    summaries,
    loading,
  };
}

/**
 * FUTURE ENHANCEMENT: API-based summarization
 * 
 * To upgrade to AI-powered summarization (OpenAI, HuggingFace, etc.):
 * 
 * 1. Add API key to .env:
 *    VITE_HUGGINGFACE_API_KEY=your_key_here
 * 
 * 2. Replace extractiveSummary with API call:
 * 
 *    async function aiSummary(text: string): Promise<string> {
 *      const response = await fetch(
 *        'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
 *        {
 *          headers: {
 *            'Authorization': `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
 *            'Content-Type': 'application/json',
 *          },
 *          method: 'POST',
 *          body: JSON.stringify({ inputs: text }),
 *        }
 *      );
 *      const result = await response.json();
 *      return result[0].summary_text;
 *    }
 */
