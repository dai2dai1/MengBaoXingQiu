import React from 'react';

export default function ChildCard({ child, onClick }) {
  return (
    <div 
      className="glass-panel" 
      onClick={onClick}
      style={{ 
        padding: '20px', 
        marginBottom: '15px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
      }}
      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '2rem', display: 'inline-block', background: 'rgba(255,255,255,0.6)', padding: '5px', borderRadius: '50%' }}>{child.avatar || '👦'}</span> 
          {child.name}
        </h2>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)' }}>
          已记录 {child.history.length} 个事件
        </p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>
          {child.points}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>总积分</div>
      </div>
    </div>
  );
}
