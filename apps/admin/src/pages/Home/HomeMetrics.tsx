// src/pages/Home/HomeMetrics.tsx
import StatCard from "../../components/StatCard";

function HomeMetrics() {
  const data = {
    load: 3,
    fatigue: 2,
    crashRisk: 1,
    stability: 5,
  };

  const cards = [
    {
      title: "Load",
      value: data.load,
      description:
        "Your metabolic and mental load today is moderate. Sustained high load over time may increase risk.",
    },
    {
      title: "Fatigue",
      value: data.fatigue,
      description:
        "Energy levels are slightly reduced. Pay attention to sleep and recovery.",
    },
    {
      title: "Crash Risk",
      value: data.crashRisk,
      description:
        "Low immediate burnout risk. Maintain current balance.",
    },
    {
      title: "Stability",
      value: data.stability,
      description:
        "Overall system stability is strong. Consistency is working in your favor.",
    },
  ];

  return (
    <section className="home-metrics">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          description={card.description}
        />
      ))}
    </section>
  );
}

export default HomeMetrics;
