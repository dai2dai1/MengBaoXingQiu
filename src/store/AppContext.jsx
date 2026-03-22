import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialData = [
  { id: '1', name: '小明', nicknames: ['小明', '明明'], avatar: '👦', points: 150, history: [
    { id: 'h1', date: new Date().toISOString(), action: 'add', value: 10, reason: '按时完成作业' }
  ]},
  { id: '2', name: '小红', nicknames: ['小红', '红红'], avatar: '👧', points: 120, history: [
    { id: 'h2', date: new Date().toISOString(), action: 'add', value: 5, reason: '主动帮忙做家务' }
  ]}
];

export function AppProvider({ children }) {
  const [childrenData, setChildrenData] = useState(() => {
    const saved = localStorage.getItem('childrenGrowthData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialData;
      }
    }
    return initialData;
  });

  useEffect(() => {
    localStorage.setItem('childrenGrowthData', JSON.stringify(childrenData));
  }, [childrenData]);

  const addPoints = (childId, value, reason) => {
    setChildrenData(prev => prev.map(child => {
      if (child.id === childId) {
        return {
          ...child,
          points: child.points + value,
          history: [{ 
            id: Date.now().toString(), 
            date: new Date().toISOString(), 
            action: value > 0 ? 'add' : 'deduct', 
            value: Math.abs(value), 
            reason 
          }, ...child.history]
        };
      }
      return child;
    }));
  };

  const deductPoints = (childId, value, reason) => {
    addPoints(childId, -value, reason);
  };

  const updateChild = (childId, name, nicknamesStr, avatar) => {
    setChildrenData(prev => prev.map(child => {
      if (child.id === childId) {
        return {
          ...child,
          name,
          nicknames: nicknamesStr.split(/[,， ]+/).filter(Boolean),
          avatar: avatar || child.avatar || '👦'
        };
      }
      return child;
    }));
  };

  const addChild = (name, nicknamesStr, avatar = '👶') => {
    if (!name.trim()) return;
    setChildrenData(prev => [...prev, {
      id: Date.now().toString(),
      name: name.trim(),
      nicknames: nicknamesStr.split(/[,， ]+/).filter(Boolean),
      avatar,
      points: 0,
      history: []
    }]);
  };

  const deleteChild = (childId) => {
    setChildrenData(prev => prev.filter(c => c.id !== childId));
  };

  const redeemPoints = (childId, cost, rewardName) => {
    setChildrenData(prev => prev.map(child => {
      if (child.id === childId) {
        if (child.points < cost) return child; 
        return {
          ...child,
          points: child.points - cost,
          history: [{ 
            id: Date.now().toString(), 
            date: new Date().toISOString(), 
            action: 'deduct', 
            value: cost, 
            reason: `兑换奖励：${rewardName}` 
          }, ...child.history]
        };
      }
      return child;
    }));
  };

  const clearHistory = (childId) => {
    setChildrenData(prev => prev.map(child => {
      if (child.id === childId) {
        return { ...child, points: 0, history: [] };
      }
      return child;
    }));
  };

  const overwriteChildrenData = (newData) => {
    if (Array.isArray(newData)) {
      setChildrenData(newData);
    }
  };

  return (
    <AppContext.Provider value={{ 
      childrenData, 
      addPoints, 
      deductPoints,
      updateChild,
      addChild,
      deleteChild,
      clearHistory,
      overwriteChildrenData,
      redeemPoints
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
