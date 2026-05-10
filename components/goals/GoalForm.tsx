'use client';

import React, { useState } from 'react';
import { Plus, X, Loader2, Trophy } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface GoalFormProps {
  onAdd: (goal: any) => Promise<void>;
  onClose: () => void;
}

export default function GoalForm({ onAdd, onClose }: GoalFormProps) {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('0');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(targetAmount) <= 0) {
      toast.error('Target amount must be greater than 0');
      return;
    }
    
    setLoading(true);
    try {
      await onAdd({
        title,
        target_amount: parseFloat(targetAmount),
        saved_amount: parseFloat(savedAmount),
      });
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <h2 style={{ marginBottom: '1.5rem', fontWeight: 700, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Trophy size={24} className="text-yellow-400" /> Add Savings Goal
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Goal Name</label>
            <input
              type="text"
              placeholder="e.g. New Macbook, Car, Vacation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: '100%', background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                padding: '0.75rem', color: 'white', outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Target Amount (₹)</label>
            <input
              type="number"
              placeholder="0.00"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
              style={{
                width: '100%', background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                padding: '0.75rem', color: 'white', outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Already Saved (₹)</label>
            <input
              type="number"
              placeholder="0.00"
              value={savedAmount}
              onChange={(e) => setSavedAmount(e.target.value)}
              style={{
                width: '100%', background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                padding: '0.75rem', color: 'white', outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)',
              padding: '0.75rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem'
            }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            Set Goal
          </button>
        </form>
      </div>
    </div>
  );
}
