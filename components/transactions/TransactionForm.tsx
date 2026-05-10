'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Plus, X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface TransactionFormProps {
  onAdd: (transaction: any) => void;
  onClose: () => void;
}

const EXPENSE_CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Others'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Gifts', 'Investment', 'Others'];


export default function TransactionForm({ onAdd, onClose }: TransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Others');

  // Reset category when type changes
  useEffect(() => {
    setCategory('Others');
  }, [type]);

  const currentCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('speechRecognition' in window)) {
      toast.error('Voice input is not supported in this browser.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      toast('Listening...', { icon: '🎙️' });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log('Transcript:', transcript);
      
      // Basic AI logic to parse: "I spent 100 on food"
      const amountMatch = transcript.match(/\d+/);
      if (amountMatch) setAmount(amountMatch[0]);
      
      const cats = transcript.includes('income') || transcript.includes('earned') ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
      const categoryMatch = cats.find(cat => transcript.includes(cat.toLowerCase()));
      
      if (categoryMatch) setCategory(categoryMatch);
      if (transcript.includes('income') || transcript.includes('earned')) setType('income');
      if (transcript.includes('spent') || transcript.includes('expense')) setType('expense');
      
      toast.success('Fields auto-filled from voice!');
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error('Voice recognition error.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const transaction = {
      amount: parseFloat(amount),
      type,
      category,
      date,
      note,
    };

    try {
      await onAdd(transaction);
      onClose();
    } catch (error) {
      // Toast handled in parent
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
      <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <h2 style={{ marginBottom: '1.5rem', fontWeight: 700, fontSize: '1.5rem' }}>Add Transaction</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--secondary)', padding: '0.25rem', borderRadius: 'var(--radius)' }}>
            <button 
              type="button"
              onClick={() => setType('expense')}
              style={{ 
                flex: 1, padding: '0.5rem', borderRadius: 'calc(var(--radius) - 4px)', border: 'none',
                background: type === 'expense' ? 'var(--expense)' : 'transparent',
                color: 'white', fontWeight: 600, cursor: 'pointer', transition: '0.2s'
              }}
            >
              Expense
            </button>
            <button 
              type="button"
              onClick={() => setType('income')}
              style={{ 
                flex: 1, padding: '0.5rem', borderRadius: 'calc(var(--radius) - 4px)', border: 'none',
                background: type === 'income' ? 'var(--income)' : 'transparent',
                color: 'white', fontWeight: 600, cursor: 'pointer', transition: '0.2s'
              }}
            >
              Income
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Amount</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                style={{
                  width: '100%', background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                  padding: '0.75rem', color: 'white', outline: 'none'
                }}
              />
              <button 
                type="button" 
                onClick={startListening}
                style={{
                  position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
                  background: isListening ? 'var(--expense)' : 'var(--primary)', color: 'white',
                  border: 'none', borderRadius: '0.5rem', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                  padding: '0.75rem', color: 'white', outline: 'none'
                }}
              >
                {currentCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}

              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={{
                  background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                  padding: '0.75rem', color: 'white', outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Note (Optional)</label>
            <textarea
              placeholder="What was this for?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{
                background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                padding: '0.75rem', color: 'white', outline: 'none', resize: 'none', height: '80px'
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
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
