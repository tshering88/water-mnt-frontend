
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Droplets, AlertTriangle, TrendingUp, Gauge } from 'lucide-react';
import { COLORS, dailyConsumption, leakAlerts, waterSources, waterTanks } from '../../data';


export default function DashboardHome() {
  const getTankStatusColor = (level: number) => {
    if (level > 70) return 'from-emerald-400 to-emerald-600';
    if (level > 40) return 'from-amber-400 to-amber-600';
    return 'from-red-400 to-red-600';
  };

  const getTankStatusIcon = (level: number) => {
    if (level > 70) return '🟢';
    if (level > 40) return '🟡';
    return '🔴';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
              <Droplets className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Water Management Dashboard
            </h1>
          </div>
          <p className="text-slate-600 text-lg">Real-time monitoring and analytics for water infrastructure</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Capacity</p>
                  <p className="text-3xl font-bold">15.5K L</p>
                  <p className="text-blue-200 text-sm">Across 4 tanks</p>
                </div>
                <Gauge className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Avg Efficiency</p>
                  <p className="text-3xl font-bold">92%</p>
                  <p className="text-emerald-200 text-sm">+3% from last week</p>
                </div>
                <TrendingUp className="h-12 w-12 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Active Alerts</p>
                  <p className="text-3xl font-bold">2</p>
                  <p className="text-amber-200 text-sm">Require attention</p>
                </div>
                <AlertTriangle className="h-12 w-12 text-amber-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tank Levels */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Droplets className="h-6 w-6 text-blue-500" />
            Tank Status Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {waterTanks.map((tank) => (
              <Card key={tank.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span className="text-slate-700">{tank.id}</span>
                    <span className="text-xl">{getTankStatusIcon(tank.level)}</span>
                  </CardTitle>
                  <p className="text-sm text-slate-500">{tank.location}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-slate-800">{tank.level}%</p>
                    <p className="text-sm text-slate-500">{Math.round(tank.capacity * tank.level / 100)} / {tank.capacity}L</p>
                  </div>

                  <div className="space-y-2">
                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getTankStatusColor(tank.level)} rounded-full transition-all duration-500 shadow-sm`}
                        style={{ width: `${tank.level}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Enhanced Line Chart */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Daily Water Consumption & Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyConsumption}>
                  <defs>
                    <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    className="text-slate-600"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    className="text-slate-600"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="liters"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#consumptionGradient)"
                  />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Enhanced Pie Chart */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                <Droplets className="h-5 w-5 text-cyan-500" />
                Water Source Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={waterSources}
                    dataKey="percentage"
                    nameKey="source"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={40}
                    paddingAngle={2}
                    label={({ source, percentage }) => `${source}: ${percentage}%`}
                  >
                    {waterSources.map((_entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Alerts Table */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Recent System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-4 font-semibold text-slate-700">Time</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Type</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Location</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Severity</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leakAlerts.map((alert, index) => (
                    <tr
                      key={alert.id}
                      className={`border-b border-slate-100 hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-slate-50/30' : 'bg-white/50'
                        }`}
                    >
                      <td className="p-4 text-slate-600">
                        {new Date(alert.time).toLocaleDateString()} {new Date(alert.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4 font-medium text-slate-800">{alert.type}</td>
                      <td className="p-4 text-slate-600">{alert.location}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${alert.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : alert.status === 'Active'
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                        >
                          {alert.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}