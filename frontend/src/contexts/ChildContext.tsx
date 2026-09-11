import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { Child } from '../types';
import { useAuth } from './AuthContext';

interface ChildContextType {
  children: Child[];
  selectedChild: Child | null;
  loading: boolean;
  selectChild: (child: Child) => void;
  refreshChildren: () => Promise<void>;
}

const ChildContext = createContext<ChildContextType | null>(null);

export function ChildProvider({ children: childrenProp }: { children: ReactNode }) {
  const { token } = useAuth();
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshChildren = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await api.get('/children');
      const list = res.data.data;
      setChildrenList(list);

      const savedId = localStorage.getItem('soraia_selected_child');
      const saved = list.find((c: Child) => c.id === savedId);

      if (saved) {
        setSelectedChild(saved);
      } else if (list.length > 0) {
        setSelectedChild(list[0]);
        localStorage.setItem('soraia_selected_child', list[0].id);
      }
    } catch (err) {
      console.error('Failed to load children', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      refreshChildren();
    } else {
      setChildrenList([]);
      setSelectedChild(null);
      setLoading(false);
    }
  }, [token]);

  const selectChild = (child: Child) => {
    setSelectedChild(child);
    localStorage.setItem('soraia_selected_child', child.id);
  };

  return (
    <ChildContext.Provider value={{ children: childrenList, selectedChild, loading, selectChild, refreshChildren }}>
      {childrenProp}
    </ChildContext.Provider>
  );
}

export function useChild() {
  const ctx = useContext(ChildContext);
  if (!ctx) throw new Error('useChild must be used within ChildProvider');
  return ctx;
}
