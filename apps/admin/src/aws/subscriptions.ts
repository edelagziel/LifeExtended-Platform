/**
 * GraphQL Subscriptions for AppSync real-time updates
 */

export const ON_STATS_UPDATED = /* GraphQL */ `
  subscription OnStatsUpdated {
    onStatsUpdated {
      standings
    }
  }
`;
