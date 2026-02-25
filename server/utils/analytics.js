export function calculateRecoveryScore(data) {
    let score = 100;
  
    if (data.sleep < 6) score -= 20;
    if (data.soreness > 6) score -= 25;
    if (data.avg_hr > 160) score -= 15;
  
    return Math.max(score, 10);
  }