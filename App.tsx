import React, { useState, useMemo } from 'react';
import { CreditCard, Upload, Plus } from 'lucide-react';
import { ExpenseRecord, Stats } from './types';
import { processCSV } from './services/dataProcessor';
import { INITIAL_CSV_DATA, INITIAL_BANK_NAMES } from './constants';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { RecordFormModal } from './components/RecordFormModal';

type Tab = 'dashboard' | 'list';

export default function App() {
  const [data, setData] = useState<ExpenseRecord[]>(INITIAL_CSV_DATA);
  const [bankNames, setBankNames] = useState<string[]>(INITIAL_BANK_NAMES);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const { data: parsedData, bankNames: parsedBanks } = processCSV(text);
        if (parsedData.length > 0) {
          setData(parsedData);
          setBankNames(parsedBanks);
          alert(`成功匯入 ${parsedData.length} 筆資料！`);
        } else {
          alert("匯入失敗，請確認 CSV 格式。");
        }
      }
    };
    reader.readAsText(file);
  };

  const handleSaveNewRecord = (newRecord: ExpenseRecord) => {
    setData(prev => [newRecord, ...prev]);
    setActiveTab('list');
  };

  const handleUpdateRecord = (updatedRecord: ExpenseRecord) => {
    setData(prevData => prevData.map(item => 
      item.id === updatedRecord.id ? updatedRecord : item
    ));
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm('確定要刪除這筆紀錄嗎？')) {
      setData(prevData => {
        const newData = prevData.filter(item => item.id !== id);
        return newData;
      });
    }
  };

  const stats: Stats = useMemo(() => {
    const totalSpent = data.reduce((acc, curr) => acc + curr.total, 0);
    const avgSpent = data.length > 0 ? totalSpent / data.length : 0;
    
    // Calculate totals for each bank dynamically
    const bankTotals: {[key: string]: number} = {};
    bankNames.forEach(name => bankTotals[name] = 0);
    
    data.forEach(record => {
      Object.entries(record.banks).forEach(([bank, amount]) => {
        if (bankTotals[bank] !== undefined) {
          bankTotals[bank] += (amount as number);
        }
      });
    });

    const maxMonth = data.reduce((prev, current) => (prev.total > current.total) ? prev : current, data[0] || null);

    return { totalSpent, avgSpent, bankTotals, maxMonth };
  }, [data, bankNames]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white shadow-sm">
                <CreditCard size={24} />
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">信用卡記帳分析</h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                儀表板
              </button>
              <button 
                onClick={() => setActiveTab('list')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'list' 
                    ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                詳細清單
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Data Source Control */}
        <div className="mb-8 bg-gradient-to-r from-white to-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">資料來源管理</h3>
            <p className="text-sm text-gray-500 mt-1">
              目前使用 <span className="font-semibold text-gray-700">{data.length === 0 ? '無資料' : (data === INITIAL_CSV_DATA ? '系統預設' : '已上傳')}</span> 資料。
            </p>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white hover:bg-blue-50 text-blue-700 px-5 py-2.5 rounded-xl border border-blue-200 shadow-sm flex items-center gap-2 transition-all hover:shadow-md active:scale-95"
             >
               <Plus size={18} />
               <span className="text-sm font-semibold">新增單筆</span>
             </button>
            <label className="cursor-pointer bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2 transition-all hover:shadow-md active:scale-95">
              <Upload size={18} className="text-gray-600"/>
              <span className="text-sm font-semibold">匯入 CSV 檔案</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Views */}
        <div className="transition-opacity duration-300 ease-in-out">
          {activeTab === 'dashboard' ? (
            <Dashboard data={data} stats={stats} bankNames={bankNames} />
          ) : (
            <TransactionList 
              data={data} 
              bankNames={bankNames}
              onUpdate={handleUpdateRecord} 
              onDelete={handleDeleteRecord} 
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <RecordFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNewRecord}
        bankNames={bankNames}
      />
    </div>
  );
}