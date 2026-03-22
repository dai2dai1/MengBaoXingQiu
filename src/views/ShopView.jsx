import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Gift, Video, Cookie, Ticket } from 'lucide-react';

export default function ShopView() {
  const { childrenData, redeemPoints } = useAppContext();
  const [selectedChildId, setSelectedChildId] = useState(childrenData.length > 0 ? childrenData[0].id : '');
  
  const rewards = [
    { id: 1, name: '看15分钟电视', cost: 10, icon: <Video color="#3b82f6" size={40} /> },
    { id: 2, name: '任意零食一份', cost: 20, icon: <Cookie color="#f97316" size={40} /> },
    { id: 3, name: '买个小玩具', cost: 100, icon: <Gift color="#f43f5e" size={40} /> },
    { id: 4, name: '周末游乐园门票', cost: 1000, icon: <Ticket color="#8b5cf6" size={40} /> }
  ];

  const handleRedeem = (reward) => {
    if (!selectedChildId) return alert('请先选择要兑换的孩子');
    const child = childrenData.find(c => c.id === selectedChildId);
    if (!child) return;
    
    if (child.points < reward.cost) {
      return alert(`积分不足！${child.name} 只有 ${child.points} 分，需要 ${reward.cost} 分。`);
    }
    
    if (confirm(`确定要花费 ${reward.cost} 积分给 ${child.name} 兑换 "${reward.name}" 吗？`)) {
      redeemPoints(selectedChildId, reward.cost, reward.name);
      alert('兑换成功！');
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s' }}>
      <h2 style={{ marginBottom: '20px' }}>积分商城</h2>
      
      {childrenData.length > 0 && (
        <div className="glass-panel" style={{ padding: '15px', marginBottom: '20px' }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: 'var(--text-light)' }}>为谁兑换？</p>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
            {childrenData.map(c => (
               <button 
                 key={c.id} 
                 onClick={() => setSelectedChildId(c.id)}
                 style={{ 
                   padding: '10px 15px', borderRadius: '15px', border: 'none',
                   background: selectedChildId === c.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.7)',
                   color: selectedChildId === c.id ? 'white' : 'var(--text-dark)',
                   fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
                   boxShadow: selectedChildId === c.id ? '0 4px 12px rgba(139, 92, 246, 0.4)' : 'none',
                   cursor: 'pointer', flexShrink: 0
                 }}>
                 <span style={{ fontSize: '1.2rem' }}>{c.avatar}</span> {c.name} ({c.points}分)
               </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {rewards.map(reward => (
          <div key={reward.id} className="glass-panel" style={{ padding: '15px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.85)' }}>
             <div style={{ marginBottom: '10px', background: '#f1f5f9', padding: '15px', borderRadius: '50%' }}>
               {reward.icon}
             </div>
             <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{reward.name}</h4>
             <div style={{ color: 'var(--secondary-color)', fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '15px' }}>
                {reward.cost} <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>积分</span>
             </div>
             <button 
               onClick={() => handleRedeem(reward)}
               style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, var(--primary-color), #a855f7)', border: 'none', color: 'white', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)' }}>
               兑换
             </button>
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-light)', fontSize: '0.9rem' }}>
        * 更多礼物与商品正在路上...
      </div>
    </div>
  );
}
