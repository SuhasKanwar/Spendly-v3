export function formatStockAnalysis(stockName: string, analysis: string) {
  return `## ${stockName} Stock Analysis

### Current Price
${extractSection(analysis, "Current Stock Price")}

### Performance
${extractSection(analysis, "Recent Performance")}

### Market Trends
${extractSection(analysis, "Trends")}

### Key Metrics
${formatMetrics(extractSection(analysis, "Key Metrics"))}

### Valuation
${extractSection(analysis, "Valuation")}

### Recommendation
${extractSection(analysis, "Recommendation")}

### Action Items
${formatActionItems(extractSection(analysis, "Actionable Advice"))}

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

function formatActionItems(items: string): string {
  return items
    .split('*')
    .filter(item => item.trim())
    .map(item => `- ${item.trim()}`)
    .join('\n');
}