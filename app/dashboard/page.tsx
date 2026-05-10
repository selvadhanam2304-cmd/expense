'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import SummaryCards from '@/components/dashboard/SummaryCards';
import Charts from '@/components/dashboard/Charts';
import TransactionForm from '@/components/transactions/TransactionForm';
import BudgetCard from '@/components/dashboard/BudgetCard';
import GoalsProgress from '@/components/goals/GoalsProgress';
import SmartInsights from '@/components/insights/SmartInsights';
import GoalForm from '@/components/goals/GoalForm';
import { Plus, Download, LogOut, LayoutDashboard, History, Target, Lightbulb, PieChart, Flame, Minus, X, Home } from 'lucide-react';

import { toast } from 'react-hot-toast';
import { format, subMonths } from 'date-fns';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({ balance: 0, income: 0, expense: 0, lastMonthExpense: 0 });
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [budget, setBudget] = useState(5000);
  const [goals, setGoals] = useState<any[]>([]);
  const [streak, setStreak] = useState(5);
  const [showGoalForm, setShowGoalForm] = useState(false);

  // Expose showGoalForm to window for GoalsProgress component
  useEffect(() => {
    (window as any).showGoalForm = () => setShowGoalForm(true);
    return () => { delete (window as any).showGoalForm; };
  }, []);


  const calculateStats = (data: any[]) => {
    let income = 0;
    let expense = 0;
    let currentMonthExp = 0;
    let lastMonthExp = 0;
    const categories: any = {};
    const months: any = {};

    const now = new Date();
    const currentMonthStr = format(now, 'MMM');
    const lastMonthStr = format(subMonths(now, 1), 'MMM');

    data.forEach(t => {
      const amt = parseFloat(t.amount);
      const tDate = new Date(t.date);
      const mStr = format(tDate, 'MMM');

      if (t.type === 'income') income += amt;
      else {
        expense += amt;
        if (mStr === currentMonthStr) {
          currentMonthExp += amt;
          categories[t.category] = (categories[t.category] || 0) + amt;
        }
        if (mStr === lastMonthStr) lastMonthExp += amt;
      }

      if (!months[mStr]) months[mStr] = { name: mStr, income: 0, expense: 0 };
      if (t.type === 'income') months[mStr].income += amt;
      else months[mStr].expense += amt;
    });

    setStats({ balance: income - expense, income, expense, lastMonthExpense: lastMonthExp });
    setCategoryData(Object.entries(categories).map(([name, value]) => ({ name, value })));
    setMonthlyData(Object.values(months).slice(0, 6).reverse());
  };

  const fetchData = useCallback(async () => {
    if (!user) {
      // Load sample data for guest mode
      const sampleTransactions = [
        { id: '1', amount: 3500, type: 'income', category: 'Others', date: format(new Date(), 'yyyy-MM-dd'), note: 'Freelance work' },
        { id: '2', amount: 450, type: 'expense', category: 'Food', date: format(new Date(), 'yyyy-MM-dd'), note: 'Lunch' },
        { id: '3', amount: 1200, type: 'expense', category: 'Shopping', date: format(subMonths(new Date(), 1), 'yyyy-MM-dd'), note: 'New shoes' },
        { id: '4', amount: 5000, type: 'income', category: 'Others', date: format(subMonths(new Date(), 1), 'yyyy-MM-dd'), note: 'Salary' },
      ];
      setTransactions(sampleTransactions);
      calculateStats(sampleTransactions);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
      calculateStats(data || []);
      
      const { data: goalsData } = await supabase.from('goals').select('*').eq('user_id', user.id);
      setGoals(goalsData || []);
    } catch (error: any) {
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addTransaction = async (transaction: any) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    try {
      const { error } = await supabase
        .from('transactions')
        .insert([{ ...transaction, user_id: user?.id }]);

      if (error) throw error;
      toast.success('Transaction added!');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const addGoal = async (goal: any) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    try {
      const { error } = await supabase
        .from('goals')
        .insert([{ ...goal, user_id: user?.id }]);

      if (error) throw error;
      toast.success('Savings goal added!');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const exportPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    
    doc.text('Expense Report', 14, 15);
    const tableData = transactions.map(t => [t.date, t.type, t.category, t.amount, t.note]);
    
    autoTable(doc, {
      head: [['Date', 'Type', 'Category', 'Amount', 'Note']],
      body: tableData,
      startY: 20,
    });
    
    doc.save('expense-report.pdf');
  };

  const exportExcel = async () => {
    const XLSX = await import('xlsx');
    const ws = XLSX.utils.json_to_sheet(transactions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "expense-report.xlsx");
  };

  if (loading && user) return (
    <div className="flex-center" style={{ minHeight: '100vh' }}>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Loading your data...</h2>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar - Desktop */}
      <aside className="glass" style={{ width: '280px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', margin: '1rem', height: 'calc(100vh - 2rem)', position: 'sticky', top: '1rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>ExpenseTracker</h1>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius)', background: 'transparent', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer', textDecoration: 'none' }}>
            <Home size={20} /> Back to Home
          </Link>
          <button onClick={() => scrollToSection('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius)', background: 'var(--accent)', border: 'none', color: 'white', cursor: 'pointer' }}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => user ? scrollToSection('transactions') : (window.location.href = '/login')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius)', background: 'transparent', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}>
            <History size={20} /> Transactions
          </button>
          <button onClick={() => user ? scrollToSection('goals') : (window.location.href = '/login')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius)', background: 'transparent', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}>
            <Target size={20} /> Goals
          </button>
          <button onClick={() => user ? scrollToSection('insights') : (window.location.href = '/login')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius)', background: 'transparent', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}>
            <Lightbulb size={20} /> Insights
          </button>

        </nav>
        <div style={{ marginTop: 'auto' }}>
          <button 
            onClick={() => user ? signOut() : (window.location.href = '/login')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius)', background: 'transparent', border: '1px solid var(--border)', color: user ? 'var(--expense)' : 'var(--primary)', cursor: 'pointer', width: '100%' }}
          >
            <LogOut size={20} /> {user ? 'Logout' : 'Login'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>
              {user ? `Welcome, ${user.user_metadata.full_name || 'User'}!` : 'Exploring ExpenseTracker (Demo)'}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
              <p style={{ color: 'var(--muted-foreground)' }}>
                {user ? "Here's your financial overview" : "Viewing sample data. Login to save your own."}
              </p>
              {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                  <Flame size={14} /> {streak} Day Streak
                </div>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', background: 'var(--secondary)', borderRadius: 'var(--radius)', padding: '0.25rem' }}>
              <button onClick={() => user ? exportPDF() : (window.location.href = '/login')} style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }} title="Export PDF"><Download size={20} /></button>
              <button onClick={() => user ? exportExcel() : (window.location.href = '/login')} style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }} title="Export Excel"><PieChart size={20} /></button>
            </div>
            <button 
              onClick={() => user ? setShowForm(true) : (window.location.href = '/login')}
              style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            >
              <Plus size={20} /> {user ? 'Add Transaction' : 'Login to Add'}
            </button>
          </div>
        </header>

        <SummaryCards totalBalance={stats.balance} totalIncome={stats.income} totalExpenses={stats.expense} />
        
        <div id="goals" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <BudgetCard spent={stats.expense} limit={budget} />
          <GoalsProgress goals={goals} />
        </div>


        <div id="insights">
          <Charts categoryData={categoryData} monthlyData={monthlyData} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <section id="transactions" className="glass" style={{ marginTop: '2rem', padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Recent Transactions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {transactions.slice(0, 5).map((t, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '10px', background: t.type === 'income' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.type === 'income' ? 'var(--income)' : 'var(--expense)'
                    }}>
                      {t.type === 'income' ? <Plus size={20} /> : <Minus size={20} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{t.category}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{t.date} • {t.note || 'No note'}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: t.type === 'income' ? 'var(--income)' : 'var(--expense)' }}>
                    {t.type === 'income' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <SmartInsights 
            currentMonthExpense={stats.expense} 
            lastMonthExpense={stats.lastMonthExpense} 
            topCategory={categoryData[0]?.name || ''} 
          />
        </div>
      </main>

      {showForm && <TransactionForm onAdd={addTransaction} onClose={() => setShowForm(false)} />}
      {showGoalForm && <GoalForm onAdd={addGoal} onClose={() => setShowGoalForm(false)} />}
    </div>

  );
}
