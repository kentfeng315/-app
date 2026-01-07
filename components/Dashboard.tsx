import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { TrendingUp, CreditCard } from 'lucide-react';
import { ExpenseRecord, Stats } from '../types';
import { COLORS } from '../constants';
import { StatCard } from './StatCard';
import { formatCurrency } from '../services/dataProcessor';
import { DollarSign, Calendar } from 'lucide-react';

interface DashboardProps {
  data: ExpenseRecord[];
  stats: Stats;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, stats }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="總累積消費" 
          value={formatCurrency(stats.totalSpent)} 
          icon={<DollarSign className="text-emerald-500" />} 
          trend={`${data.length} 個月`}
        />
        <StatCard 
          title="平均月消費" 
          value={formatCurrency(stats.avgSpent)} 
          icon={<TrendingUp className="text-blue-500" />} 
          trend="每月平均"
        />
        <StatCard 
          title="最高消費月份" 
          value={stats.maxMonth?.date || '-'} 
          subValue={formatCurrency(stats.maxMonth?.total)}
          icon={<Calendar className="text-orange-500" />} 
          trend={stats.maxMonth?.note || '無備註'}
        />
        <StatCard 
          title="最高佔比銀行" 
          value="台新銀行" 
          subValue={formatCurrency(stats.bankTotals.taishin)}
          icon={<CreditCard className="text-purple-500" />} 
          trend={`${stats.totalSpent ? ((stats.bankTotals.taishin / stats.totalSpent) * 100).toFixed(1) : 0}% 佔比`}
        />
      </div>

      {/* Row 1: Trend & Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600"/>
            月消費趨勢分析
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.total} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS.total} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(val) => `${val/1000}k`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Area type="monotone" dataKey="total" name="總消費" stroke={COLORS.total} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bank Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard size={20} className="text-blue-600"/>
            銀行消費佔比
          </h3>
          <div className="h-80 relative flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: '中信', value: stats.bankTotals.ct },
                    { name: '國泰', value: stats.bankTotals.cathay },
                    { name: '台新', value: stats.bankTotals.taishin },
                    { name: '兆豐', value: stats.bankTotals.mega },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill={COLORS.ct} />
                  <Cell fill={COLORS.cathay} />
                  <Cell fill={COLORS.taishin} />
                  <Cell fill={COLORS.mega} />
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
              <p className="text-xs text-gray-500">總支出</p>
              <p className="text-sm font-bold text-gray-800">{(stats.totalSpent / 10000).toFixed(1)}萬</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Stacked Bar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">各卡消費堆疊分析</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  cursor={{fill: 'rgba(0,0,0,0.05)'}}
                />
                <Legend />
                <Bar dataKey="ct_amount" name="中信" stackId="a" fill={COLORS.ct} />
                <Bar dataKey="cathay_amount" name="國泰" stackId="a" fill={COLORS.cathay} />
                <Bar dataKey="taishin_amount" name="台新" stackId="a" fill={COLORS.taishin} />
                <Bar dataKey="mega_amount" name="兆豐" stackId="a" fill={COLORS.mega} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">支出類型結構</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                <Legend />
                <Bar dataKey="rent" name="房租" fill={COLORS.rent} radius={[4, 4, 0, 0]}/>
                <Bar dataKey="family" name="家用" fill={COLORS.family} radius={[4, 4, 0, 0]}/>
                <Bar dataKey="extra" name="額外" fill={COLORS.mega} radius={[4, 4, 0, 0]}/>
                <Bar dataKey="periodic" name="定期" fill={COLORS.cathay} radius={[4, 4, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
