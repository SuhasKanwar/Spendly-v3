export function formatMutualFundAnalysis(fundName: string, analysis: string): string {
  return `## ${fundName} Mutual Fund Analysis

### Fund Performance
${extractSection(analysis, "Fund Performance")}

### Underlying Assets
${extractSection(analysis, "Underlying Assets")}

### Risk Metrics
${formatMetrics(extractSection(analysis, "Risk Metrics"))}

### Expense Ratio
${extractSection(analysis, "Expense Ratio")}

### Recommendation
${extractSection(analysis, "Recommendation")}

### Actionable Insights
${formatActionItems(extractSection(analysis, "Actionable Insights"))}

---
*Note: This analysis is for informational purposes only.*`;
}

function extractSection(text: string, sectionName: string): string {
  const regex = new RegExp(`\\*\\*${sectionName}:\\*\\* (.*?)(?=\\*\\*|$)`, 's');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

function formatMetrics(metrics: string): string {
  return metrics
    .split('*')
    .filter(m => m.trim())
    .map(m => `- ${m.trim()}`)
    .join('\n');
}

function formatActionItems(actions: string): string {
  return actions
    .split('*')
    .filter(a => a.trim())
    .map(a => `- ${a.trim()}`)
    .join('\n');
}