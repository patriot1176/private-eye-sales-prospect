import { TargetCard } from '@/components/target-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react'

const prospects = [
  { id: 1, name: "Lewis Cook", company: "Catapult Print", status: "Completed" as const },
  { id: 2, name: "John Abbott", company: "Abbott Label", status: "In Progress" as const },
  { id: 3, name: "Shaun Ashworth", company: "Associated Labels", status: "Pending" as const },
  { id: 4, name: "Sarah Mitchell", company: "PrintTech Solutions", status: "In Progress" as const },
  { id: 5, name: "David Chen", company: "Pacific Labels", status: "Completed" as const },
  { id: 6, name: "Emma Rodriguez", company: "Custom Print Co", status: "Pending" as const },
]

const stats = [
  { name: 'Total Prospects', value: '24', icon: Users, change: '+12%' },
  { name: 'Completed Research', value: '18', icon: CheckCircle, change: '+8%' },
  { name: 'In Progress', value: '4', icon: Clock, change: '+2%' },
  { name: 'Success Rate', value: '75%', icon: TrendingUp, change: '+5%' },
]

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Prospect Research Dashboard</h1>
        <p className="text-gray-600 mt-2">Track and manage your sales prospect research</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="flex flex-col items-end">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Prospects */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Prospects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prospects.map((prospect) => (
            <TargetCard
              key={prospect.id}
              id={prospect.id}
              name={prospect.name}
              company={prospect.company}
              status={prospect.status}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
