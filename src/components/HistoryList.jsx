import React from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';

export default function HistoryList({ history, childName }) {
  if (!history || history.length === 0) return <p style={{ textAlign: 'center', color: '#999' }}>暂无记录</p>;

  return (
    <div className="glass-panel" style={{ padding: '15px', marginTop: '10px' }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '1.1rem' }}>{childName} 的记录明细</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '50vh', overflowY: 'auto' }}>
        {history.map(item => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.5)', borderRadius: '10px' }}>
            {item.action === 'add' ? 
              <PlusCircle color="var(--primary-color)" size={24} style={{ marginRight: '10px' }} /> :
              <MinusCircle color="var(--secondary-color)" size={24} style={{ marginRight: '10px' }} />
            }
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500 }}>{item.reason}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                {new Date(item.date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div style={{ fontWeight: 'bold', color: item.action === 'add' ? 'var(--primary-color)' : 'var(--secondary-color)' }}>
              {item.action === 'add' ? '+' : '-'}{item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
