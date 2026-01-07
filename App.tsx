import React, { useState, useMemo } from 'react';
import { CreditCard, Upload } from 'lucide-react';
import { ExpenseRecord, Stats } from './types';
import { processCSV } from './services/dataProcessor';
import { INITIAL_CSV_DATA } from './constants';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';

type Tab = 'dashboard' | 'list';

export default function App() {
  const [data, setData] = useState<ExpenseRecord[]>(INITIAL_CSV_DATA);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const parsedData = processCSV(text);
        if (parsedData.length > 0) {
          setData(parsedData);
          alert(`成功匯入 ${parsedData.length} 筆資料！`);
        } else {
          alert("匯入失敗，請確認 CSV 格式。");
        }
      }
    };
    reader.readAsText(file);
  };

  const stats: Stats = useMemo(() => {
    const totalSpent = data.reduce((acc, curr) => acc + curr.total, 0);
    const avgSpent = data.length > 0 ? totalSpent / data.length : 0;
    
    const bankTotals = {
      ct: data.reduce((acc, curr) => acc + curr.ct_amount, 0),
      cathay: data.reduce((acc, curr) => acc + curr.cathay_amount, 0),
      taishin: data.reduce((acc, curr) => acc + curr.taishin_amount, 0),
      mega: data.reduce((acc, curr) => acc + curr.mega_amount, 0),
    };

    const maxMonth = data.reduce((prev, current) => (prev.total > current.total) ? prev : current, data[0] || null);

    return { totalSpent, avgSpent, bankTotals, maxMonth };
  }, [data]);

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
              目前使用 <span className="font-semibold text-gray-700">{data === INITIAL_CSV_DATA ? '系統預設' : '已上傳'}</span> 資料。若要分析新的月份，請上傳「總表.csv」。
            </p>
          </div>
          <label className="cursor-pointer bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2 transition-all hover:shadow-md active:scale-95">
            <Upload size={18} className="text-blue-600"/>
            <span className="text-sm font-semibold">匯入 CSV 檔案</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Views */}
        <div className="transition-opacity duration-300 ease-in-out">
          {activeTab === 'dashboard' ? (
            <Dashboard data={data} stats={stats} />
          ) : (
            <TransactionList data={data} />
          )}
        </div>
      </main>
    </div>
  );
}
