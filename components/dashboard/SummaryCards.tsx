'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react';

interface SummaryCardsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  currency?: string;
}

export default function SummaryCards({ totalBalance, totalIncome, totalExpenses, currency = '₹' }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Balance',
      amount: totalBalance,
      icon: <Wallet className="text-blue-400" />,
      color: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      amountColor: totalBalance >= 0 ? 'var(--income)' : 'var(--expense)'
    },
    {
      title: 'Total Income',
      amount: totalIncome,
      icon: <TrendingUp className="text-green-400" />,
      color: 'linear-gradient(135deg, #1e293b 0%, #064e3b 100%)',
      amountColor: 'var(--income)'
    },
    {
      title: 'Total Expenses',
      amount: totalExpenses,
      icon: <TrendingDown className="text-red-400" />,
      color: 'linear-gradient(135deg, #1e293b 0%, #450a0a 100%)',
      amountColor: 'var(--expense)'
    }
  ];

  return (
    <div className="grid-auto" style={{ marginBottom: '2rem' }}>
      {cards.map((card, index) => (
        <div 
          key={index} 
          className="glass" 
          style={{ 
            padding: '1.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            background: card.color
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--muted-foreground)' }}>{card.title}</span>
            <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)' }}>
              {card.icon}
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: card.amountColor }}>
            {currency} {card.amount.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
