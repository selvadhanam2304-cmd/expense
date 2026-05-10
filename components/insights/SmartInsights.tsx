'use client';

import React from 'react';
import { Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Insight {
  type: 'info' | 'warning' | 'success';
  message: string;
}

export default function SmartInsights({ currentMonthExpense, lastMonthExpense, topCategory }: {
  currentMonthExpense: number;
  lastMonthExpense: number;
  topCategory: string;
}) {
  const insights: Insight[] = [];

  const diff = currentMonthExpense - lastMonthExpense;
  const percentage = lastMonthExpense > 0 ? (diff / lastMonthExpense) * 100 : 0;

  if (percentage > 20) {
    insights.push({ 
      type: 'warning', 
      message: `You've spent ${percentage.toFixed(1)}% more than last month. Consider reviewing your top categories.` 
    });
  } else if (percentage < 0) {
    insights.push({ 
      type: 'success', 
      message: `Great job! You've spent ${Math.abs(percentage).toFixed(1)}% less than last month.` 
    });
  }

  if (topCategory) {
    insights.push({ 
      type: 'info', 
      message: `Your highest spending category this month is ${topCategory}.` 
    });
  }

  if (insights.length === 0) {
    insights.push({ type: 'info', message: "Keep tracking your expenses to see personalized insights here!" });
  }

  return (
    <div className="glass" style={{ padding: '1.5rem', marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <Lightbulb className="text-yellow-400" size={24} />
        <h3 style={{ fontWeight: 600 }}>Smart Insights</h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {insights.map((insight, idx) => (
          <div key={idx} style={{ 
            display: 'flex', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius)', 
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
            alignItems: 'center'
          }}>
            {insight.type === 'warning' && <AlertTriangle className="text-red-400" size={20} />}
            {insight.type === 'success' && <CheckCircle2 className="text-green-400" size={20} />}
            {insight.type === 'info' && <Lightbulb className="text-blue-400" size={20} />}
            <span style={{ fontSize: '0.925rem' }}>{insight.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
