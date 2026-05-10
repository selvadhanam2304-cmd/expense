'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Shield, Mic, BarChart3, Target, 
  Smartphone, Zap, CreditCard, Layout
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';


export default function LandingPage() {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      {/* Navigation */}
      <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
        <h1 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>ExpenseTracker</h1>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="/dashboard" style={{ color: 'var(--muted-foreground)', fontWeight: 500, fontSize: '0.9rem' }}>Explore Demo</Link>
          {user ? (
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--muted-foreground)' }}>
                Hi, {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </span>
              <Link href="/dashboard" style={{ 
                background: 'var(--primary)', color: 'white', padding: '0.6rem 1.25rem', 
                borderRadius: 'var(--radius)', fontWeight: 600, fontSize: '0.9rem' 
              }}>Dashboard</Link>
            </div>
          ) : (
            <>
              <Link href="/login" style={{ color: 'white', fontWeight: 500, fontSize: '0.9rem' }}>Login</Link>
              <Link href="/signup" style={{ 
                background: 'var(--primary)', color: 'white', padding: '0.6rem 1.25rem', 
                borderRadius: 'var(--radius)', fontWeight: 600, fontSize: '0.9rem' 
              }}>Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container" style={{ paddingTop: '5rem', paddingBottom: '8rem', textAlign: 'center' }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
            <span style={{ 
              background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', 
              padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '1px'
            }}>
              Master Your Finances
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '2rem' }}>
            Smart Tracking for <br />
            <span className="gradient-text">Modern Living</span>
          </motion.h1>

          <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', color: 'var(--muted-foreground)', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
            The all-in-one financial companion that uses AI and voice input to help you track spending, set budgets, and achieve savings goals effortlessly.
          </motion.p>

          <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ 
              background: 'var(--primary)', color: 'white', padding: '1rem 2.5rem', 
              borderRadius: 'var(--radius)', fontWeight: 700, fontSize: '1.1rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)'
            }}>
              Start Free Today <ArrowRight size={20} />
            </Link>
            <Link href="/dashboard" style={{ 
              background: 'var(--secondary)', color: 'white', padding: '1rem 2.5rem', 
              borderRadius: 'var(--radius)', fontWeight: 700, fontSize: '1.1rem',
              border: '1px solid var(--border)'
            }}>
              View Demo
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <div style={{ marginTop: '10rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {[
            { icon: <Mic />, title: "Voice Input", desc: "Just say 'I spent 500 on coffee' and we'll handle the rest." },
            { icon: <BarChart3 />, title: "Deep Analytics", desc: "Visualize your spending with beautiful interactive charts." },
            { icon: <Target />, title: "Savings Goals", desc: "Set targets for what matters most and track your progress." },
            { icon: <Zap />, title: "Smart Insights", desc: "Get AI-driven tips based on your spending patterns." },
            { icon: <Shield />, title: "Bank-Level Security", desc: "Your data is encrypted and private by default." },
            { icon: <Layout />, title: "Modern Interface", desc: "Dark mode, glassmorphism, and smooth animations." }
          ].map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="glass" 
              style={{ padding: '2.5rem', textAlign: 'left', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Social Proof Section */}
      <section style={{ padding: '8rem 0', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '4rem' }}>Why 10,000+ users love us</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { text: "The voice input is a game changer. I never forget to add an expense now!", author: "Sonia R." },
              { text: "The insights helped me save over ₹20,000 in just three months.", author: "Arjun K." },
              { text: "Most beautiful and functional expense tracker I've ever used.", author: "David M." }
            ].map((t, i) => (
              <div key={i} className="glass" style={{ padding: '2rem', fontStyle: 'italic' }}>
                <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>"{t.text}"</p>
                <cite style={{ fontWeight: 600, color: 'var(--primary)', fontStyle: 'normal' }}>— {t.author}</cite>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container" style={{ padding: '4rem 0', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ color: 'var(--muted-foreground)' }}>&copy; 2026 ExpenseTracker. All rights reserved.</p>
      </footer>
    </div>
  );
}
