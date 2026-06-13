// server/utils/insightEngine.js

export function generateInsights(metrics) {
  if (!metrics) {
    return [{
      type: "data_missing",
      severity: "low",
      message: "No data available to generate insights.",
      explanation: "Metrics object was empty or undefined.",
      suggestedActions: ["Ensure dashboard data is being collected correctly."]
    }];
  }

  const insights = [];
  const { revenueChange, trafficChange, conversionChange } = metrics;

  // Rule 1: Conversion issue
  if (revenueChange < 0 && trafficChange >= 0 && conversionChange < 0) {
    insights.push({
      type: "conversion_issue",
      severity: "high",
      message:
        "Revenue declined despite stable traffic, indicating a conversion problem.",
      explanation:
        "Users are visiting the site but fewer are completing desired actions such as purchases or sign-ups.",
      suggestedActions: [
        "Review landing page UX",
        "Check checkout or form errors",
        "Analyze recent UI or pricing changes"
      ]
    });
  }

  // Rule 2: Traffic drop issue
  if (trafficChange < 0 && revenueChange < 0) {
    insights.push({
      type: "traffic_drop",
      severity: "medium",
      message:
        "Both traffic and revenue have declined.",
      explanation:
        "Reduced user acquisition is likely contributing to revenue loss.",
      suggestedActions: [
        "Review marketing campaign performance",
        "Check SEO or ad spend changes"
      ]
    });
  }

  // Rule 3: Healthy state
  if (insights.length === 0) {
    insights.push({
      type: "stable",
      severity: "low",
      message: "All key metrics appear stable.",
      explanation:
        "No abnormal patterns were detected across revenue, traffic, or conversion.",
      suggestedActions: ["Continue monitoring performance trends."]
    });
  }

  return insights;
}
