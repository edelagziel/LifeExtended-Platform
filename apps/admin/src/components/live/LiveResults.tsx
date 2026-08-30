import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateClient } from "aws-amplify/api";

import type { Poll } from "../../types/poll.types";
import type { RootState } from "../../store/store";
import { updateLiveStats } from "../../store/pollSlice";
import { ON_STATS_UPDATED } from "../../aws/subscriptions";

import "./LiveResults.css";

/* ========= GraphQL client ========= */
const client = generateClient();

/* ========= Types ========= */
type LiveStats = {
  statName?: string;
  totalVotes?: number;
  [key: string]: any;
};

interface LiveResultsProps {
  poll: Poll;
  onParticipantsUpdate?: (count: number) => void;
}

export default function LiveResults({
  poll,
  onParticipantsUpdate,
}: LiveResultsProps) {
  const dispatch = useDispatch();
  const liveStats = useSelector((state: RootState) => state.poll.liveStats);

  const [data, setData] = useState<LiveStats | null>(null);
  const [status, setStatus] = useState("Connecting…");

  /* ========= Load from Redux on mount ========= */
  useEffect(() => {
    if (liveStats && !data) {
      setData({
        statName: poll.title,
        totalVotes: liveStats.totalVotes,
        ...liveStats.standings,
      });
    }
  }, [liveStats, poll.title, data]);

  /* ========= Subscribe on mount ========= */
  useEffect(() => {
    console.log("Connecting to AppSync subscription…");

    const sub = (client.graphql({ query: ON_STATS_UPDATED }) as any).subscribe({
      next: ({ data }: any) => {
        try {
          const standings = data?.onStatsUpdated?.standings;
          if (!standings) return;

          const parsed = JSON.parse(standings);

          setData(parsed);
          setStatus("Live");

          const { statName, totalVotes, ...choices } = parsed;

          dispatch(
            updateLiveStats({
              totalVotes: totalVotes || 0,
              standings: choices,
            })
          );

          if (
            onParticipantsUpdate &&
            typeof totalVotes === "number"
          ) {
            onParticipantsUpdate(totalVotes);
          }
        } catch (err) {
          console.error("JSON parse error:", err);
        }
      },
      error: (err: any) => {
        console.error("Subscription error:", err);
        setStatus("Disconnected");
      },
    });

    return () => {
      sub.unsubscribe();
    };
  }, [dispatch, onParticipantsUpdate]);

  /* ========= UI fallback ========= */
  const displayData: LiveStats =
    data || {
      statName: poll.title,
      totalVotes: poll.totalVotes,
      ...(Array.isArray(poll.options)
        ? poll.options.reduce((acc, opt, index) => {
            const label =
              typeof opt === "string"
                ? opt
                : opt.text ||
                  (opt as any).label ||
                  `Option ${index + 1}`;

            const votes =
              typeof opt === "string" ? 0 : opt.votes || 0;

            acc[label] = votes;
            return acc;
          }, {} as Record<string, number>)
        : {}),
    };

  const { statName, totalVotes, ...choices } = displayData;

  return (
    <div className="container">
      <div className="header">
        <h1>{statName || poll.title}</h1>
        <p>Total Participants: {totalVotes ?? 0}</p>
        <span>Status: {status}</span>
      </div>

      <div className="grid">
        {Object.entries(choices).map(([key, value]) => (
          <div key={key} className="resultCard">
            <h3>{key}</h3>
            <div className="value">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
