import React from 'react';
import { useAppContext } from '../store/AppContext';
import { PlusCircle, MinusCircle, Gift } from 'lucide-react';

export default function RecordsView() {
  const { childrenData } = useAppContext();
  
  // Aggregate all history
  const allHistory = childrenData.flatMap(c => c.history.map(h => ({...h, childName: c.name, avatar: c.avatar})))
    .sort((a,b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={{ animation: 'fadeIn 0.3s', paddingBottom: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>全站事件总长廊</h2>
      
      <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.6)' }}>
        {allHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#94a3b8' }}>
            <p style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>🍃</p>
            还没产生任何岁月痕迹哦
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {allHistory.map(item => {
              const isRedeem = item.reason.includes('兑换');
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.85)', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '2rem', marginRight: '15px', background: 'rgba(255,255,255,0.5)', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem', color: isRedeem ? 'var(--primary-color)' : 'inherit' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--text-dark)' }}>{item.childName}</span> - {item.reason}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '4px' }}>
                      {new Date(item.date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: '900', fontSize: '1.2rem', 
                    color: item.action === 'add' ? '#10b981' : (isRedeem ? 'var(--primary-color)' : 'var(--secondary-color)'),
                    display: 'flex', alignItems: 'center', gap: '5px'
                  }}>
                    {item.action === 'add' ? <PlusCircle size={20} /> : (isRedeem ? <Gift size={20}/> : <MinusCircle size={20} />)}
                    {item.action === 'add' ? '+' : '-'}{item.value}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
