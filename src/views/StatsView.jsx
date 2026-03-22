import React from 'react';
import { useAppContext } from '../store/AppContext';
import { Trophy, TrendingUp, AlertTriangle } from 'lucide-react';

export default function StatsView() {
  const { childrenData } = useAppContext();
  
  if (childrenData.length === 0) return <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>暂无儿童数据，请先在设置中添加</div>;

  return (
    <div style={{ animation: 'fadeIn 0.3s', paddingBottom: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>双子星际分析数据面板</h2>
      
      {childrenData.map(child => {
        const adds = child.history.filter(h => h.action === 'add').reduce((sum, h) => sum + h.value, 0);
        const deducts = child.history.filter(h => h.action === 'deduct' && !h.reason.includes('兑换')).reduce((sum, h) => sum + h.value, 0);
        const redeems = child.history.filter(h => h.reason.includes('兑换')).reduce((sum, h) => sum + h.value, 0);
        
        const totalActivity = child.history.length;

        return (
          <div key={child.id} className="glass-panel" style={{ padding: '20px', marginBottom: '25px', background: 'rgba(255,255,255,0.75)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ fontSize: '3rem', background: 'rgba(255,255,255,0.5)', borderRadius: '50%', padding: '10px', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                {child.avatar}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-dark)' }}>{child.name} 的总况</h3>
                <span style={{ color: 'var(--primary-color)', fontSize: '1rem', fontWeight: 'bold' }}>目前可用分: {child.points}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.7)', padding: '15px', borderRadius: '15px', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, borderRight: '1px solid rgba(0,0,0,0.05)' }}>
                 <TrendingUp color="#10b981" size={28} style={{ marginBottom: '5px' }} />
                 <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#10b981' }}>+{adds}</div>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>历史累获</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, borderRight: '1px solid rgba(0,0,0,0.05)' }}>
                 <Trophy color="#f59e0b" size={28} style={{ marginBottom: '5px' }} />
                 <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#f59e0b' }}>-{redeems}</div>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>已花兑换</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                 <AlertTriangle color="#ef4444" size={28} style={{ marginBottom: '5px' }} />
                 <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#ef4444' }}>-{deducts}</div>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>违规扣分</div>
              </div>
            </div>
            
            <div style={{ marginTop: '15px', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.85rem' }}>
              🎖️ 总共发生了 {totalActivity} 次事件互动
            </div>
          </div>
        )
      })}
    </div>
  );
}
