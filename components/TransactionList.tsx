import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { ExpenseRecord } from '../types';
import { formatCurrency } from '../services/dataProcessor';

interface TransactionListProps {
  data: ExpenseRecord[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item => 
    item.date.includes(searchTerm) || 
    item.note.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      {/* Header & Search */}
      <div className="p-4 border-b border-gray-100 flex gap-4 items-center flex-wrap bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-800">詳細交易紀錄</h3>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18}/>
          <input 
            type="text" 
            placeholder="搜尋日期或備註..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">日期</th>
              <th className="px-4 py-3 text-right text-teal-700 whitespace-nowrap">中信</th>
              <th className="px-4 py-3 text-right text-emerald-700 whitespace-nowrap">國泰</th>
              <th className="px-4 py-3 text-right text-yellow-700 whitespace-nowrap">台新</th>
              <th className="px-4 py-3 text-right text-orange-700 whitespace-nowrap">兆豐</th>
              <th className="px-4 py-3 text-right font-bold whitespace-nowrap">總消費</th>
              <th className="px-4 py-3 text-right text-gray-500 whitespace-nowrap">家用</th>
              <th className="px-4 py-3 text-right text-gray-500 whitespace-nowrap">房租</th>
              <th className="px-4 py-3 text-right text-gray-500 whitespace-nowrap">額外</th>
              <th className="px-4 py-3 min-w-[150px]">備註</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.map((row, idx) => (
              <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{row.date}</td>
                <td className="px-4 py-3 text-right font-mono">{formatCurrency(row.ct_amount)}</td>
                <td className="px-4 py-3 text-right font-mono">{formatCurrency(row.cathay_amount)}</td>
                <td className="px-4 py-3 text-right font-mono">{formatCurrency(row.taishin_amount)}</td>
                <td className="px-4 py-3 text-right font-mono">{formatCurrency(row.mega_amount)}</td>
                <td className="px-4 py-3 text-right font-bold text-red-600 font-mono bg-red-50/10">{formatCurrency(row.total)}</td>
                <td className="px-4 py-3 text-right text-gray-500 font-mono">{formatCurrency(row.family)}</td>
                <td className="px-4 py-3 text-right text-gray-500 font-mono">{formatCurrency(row.rent)}</td>
                <td className="px-4 py-3 text-right text-gray-500 font-mono">{formatCurrency(row.extra)}</td>
                <td className="px-4 py-3 text-gray-600 truncate max-w-xs" title={row.note}>{row.note}</td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search size={32} className="text-gray-200" />
                    <p>查無符合的資料</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
