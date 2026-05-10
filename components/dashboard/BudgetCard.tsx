'use client';

import React from 'react';
import { Target, AlertCircle } from 'lucide-react';

interface BudgetCardProps {
  spent: number;
  limit: number;
}

export default function BudgetCard({ spent, limit }: BudgetCardProps) {
  const percentage = (spent / limit) * 100;
  const remaining = limit - spent;
  const isOver = spent > limit;

  return (
    <div className="glass" style={{ padding: '1.5rem', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target size={20} className="text-blue-400" /> Monthly Budget
        </h3>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isOver ? 'var(--expense)' : 'var(--income)' }}>
          {isOver ? 'Limit Exceeded' : `${percentage.toFixed(0)}% used`}
        </span>
      </div>

      <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        ₹{spent.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--muted-foreground)', fontWeight: 400 }}>/ ₹{limit.toLocaleString()}</span>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '8px', background: 'var(--secondary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
        <div style={{ 
          height: '100%', 
          width: `${Math.min(percentage, 100)}%`, 
          background: isOver ? 'var(--expense)' : 'var(--primary)',
          transition: 'width 0.5s ease-in-out'
        }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: isOver ? 'var(--expense)' : 'var(--muted-foreground)' }}>
        {isOver ? (
          <><AlertCircle size={16} /> You are over budget by ₹{Math.abs(remaining).toLocaleString()}!</>
        ) : (
          `₹${remaining.toLocaleString()} remaining for this month`
        )}
      </div>
    </div>
  );
}
