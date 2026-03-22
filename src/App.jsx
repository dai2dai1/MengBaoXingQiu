import React, { useState } from 'react';
import { useAppContext } from './store/AppContext';
import ChildCard from './components/ChildCard';
import HistoryList from './components/HistoryList';
import VoiceFAB from './components/VoiceFAB';
import SyncModal from './components/SyncModal';
import ShopView from './views/ShopView';
import StatsView from './views/StatsView';
import RecordsView from './views/RecordsView';
import { Home, ShoppingBag, BarChart2, Clock, Settings, RefreshCw, Trash2, Edit2, QrCode } from 'lucide-react';

function App() {
  const { childrenData, updateChild, addChild, deleteChild, clearHistory } = useAppContext();
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [newChildName, setNewChildName] = useState('');
  const [newChildNicknames, setNewChildNicknames] = useState('');
  const [newChildAvatar, setNewChildAvatar] = useState('👶');
  const [confirmClearId, setConfirmClearId] = useState(null); // track which child we're confirming clear for
  const [activeTab, setActiveTab] = useState('home');

  // Convert uploaded image to base64 data URL
  const handleImageUpload = (e, target, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setter(prev => ({...prev, avatar: ev.target.result}));
    };
    reader.readAsDataURL(file);
  };

  const handleNewImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setNewChildAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const selectedChild = childrenData.find(c => c.id === selectedChildId);

  return (
    <div style={{ padding: '20px', paddingBottom: '120px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            萌宝星球 🌟
          </h1>
          <p style={{ margin: '5px 0 0 0', color: 'var(--text-light)', fontSize: '0.9rem' }}>积分成长，一起加油！</p>
        </div>
        <button 
          onClick={() => { setShowSettings(!showSettings); if(!showSettings) setSelectedChildId(null); }}
          style={{ background: 'white', border: '1px solid rgba(0,0,0,0.05)', color: showSettings ? 'var(--primary-color)' : 'var(--text-light)', cursor: 'pointer', padding: '8px', borderRadius: '50%', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', transition: 'all 0.3s' }}
        >
          <Settings size={28} />
        </button>
      </header>

      {showSettings ? (
        <div className="glass-panel" style={{ padding: '20px', animation: 'fadeIn 0.3s' }}>
          <h2>数据同步设定</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            通过专属的压缩二维码，您可以完全离线的将数据从一台手机同步到另一台手机上。（推荐父母之间同步使用）
          </p>
          <button style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
            background: 'linear-gradient(135deg, var(--primary-color), #818cf8)', color: 'white', fontWeight: 'bold',
            marginTop: '20px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
          }}
          onClick={() => setShowSyncModal(true)}
          >
            <QrCode size={20} /> 打开二维码极速同步
          </button>
          
          <div style={{ height: '1px', background: '#e2e8f0', margin: '30px 0' }}></div>

          <h2 style={{ marginTop: 0 }}>儿童管理与设置</h2>
          
          {/* Children Management */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--primary-color)' }}>当前儿童列表</h3>
            {childrenData.map(child => (
              <div key={child.id} style={{ background: 'rgba(255,255,255,0.5)', padding: '10px', borderRadius: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {editingChild?.id === child.id ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px', marginRight: '10px' }}>
                    <input value={editingChild.name} onChange={e => setEditingChild({...editingChild, name: e.target.value})} placeholder="姓名" style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }} />
                    <input value={editingChild.nicknames.join(',')} onChange={e => setEditingChild({...editingChild, nicknames: e.target.value.split(',')})} placeholder="小名(逗号分隔)" style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }} />
                    
                    {/* Avatar Section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.6)', padding: '10px', borderRadius: '8px', border: '1px solid #eee' }}>
                      <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', background: '#f0f0f0', flexShrink: 0 }}>
                        {editingChild.avatar?.startsWith('data:') 
                          ? <img src={editingChild.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : (editingChild.avatar || '👦')}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: '#666' }}>头像：输入Emoji或上传照片</p>
                        <input value={editingChild.avatar?.startsWith('data:') ? '' : (editingChild.avatar || '')} onChange={e => setEditingChild({...editingChild, avatar: e.target.value})} placeholder="👶 Emoji头像" maxLength={2} style={{ width: '90px', padding: '6px', borderRadius: '8px', border: '1px solid #ccc', marginRight: '5px', textAlign: 'center', fontSize: '1.1rem' }} />
                        <label style={{ padding: '6px 10px', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                          📷 上传照片
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e, editingChild, setEditingChild)} />
                        </label>
                      </div>
                    </div>
                    
                    <button onClick={() => { updateChild(editingChild.id, editingChild.name, editingChild.nicknames.join(','), editingChild.avatar); setEditingChild(null); }} style={{ padding: '8px', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>保存</button>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.5rem', background: 'white', borderRadius: '50%', padding: '5px' }}>{child.avatar || '👦'}</span>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{child.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>小名: {child.nicknames.join(', ')}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => setEditingChild(child)} style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', cursor: 'pointer' }}><Edit2 size={18} /></button>
                      <button onClick={() => { if(confirm('确认删除该儿童吗？全部记录也将丢失！')) deleteChild(child.id) }} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                    </div>
                  </>
                )}
              </div>
            ))}

              {/* Add New Child */}
            <div style={{ background: 'rgba(255,255,255,0.3)', padding: '15px', borderRadius: '10px', marginTop: '15px', border: '1px dashed var(--primary-color)' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>新增儿童</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                 {/* Avatar preview */}
                 <div style={{ width: '55px', height: '55px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', flexShrink: 0, fontSize: '1.5rem' }}>
                   {newChildAvatar?.startsWith('data:')
                     ? <img src={newChildAvatar} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                     : newChildAvatar}
                 </div>
                 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                   <input value={newChildAvatar?.startsWith('data:') ? '' : newChildAvatar} onChange={e => setNewChildAvatar(e.target.value)} placeholder="🌟 Emoji" maxLength={2} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', textAlign: 'center', fontSize: '1.1rem' }} />
                   <label style={{ display: 'block', padding: '6px', background: '#f1f5f9', border: '1px dashed #a78bfa', color: 'var(--primary-color)', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontSize: '0.85rem', fontWeight: 'bold' }}>
                     📸 上传照片
                     <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleNewImageUpload} />
                   </label>
                 </div>
                 <input value={newChildName} onChange={e => setNewChildName(e.target.value)} placeholder="孩子姓名" style={{ flex: 1.5, padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
              </div>
              <input value={newChildNicknames} onChange={e => setNewChildNicknames(e.target.value)} placeholder="语音别名，逗号分隔 (如: 红红,乖乖)" style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
              <button onClick={() => { addChild(newChildName, newChildNicknames, newChildAvatar); setNewChildName(''); setNewChildNicknames(''); setNewChildAvatar('👶'); }} style={{ width: '100%', padding: '10px', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>添加孩子</button>
            </div>
          </div>

          <button 
            onClick={() => setShowSettings(false)}
            style={{ 
              width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
              background: 'linear-gradient(135deg, var(--text-dark), #4b5563)', color: 'white', fontWeight: 'bold',
              marginTop: '15px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
          >
            完成设置
          </button>
        </div>
      ) : (
        <div style={{ animation: 'fadeIn 0.3s' }}>
          {activeTab === 'home' && (
            <>
              {!selectedChildId ? (
                 <div style={{ animation: 'fadeIn 0.3s' }}>
                    {childrenData.map(child => (
                      <ChildCard 
                          key={child.id} 
                          child={child} 
                          onClick={() => setSelectedChildId(child.id)} 
                      />
                    ))}
                    {childrenData.length === 0 && (
                      <div style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
                         <h3>您尚未添加儿童</h3>
                         <p>请点击右上角设置图标开始配置</p>
                      </div>
                    )}
                 </div>
              ) : (
                 <div style={{ animation: 'fadeIn 0.3s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <button 
                        onClick={() => { setSelectedChildId(null); setConfirmClearId(null); }}
                        style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontWeight: 'bold', padding: '0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        &larr; 返回儿童列表
                      </button>
                      {confirmClearId === selectedChild.id ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 'bold' }}>确认清空？</span>
                          <button onClick={() => { clearHistory(selectedChild.id); setSelectedChildId(null); setConfirmClearId(null); }} style={{ background: '#ef4444', border: 'none', color: 'white', padding: '5px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>确定</button>
                          <button onClick={() => setConfirmClearId(null)} style={{ background: '#e2e8f0', border: 'none', color: '#666', padding: '5px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem' }}>取消</button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setConfirmClearId(selectedChild.id)}
                          style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }}
                        >
                          <Trash2 size={14} /> 清空记录
                        </button>
                      )}
                    </div>
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '30px 20px', marginBottom: '20px' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{selectedChild.avatar}</div>
                      <h2 style={{ fontSize: '2rem', margin: '0 0 5px 0' }}>{selectedChild.name}</h2>
                      <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--secondary-color)', background: 'linear-gradient(135deg, var(--secondary-color), #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: '1.1' }}>
                        {selectedChild.points}
                      </div>
                      <div style={{ color: 'var(--text-light)', marginTop: '5px' }}>总可用积分</div>
                    </div>
                    
                    <HistoryList history={selectedChild.history} childName={selectedChild.name} />
                 </div>
              )}
            </>
          )}

          {activeTab === 'shop' && <ShopView />}
          {activeTab === 'stats' && <StatsView />}
          {activeTab === 'records' && <RecordsView />}
        </div>
      )}

      {/* Persistent Voice Component that floats above the cutout */}
      {!showSettings && <VoiceFAB />}
      
      {showSyncModal && <SyncModal onClose={() => setShowSyncModal(false)} />}
      
      {/* Bottom Navigation */}
      {!showSettings && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, 
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(0,0,0,0.05)', 
          display: 'flex', justifyContent: 'space-around', 
          padding: '12px 0 calc(12px + env(safe-area-inset-bottom))', zIndex: 900,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.03)'
        }}>
          <button onClick={() => {setActiveTab('home'); setSelectedChildId(null);}} style={{ background: 'none', border: 'none', color: activeTab === 'home' ? 'var(--primary-color)' : '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', transition: 'color 0.2s' }}>
            <Home size={24} />
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>成长</span>
          </button>
          <button onClick={() => {setActiveTab('shop'); setSelectedChildId(null);}} style={{ background: 'none', border: 'none', color: activeTab === 'shop' ? 'var(--secondary-color)' : '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', transition: 'color 0.2s' }}>
            <ShoppingBag size={24} />
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>奖励</span>
          </button>
          <div style={{ width: '60px' }}></div> {/* Spacer for central Voice FAB */}
          <button onClick={() => {setActiveTab('stats'); setSelectedChildId(null);}} style={{ background: 'none', border: 'none', color: activeTab === 'stats' ? '#10b981' : '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', transition: 'color 0.2s' }}>
            <BarChart2 size={24} />
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>统计</span>
          </button>
          <button onClick={() => {setActiveTab('records'); setSelectedChildId(null);}} style={{ background: 'none', border: 'none', color: activeTab === 'records' ? '#f59e0b' : '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', transition: 'color 0.2s' }}>
            <Clock size={24} />
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>全纪录</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
