'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatDate, formatNumber } from '@/lib/dateUtils'
import { 
  Target, 
  Plus, 
  Search, 
  BarChart3,
  Link2,
  Eye,
  MousePointer,
  Calendar,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Play,
  Pause,
  TrendingUp
} from 'lucide-react'

const mockCampaigns = [
  {
    id: 1,
    name: 'Summer Sale 2024',
    description: 'Promotional campaign for summer products',
    status: 'active',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    links: 8,
    totalClicks: 1245,
    uniqueClicks: 890,
    conversionRate: 12.5,
    budget: 5000,
    spent: 3200,
    tags: ['promotion', 'seasonal', 'sale']
  },
  {
    id: 2,
    name: 'Product Launch',
    description: 'New product announcement and marketing',
    status: 'active',
    startDate: '2024-07-15',
    endDate: '2024-09-15',
    links: 12,
    totalClicks: 2340,
    uniqueClicks: 1680,
    conversionRate: 8.9,
    budget: 8000,
    spent: 4500,
    tags: ['launch', 'product', 'marketing']
  },
  {
    id: 3,
    name: 'Holiday Campaign',
    description: 'Christmas and New Year promotions',
    status: 'paused',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    links: 6,
    totalClicks: 567,
    uniqueClicks: 423,
    conversionRate: 15.2,
    budget: 3000,
    spent: 1200,
    tags: ['holiday', 'christmas', 'promotion']
  }
]

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([])

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || campaign.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const toggleSelectCampaign = (id: number) => {
    setSelectedCampaigns(prev => 
      prev.includes(id) 
        ? prev.filter(campaignId => campaignId !== id)
        : [...prev, id]
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
    }
  }

  const totalStats = {
    campaigns: mockCampaigns.length,
    activeCampaigns: mockCampaigns.filter(c => c.status === 'active').length,
    totalClicks: mockCampaigns.reduce((sum, c) => sum + c.totalClicks, 0),
    avgConversion: mockCampaigns.reduce((sum, c) => sum + c.conversionRate, 0) / mockCampaigns.length
  }

  return (
    <div className="flex-1 overflow-auto lg:pt-0 pt-16">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Campaigns</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Organize and track your marketing campaigns
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Campaigns</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.campaigns}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Play className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Campaigns</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.activeCampaigns}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <MousePointer className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clicks</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(totalStats.totalClicks)}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Conversion</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.avgConversion.toFixed(1)}%</p>
          </div>
        </div>

        {/* Campaigns Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                {selectedCampaigns.length > 0 && (
                  <button className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete ({selectedCampaigns.length})
                  </button>
                )}
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </button>
              </div>
            </div>
          </div>

          {/* Campaigns List */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCampaigns.map((campaign) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedCampaigns.includes(campaign.id)}
                      onChange={() => toggleSelectCampaign(campaign.id)}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {campaign.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {campaign.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {campaign.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Links</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{campaign.links}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Clicks</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatNumber(campaign.totalClicks)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Conversion Rate</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{campaign.conversionRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Budget Used</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            ${formatNumber(campaign.spent)} / ${formatNumber(campaign.budget)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors">
                            <BarChart3 className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors">
                            <Copy className="h-4 w-4" />
                          </button>
                          {campaign.status === 'active' ? (
                            <button className="p-2 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors">
                              <Pause className="h-4 w-4" />
                            </button>
                          ) : (
                            <button className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors">
                              <Play className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No campaigns found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search terms.' : 'Create your first campaign to get started.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}