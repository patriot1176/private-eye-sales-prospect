'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getProspectProfiles, initializeMockData } from '@/lib/prospect-storage'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, Clock, CheckCircle, BarChart3, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface Profile {
  id: string
  prospectName: string
  companyName: string
  generatedAt: string
  status: 'Completed' | 'In Progress' | 'Pending'
}

const COLORS = ['#10b981', '#f59e0b', '#6b7280']

export default function AnalyticsPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [statusData, setStatusData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = () => {
    setIsLoading(true)
    
    // Initialize mock data if needed
    initializeMockData()
    
    // Get profiles as array
    const allProfiles = getProspectProfiles(true) as Profile[]
    setProfiles(allProfiles)

    // Group by date for line chart
    const grouped = allProfiles.reduce((acc, profile) => {
      const date = profile.generatedAt ? new Date(profile.generatedAt).toLocaleDateString() : 'Unknown'
      if (!acc[date]) {
        acc[date] = { date, total: 0, completed: 0, inProgress: 0, pending: 0 }
      }
      acc[date].total += 1
      if (profile.status === 'Completed') acc[date].completed += 1
      if (profile.status === 'In Progress') acc[date].inProgress += 1
      if (profile.status === 'Pending') acc[date].pending += 1
      return acc
    }, {} as Record<string, any>)

    const chartArray = Object.values(grouped).sort((a: any, b: any) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    setChartData(chartArray)

    // Status distribution for pie chart
    const statusCounts = allProfiles.reduce((acc, profile) => {
      acc[profile.status] = (acc[profile.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const statusArray = Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count
    }))
    setStatusData(statusArray)
    
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const total = profiles.length
  const completed = profiles.filter(p => p.status === 'Completed').length
  const inProgress = profiles.filter(p => p.status === 'In Progress').length
  const pending = profiles.filter(p => p.status === 'Pending').length
  const successRate = total > 0 ? ((completed / total) * 100).toFixed(1) : '0'

  // Recent activity (last 7 days)
  const recentProfiles = profiles.filter(p => {
    if (!p.generatedAt) return false
    const profileDate = new Date(p.generatedAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return profileDate >= weekAgo
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your prospect research performance and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Badge variant="secondary" className="text-xs">
            <BarChart3 className="h-3 w-3 mr-1" />
            LIVE DATA
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Profiles</p>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{successRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Profiles Generated Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Total"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Completed"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p>No data available</p>
                  <p className="text-sm">Generate some profiles to see analytics</p>
                  <Link href="/research">
                    <Button className="mt-3" size="sm">
                      Start Research
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p>No status data available</p>
                  <p className="text-sm">Generate some profiles to see distribution</p>
                  <Link href="/research">
                    <Button className="mt-3" size="sm">
                      Start Research
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {recentProfiles.length > 0 ? (
            <div className="space-y-3">
              {recentProfiles.slice(0, 5).map((profile, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{profile.prospectName}</p>
                    <p className="text-sm text-gray-600">{profile.companyName}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge 
                      className={
                        profile.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        profile.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }
                    >
                      {profile.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {profile.generatedAt ? new Date(profile.generatedAt).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                </div>
              ))}
              {recentProfiles.length > 5 && (
                <p className="text-sm text-gray-500 text-center pt-2">
                  And {recentProfiles.length - 5} more profiles...
                </p>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p>No recent activity</p>
              <p className="text-sm mt-1">Generate some profiles to see recent activity</p>
              <Link href="/research">
                <Button className="mt-3" size="sm">
                  Start Research
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900">Average Daily Profiles</h4>
              <p className="text-2xl font-bold text-blue-700">
                {chartData.length > 0 ? (total / Math.max(chartData.length, 1)).toFixed(1) : '0'}
              </p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900">Completion Rate</h4>
              <p className="text-2xl font-bold text-green-700">{successRate}%</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900">Active This Week</h4>
              <p className="text-2xl font-bold text-purple-700">{recentProfiles.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
