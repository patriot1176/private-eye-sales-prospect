import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Trash2 } from 'lucide-react'

interface TargetCardProps {
  id: string
  name: string
  company: string
  status: 'Completed' | 'In Progress' | 'Pending'
  onDelete?: (id: string) => void // ✅ Add optional delete handler
}

export function TargetCard({ id, name, company, status, onDelete }: TargetCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700 hover:bg-green-200'
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow relative group">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{name}</h3>
            <p className="text-gray-600">{company}</p>
          </div>

          <Link 
            href={`/prospects/${id}`}
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex justify-between items-center">
          <Badge className={getStatusColor(status)}>
            {status}
          </Badge>
          <Link 
            href={`/prospects/${id}`}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View Details
          </Link>
        </div>
        
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </CardContent>
    </Card>
  )
}
