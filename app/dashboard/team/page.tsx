'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatDate, formatNumber } from '@/lib/dateUtils'
import { 
  Users, 
  Plus, 
  Search, 
  Crown,
  Shield,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  Calendar,
  BarChart3,
  Settings
} from 'lucide-react'

const mockTeamMembers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Owner',
    avatar: '/avatars/john.jpg',
    status: 'active',
    joinedAt: '2024-01-15',
    lastActive: '2024-12-24',
    linksCreated: 45,
    totalClicks: 1250,
    permissions: ['admin', 'create', 'edit', 'delete', 'analytics']
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'Admin',
    avatar: '/avatars/sarah.jpg',
    status: 'active',
    joinedAt: '2024-02-20',
    lastActive: '2024-12-23',
    linksCreated: 32,
    totalClicks: 890,
    permissions: ['create', 'edit', 'delete', 'analytics']
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'Editor',
    avatar: '/avatars/mike.jpg',
    status: 'active',
    joinedAt: '2024-03-10',
    lastActive: '2024-12-22',
    linksCreated: 28,
    totalClicks: 654,
    permissions: ['create', 'edit', 'analytics']
  },
  {
    id: 4,
    name: 'Emma Davis',
    email: 'emma@example.com',
    role: 'Viewer',
    avatar: '/avatars/emma.jpg',
    status: 'pending',
    joinedAt: '2024-12-20',
    lastActive: null,
    linksCreated: 0,
    totalClicks: 0,
    permissions: ['analytics']
  }
]

const roles = [
  {
    name: 'Owner',
    description: 'Full access to all features and settings',
    permissions: ['admin', 'create', 'edit', 'delete', 'analytics', 'billing'],
    color: 'text-purple-600 dark:text-purple-400'
  },
  {
    name: 'Admin',
    description: 'Manage team and all link operations',
    permissions: ['create', 'edit', 'delete', 'analytics', 'team'],
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    name: 'Editor',
    description: 'Create and edit links with analytics access',
    permissions: ['create', 'edit', 'analytics'],
    color: 'text-green-600 dark:text-green-400'
  },
  {
    name: 'Viewer',
    description: 'View-only access to analytics and reports',
    permissions: ['analytics'],
    color: 'text-gray-600 dark:text-gray-400'
  }
]

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Viewer')

  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || member.role === filterRole
    return matchesSearch && matchesRole
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Owner':
        return <Crown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      case 'Admin':
        return <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      case 'Editor':
        return <Edit className="h-4 w-4 text-green-600 dark:text-green-400" />
      case 'Viewer':
        return <BarChart3 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      default:
        return <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
    }
  }

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle invite logic here
    console.log('Inviting:', inviteEmail, 'as', inviteRole)
    setInviteEmail('')
    setShowInviteModal(false)
  }

  const totalStats = {
    totalMembers: mockTeamMembers.length,
    activeMembers: mockTeamMembers.filter(m => m.status === 'active').length,
    pendingInvites: mockTeamMembers.filter(m => m.status === 'pending').length,
    totalLinks: mockTeamMembers.reduce((sum, m) => sum + m.linksCreated, 0)
  }

  return (
    <div className="flex-1 overflow-auto lg:pt-0 pt-16">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your team members and their permissions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Members</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.totalMembers}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Members</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.activeMembers}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Mail className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Invites</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.pendingInvites}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Links</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStats.totalLinks}</p>
          </div>
        </div>

        {/* Team Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                  />
                </div>
                
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="all">All Roles</option>
                  {roles.map((role) => (
                    <option key={role.name} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>
              
              <button 
                onClick={() => setShowInviteModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </button>
            </div>
          </div>

          {/* Team Members List */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {member.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                          {member.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {member.email}
                      </p>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        {getRoleIcon(member.role)}
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {member.role}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div>
                          <span className="font-medium">Joined:</span> {formatDate(member.joinedAt)}
                        </div>
                        <div>
                          <span className="font-medium">Last active:</span> {member.lastActive ? formatDate(member.lastActive) : 'Never'}
                        </div>
                        <div>
                          <span className="font-medium">Links:</span> {member.linksCreated}
                        </div>
                        <div>
                          <span className="font-medium">Clicks:</span> {formatNumber(member.totalClicks)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {member.role !== 'Owner' && (
                      <>
                        <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No team members found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search terms.' : 'Invite your first team member to get started.'}
              </p>
            </div>
          )}
        </div>

        {/* Roles Information */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Role Permissions</h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Overview of what each role can do
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {roles.map((role) => (
                <div key={role.name} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    {getRoleIcon(role.name)}
                    <h3 className={`font-semibold ${role.color}`}>
                      {role.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {role.description}
                  </p>
                  <div className="space-y-1">
                    {role.permissions.map((permission) => (
                      <div key={permission} className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        • {permission}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Invite Team Member
            </h2>
            
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {roles.filter(role => role.name !== 'Owner').map((role) => (
                    <option key={role.name} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}