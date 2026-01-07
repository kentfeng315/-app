import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { ExpenseRecord } from '../types';
import { isValidDate } from '../services/dataProcessor';

interface RecordFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: ExpenseRecord) => void;
  bankNames: string[];
}

export const RecordFormModal: React.FC<RecordFormModalProps> = ({ isOpen, onClose, onSave, bankNames }) => {
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [banks, setBanks] = useState<{[key: string]: number}>({});
  const [others, setOthers] = useState({
    family: 0,
    rent: 0,
    periodic: 0,
    extra: 0
  });
  const [error, setError] = useState('');

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setDate('');
      setNote('');
      const initialBanks: {[key: string]: number} = {};
      bankNames.forEach(name => initialBanks[name] = 0);
      setBanks(initialBanks);
      setOthers({ family: 0, rent: 0, periodic: 0, extra: 0 });
      setError('');
    }
  }, [isOpen, bankNames]);

  const calculateTotal = () => {
    const bankTotal = (Object.values(banks) as number[]).reduce((sum, val) => sum + (val || 0), 0);
    const otherTotal = (Object.values(others) as number[]).reduce((sum, val) => sum + (val || 0), 0);
    // Note: In the data structure, 'total' usually refers to Bank Total or Grand Total?
    // Based on previous CSV logic, 'Total' seemed to be the sum of bank expenses mostly, 
    // or sometimes independent. Let's assume Total = Sum of Bank Spendings for the main "Total" column.
    // The previous CSV parser took 'Total' from a specific column, but here we calculate it.
    // Let's Auto-sum banks as the default "Total" value.
    return bankTotal; 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidDate(date)) {
      setError('日期格式錯誤！請使用 YY/MM 或 YYYY/MM 格式 (例如 25/01)');
      return;
    }

    const newRecord: ExpenseRecord = {
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      date,
      banks,
      total: calculateTotal(),
      family: others.family,
      rent: others.rent,
      periodic: others.periodic,
      extra: others.extra,
      note
    };

    onSave(newRecord);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">新增交易紀錄</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">基本資訊</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">日期 (YY/MM)</label>
                <input 
                  type="text" 
                  value={date} 
                  onChange={(e) => { setDate(e.target.value); setError(''); }}
                  placeholder="25/01" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">備註</label>
                <input 
                  type="text" 
                  value={note} 
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="例如：旅遊、大額支出..." 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Other Expenses */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">其他支出</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">家用</label>
                  <input 
                    type="number" 
                    value={others.family || ''} 
                    onChange={(e) => setOthers({...others, family: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">房租</label>
                  <input 
                    type="number" 
                    value={others.rent || ''} 
                    onChange={(e) => setOthers({...others, rent: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">定期</label>
                  <input 
                    type="number" 
                    value={others.periodic || ''} 
                    onChange={(e) => setOthers({...others, periodic: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">額外</label>
                  <input 
                    type="number" 
                    value={others.extra || ''} 
                    onChange={(e) => setOthers({...others, extra: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Banks */}
          <div>
             <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">銀行消費金額</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {bankNames.map(name => (
                 <div key={name}>
                   <label className="block text-sm font-medium text-gray-700 mb-1">{name}</label>
                   <input 
                    type="number"
                    value={banks[name] || ''}
                    onChange={(e) => setBanks({...banks, [name]: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                   />
                 </div>
               ))}
             </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
             <span className="font-semibold text-gray-700">預估總消費 (銀行加總)</span>
             <span className="text-2xl font-bold text-blue-600 font-mono">
               {new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(calculateTotal())}
             </span>
          </div>

          <div className="flex gap-4 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Save size={20} />
              儲存紀錄
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
