'use client';

import React from 'react';
import { Trophy, Plus } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  target_amount: number;
  saved_amount: number;
}

export default function GoalsProgress({ goals }: { goals: Goal[] }) {
  return (
    <div className="glass" style={{ padding: '1.5rem', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Trophy size={20} className="text-yellow-400" /> Savings Goals
        </h3>
        <button 
          onClick={() => (window as any).showGoalForm && (window as any).showGoalForm()}
          style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Plus size={18} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {goals.map((goal) => {
          const percentage = (goal.saved_amount / goal.target_amount) * 100;
          return (
            <div key={goal.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>{goal.title}</span>
                <span style={{ fontSize: '0.875rem' }}>₹{goal.saved_amount.toLocaleString()} / ₹{goal.target_amount.toLocaleString()}</span>
              </div>
              <div style={{ height: '8px', background: 'var(--secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${Math.min(percentage, 100)}%`, 
                  background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)',
                  transition: 'width 0.5s ease-in-out'
                }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.25rem', textAlign: 'right' }}>
                {percentage.toFixed(0)}% Complete
              </div>
            </div>
          );
        })}
        {goals.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
            No savings goals set yet.
          </p>
        )}
      </div>
    </div>
  );
}
