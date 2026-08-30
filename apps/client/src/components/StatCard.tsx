import "./StatCard.css";

type StatCardProps = {
  title: string;
  value: number | "?";
  description: string;
  layoutMode?: "compact" | "regular";
  helpText?: string;
};

function StatCard({ title, value, description, helpText }: StatCardProps) {
  // Get color class based on value
  const getColorClass = (val: number | "?"): string => {
    if (val === "?") return "";
    if (val <= 2) return "stat-low";
    if (val <= 3) return "stat-medium";
    return "stat-high";
  };

  // Calculate percentage for progress bar
  const getPercentage = (val: number | "?"): number => {
    if (val === "?") return 0;
    return (val / 5) * 100;
  };

  const colorClass = getColorClass(value);
  const percentage = getPercentage(value);

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <h2>{title}</h2>
        {helpText && (
          <span className="stat-card-help" title={helpText}>
            ⓘ
          </span>
        )}
      </div>

      <div className="stat-card-value">
        <h3 className={value === "?" ? "stat-card-unknown" : colorClass}>
          {value}
          {value !== "?" && <span className="stat-card-max">/5</span>}
        </h3>
      </div>

      {value !== "?" && (
        <div className="stat-card-bar">
          <div
            className={`stat-card-bar-fill ${colorClass}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      <p>{description}</p>
    </div>
  );
}

export default StatCard;
