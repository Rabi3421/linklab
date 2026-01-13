'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatDate, formatNumber } from '@/lib/dateUtils'
import { 
  Globe, 
  Plus, 
  Search, 
  Link2,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Shield
} from 'lucide-react'

const mockDomains = [
  {
    id: 1,
    domain: 'short.company.com',
    status: 'active',
    isDefault: true,
    linksCount: 245,
    totalClicks: 12500,
    createdAt: '2024-01-15',
    lastUsed: '2024-12-24',
    sslStatus: 'valid',
    sslExpiry: '2025-06-15',
    dnsStatus: 'configured'
  },
  {
    id: 2,
    domain: 'go.brand.io',
    status: 'active',
    isDefault: false,
    linksCount: 89,
    totalClicks: 4300,
    createdAt: '2024-03-20',
    lastUsed: '2024-12-23',
    sslStatus: 'valid',
    sslExpiry: '2025-08-20',
    dnsStatus: 'configured'
  },
  {
    id: 3,
    domain: 'click.marketing.com',
    status: 'pending',
    isDefault: false,
    linksCount: 0,
    totalClicks: 0,
    createdAt: '2024-12-20',
    lastUsed: null,
    sslStatus: 'pending',
    sslExpiry: null,
    dnsStatus: 'pending'
  },
  {
    id: 4,
    domain: 'links.oldsite.com',
    status: 'inactive',
    isDefault: false,
    linksCount: 156,
    totalClicks: 8900,
    createdAt: '2023-08-10',
    lastUsed: '2024-10-15',
    sslStatus: 'expired',
    sslExpiry: '2024-08-10',
    dnsStatus: 'misconfigured'
  }
]

export default function DomainsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDomain, setNewDomain] = useState('')

  const filteredDomains = mockDomains.filter(domain => {
    const matchesSearch = domain.domain.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || domain.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      case 'inactive':
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      default:
        return <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
    }
  }

  const getSslStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'text-green-600 dark:text-green-400'
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'expired':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle domain addition logic here
    console.log('Adding domain:', newDomain)
    setNewDomain('')
    setShowAddModal(false)
  }

  const totalStats = {
    totalDomains: mockDomains.length,
    activeDomains: mockDomains.filter(d => d.status === 'active').length,
    totalLinks: mockDomains.reduce((sum, d) => sum + d.linksCount, 0),
    totalClicks: mockDomains.reduce((sum, d) => sum + d.totalClicks, 0)
  }

  return (
    <div className="flex-1 overflow-auto lg:pt-0 pt-16">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Custom Domains</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your custom domains for branded short links
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Domains</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.totalDomains}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Domains</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.activeDomains}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Link2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Links</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(totalStats.totalLinks)}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <ExternalLink className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clicks</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(totalStats.totalClicks)}</p>
          </div>
        </div>

        {/* Domains Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search domains..."
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
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Domain
              </button>
            </div>
          </div>

          {/* Domains List */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredDomains.map((domain) => (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(domain.status)}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {domain.domain}
                        </h3>
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(domain.status)}`}>
                        {domain.status}
                      </span>
                      
                      {domain.isDefault && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-xs font-medium">
                          Default
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Links</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{domain.linksCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Total Clicks</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatNumber(domain.totalClicks)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">DNS Status</p>
                        <p className={`text-sm font-medium ${domain.dnsStatus === 'configured' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                          {domain.dnsStatus}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">SSL Status</p>
                        <p className={`text-sm font-medium ${getSslStatusColor(domain.sslStatus)}`}>
                          {domain.sslStatus}
                          {domain.sslExpiry && (
                            <span className="block text-xs text-gray-500 dark:text-gray-400">
                              Expires: {formatDate(domain.sslExpiry)}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span>Created: {formatDate(domain.createdAt)}</span>
                        {domain.lastUsed && (
                          <span>Last used: {formatDate(domain.lastUsed)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <Copy className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <Settings className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    {!domain.isDefault && (
                      <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredDomains.length === 0 && (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No domains found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search terms.' : 'Add your first custom domain to get started.'}
              </p>
            </div>
          )}
        </div>

        {/* Setup Guide */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Domain Setup Guide</h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Follow these steps to set up your custom domain
            </p>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Add Your Domain</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Enter your custom domain (e.g., links.yoursite.com) in the form above.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Configure DNS</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Add a CNAME record pointing to our service:
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-3 font-mono text-sm">
                    <div className="text-gray-700 dark:text-gray-300">
                      CNAME: your-domain → cname.linklab.com
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">SSL Certificate</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    We'll automatically provision an SSL certificate once DNS is configured properly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Domain Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add Custom Domain
            </h2>
            
            <form onSubmit={handleAddDomain} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Domain Name
                </label>
                <input
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="links.yoursite.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter a subdomain you own (e.g., links.yoursite.com, go.yourbrand.io)
                </p>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Domain
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}