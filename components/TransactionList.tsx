import React, { useState } from 'react';
import { Search, Edit2, Check, X, Trash2, AlertCircle } from 'lucide-react';
import { ExpenseRecord } from '../types';
import { formatCurrency, isValidDate } from '../services/dataProcessor';

interface TransactionListProps {
  data: ExpenseRecord[];
  bankNames: string[];
  onUpdate: (updatedRecord: ExpenseRecord) => void;
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ data, bankNames, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ExpenseRecord | null>(null);
  const [dateError, setDateError] = useState<boolean>(false);

  const filteredData = data.filter(item => 
    item.date.includes(searchTerm) || 
    item.note.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (record: ExpenseRecord) => {
    setEditingId(record.id);
    setEditForm(JSON.parse(JSON.stringify(record))); // Deep copy
    setDateError(!isValidDate(record.date));
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditForm(null);
    setDateError(false);
  };

  const handleSaveClick = () => {
    if (editForm) {
      if (!isValidDate(editForm.date)) {
        alert('日期格式錯誤！請使用 YY/MM 或 YYYY/MM 格式 (例如 25/01)');
        return;
      }
      onUpdate(editForm);
      setEditingId(null);
      setEditForm(null);
      setDateError(false);
    }
  };

  const handleDateChange = (value: string) => {
    if (!editForm) return;
    setEditForm(prev => prev ? ({ ...prev, date: value }) : null);
    setDateError(!isValidDate(value));
  };

  const handleBankChange = (bankName: string, value: number) => {
    if (!editForm) return;
    setEditForm(prev => {
       if (!prev) return null;
       return {
         ...prev,
         banks: {
           ...prev.banks,
           [bankName]: value
         }
       };
    });
  };

  const handleOtherChange = (field: keyof ExpenseRecord, value: string | number) => {
    if (!editForm) return;
    setEditForm(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

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
      <div className="overflow-x-auto pb-12">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-4 py-3 w-20 text-center">操作</th>
              <th className="px-2 py-3 whitespace-nowrap min-w-[80px]">日期</th>
              {/* Dynamic Bank Columns */}
              {bankNames.map(bank => (
                <th key={bank} className="px-2 py-3 text-right whitespace-nowrap min-w-[90px] text-gray-700">{bank}</th>
              ))}
              <th className="px-2 py-3 text-right font-bold whitespace-nowrap min-w-[100px]">總消費</th>
              <th className="px-2 py-3 text-right text-gray-500 whitespace-nowrap min-w-[80px]">家用</th>
              <th className="px-2 py-3 text-right text-gray-500 whitespace-nowrap min-w-[80px]">房租</th>
              <th className="px-2 py-3 text-right text-gray-500 whitespace-nowrap min-w-[80px]">額外</th>
              <th className="px-4 py-3 min-w-[200px]">備註</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.map((row) => {
              const isEditing = editingId === row.id;
              
              return (
                <tr key={row.id} className={`transition-colors ${isEditing ? 'bg-blue-50/50' : 'hover:bg-blue-50/30'}`}>
                  {/* Actions */}
                  <td className="px-4 py-3 text-center">
                    {isEditing ? (
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={handleSaveClick} 
                          disabled={dateError}
                          className={`p-1.5 rounded-md transition-colors ${dateError ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-100 text-green-700 hover:bg-green-200'}`} 
                          title="儲存"
                        >
                          <Check size={16} />
                        </button>
                        <button onClick={handleCancelClick} className="p-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors" title="取消">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleEditClick(row)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all" title="編輯">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => onDelete(row.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all" title="刪除">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-2 py-3 font-medium text-gray-800 whitespace-nowrap relative">
                    {isEditing ? (
                      <div className="relative">
                        <input 
                          type="text" 
                          value={editForm?.date || ''} 
                          onChange={e => handleDateChange(e.target.value)}
                          className={`w-full bg-white border rounded px-2 py-1 text-xs focus:ring-2 focus:outline-none ${dateError ? 'border-red-500 focus:ring-red-200' : 'border-blue-300 focus:ring-blue-200'}`}
                          placeholder="YY/MM"
                        />
                        {dateError && <AlertCircle className="absolute right-1 top-1.5 text-red-500 pointer-events-none" size={12}/>}
                      </div>
                    ) : row.date}
                  </td>

                  {/* Dynamic Bank Amounts */}
                  {bankNames.map(bank => (
                    <EditableMoneyCell 
                      key={bank}
                      isEditing={isEditing} 
                      value={isEditing ? (editForm?.banks?.[bank] ?? 0) : (row.banks[bank] ?? 0)} 
                      onChange={v => handleBankChange(bank, v)} 
                    />
                  ))}
                  
                  {/* Total - Highlighted */}
                  <EditableMoneyCell isEditing={isEditing} value={isEditing ? editForm?.total : row.total} onChange={v => handleOtherChange('total', v)} className="font-bold text-red-600" />
                  
                  <EditableMoneyCell isEditing={isEditing} value={isEditing ? editForm?.family : row.family} onChange={v => handleOtherChange('family', v)} className="text-gray-500" />
                  <EditableMoneyCell isEditing={isEditing} value={isEditing ? editForm?.rent : row.rent} onChange={v => handleOtherChange('rent', v)} className="text-gray-500" />
                  <EditableMoneyCell isEditing={isEditing} value={isEditing ? editForm?.extra : row.extra} onChange={v => handleOtherChange('extra', v)} className="text-gray-500" />

                  {/* Note */}
                  <td className="px-4 py-3 text-gray-600 max-w-xs">
                     {isEditing ? (
                      <input 
                        type="text" 
                        value={editForm?.note || ''} 
                        onChange={e => handleOtherChange('note', e.target.value)}
                        className="w-full bg-white border border-blue-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      />
                    ) : (
                      <div className="truncate" title={row.note}>{row.note}</div>
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={6 + bankNames.length} className="px-4 py-12 text-center text-gray-400">
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

const EditableMoneyCell = ({ isEditing, value, onChange, className = '' }: { 
  isEditing: boolean, 
  value: number | undefined, 
  onChange: (val: number) => void,
  className?: string 
}) => {
  return (
    <td className={`px-2 py-3 text-right font-mono ${className}`}>
      {isEditing ? (
        <input 
          type="number" 
          value={value} 
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="w-full bg-white border border-blue-300 rounded px-1 py-1 text-xs text-right focus:ring-2 focus:ring-blue-200 focus:outline-none"
        />
      ) : formatCurrency(value)}
    </td>
  );
};