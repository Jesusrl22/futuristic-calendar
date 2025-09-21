"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Users,
  CreditCard,
  BarChart3,
  Settings,
  Crown,
  Zap,
  Star,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  DollarSign,
  TrendingUp,
  UserCheck,
  AlertCircle,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  plan: "free" | "premium" | "pro"
  subscription_status: "active" | "cancelled" | "expired"
  ai_credits: number
  created_at: string
  last_login?: string
  total_tasks: number
  completed_tasks: number
  is_lifetime: boolean
  notes_count: number
  wishlist_count: number
}

interface Subscription {
  id: string
  user_id: string
  plan: "free" | "premium" | "pro"
  status: "active" | "cancelled" | "expired"
  billing_cycle: "monthly" | "yearly"
  amount: number
  next_billing_date?: string
  created_at: string
}

interface AdminStats {
  total_users: number
  active_subscriptions: number
  monthly_revenue: number
  total_tasks: number
  growth_rate: number
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [stats, setStats] = useState<AdminStats>({
    total_users: 0,
    active_subscriptions: 0,
    monthly_revenue: 0,
    total_tasks: 0,
    growth_rate: 0,
  })
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPlan, setFilterPlan] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  // Sample data - in a real app, this would come from your API
  useEffect(() => {
    const loadData = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const sampleUsers: User[] = [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          plan: "pro",
          subscription_status: "active",
          ai_credits: 850,
          created_at: "2024-01-15T10:00:00Z",
          last_login: "2024-01-20T14:30:00Z",
          total_tasks: 45,
          completed_tasks: 38,
          is_lifetime: false,
          notes_count: 12,
          wishlist_count: 8,
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          plan: "premium",
          subscription_status: "active",
          ai_credits: 0,
          created_at: "2024-01-10T09:00:00Z",
          last_login: "2024-01-19T16:45:00Z",
          total_tasks: 23,
          completed_tasks: 20,
          is_lifetime: true,
          notes_count: 8,
          wishlist_count: 15,
        },
        {
          id: "3",
          name: "Bob Johnson",
          email: "bob@example.com",
          plan: "free",
          subscription_status: "active",
          ai_credits: 0,
          created_at: "2024-01-18T11:00:00Z",
          last_login: "2024-01-20T10:15:00Z",
          total_tasks: 8,
          completed_tasks: 5,
          is_lifetime: false,
          notes_count: 3,
          wishlist_count: 0,
        },
        {
          id: "4",
          name: "Alice Wilson",
          email: "alice@example.com",
          plan: "premium",
          subscription_status: "cancelled",
          ai_credits: 0,
          created_at: "2023-12-01T08:00:00Z",
          last_login: "2024-01-15T12:00:00Z",
          total_tasks: 67,
          completed_tasks: 54,
          is_lifetime: false,
          notes_count: 25,
          wishlist_count: 12,
        },
      ]

      const sampleSubscriptions: Subscription[] = [
        {
          id: "1",
          user_id: "1",
          plan: "pro",
          status: "active",
          billing_cycle: "monthly",
          amount: 19.99,
          next_billing_date: "2024-02-15T10:00:00Z",
          created_at: "2024-01-15T10:00:00Z",
        },
        {
          id: "2",
          user_id: "2",
          plan: "premium",
          status: "active",
          billing_cycle: "yearly",
          amount: 99.99,
          next_billing_date: "2025-01-10T09:00:00Z",
          created_at: "2024-01-10T09:00:00Z",
        },
      ]

      setUsers(sampleUsers)
      setSubscriptions(sampleSubscriptions)
      setStats({
        total_users: sampleUsers.length,
        active_subscriptions: sampleSubscriptions.filter((s) => s.status === "active").length,
        monthly_revenue: sampleSubscriptions
          .filter((s) => s.status === "active")
          .reduce((sum, s) => sum + (s.billing_cycle === "yearly" ? s.amount / 12 : s.amount), 0),
        total_tasks: sampleUsers.reduce((sum, u) => sum + u.total_tasks, 0),
        growth_rate: 15.2,
      })

      setIsLoading(false)
    }

    loadData()
  }, [])

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const handleSaveUser = async (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
    setShowEditModal(false)
    setSelectedUser(null)
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlan = filterPlan === "all" || user.plan === filterPlan
    return matchesSearch && matchesPlan
  })

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case "pro":
        return Zap
      case "premium":
        return Crown
      default:
        return Star
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "pro":
        return "bg-purple-100 text-purple-800"
      case "premium":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "expired":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, subscriptions, and system settings</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_users}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />+{stats.growth_rate}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active_subscriptions}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.active_subscriptions / stats.total_users) * 100).toFixed(1)}% conversion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthly_revenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Recurring revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_tasks}</div>
              <p className="text-xs text-muted-foreground">Created by all users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <AlertCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Healthy</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Subscriptions</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterPlan} onValueChange={setFilterPlan}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Plans</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Users ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">User</th>
                        <th className="text-left p-2">Plan</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Tasks</th>
                        <th className="text-left p-2">AI Credits</th>
                        <th className="text-left p-2">Last Login</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => {
                        const PlanIcon = getPlanIcon(user.plan)
                        return (
                          <tr key={user.id} className="border-b hover:bg-muted/50">
                            <td className="p-2">
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </td>
                            <td className="p-2">
                              <Badge className={getPlanColor(user.plan)}>
                                <PlanIcon className="h-3 w-3 mr-1" />
                                {user.plan.toUpperCase()}
                                {user.is_lifetime && " (Lifetime)"}
                              </Badge>
                            </td>
                            <td className="p-2">
                              <Badge className={getStatusColor(user.subscription_status)}>
                                {user.subscription_status}
                              </Badge>
                            </td>
                            <td className="p-2">
                              <div className="text-sm">
                                {user.completed_tasks}/{user.total_tasks}
                                <div className="text-xs text-muted-foreground">
                                  {user.total_tasks > 0
                                    ? Math.round((user.completed_tasks / user.total_tasks) * 100)
                                    : 0}
                                  % complete
                                </div>
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="text-sm">
                                {user.ai_credits}
                                {user.plan === "pro" && <div className="text-xs text-muted-foreground">Pro user</div>}
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="text-sm">
                                {user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">User</th>
                        <th className="text-left p-2">Plan</th>
                        <th className="text-left p-2">Billing</th>
                        <th className="text-left p-2">Amount</th>
                        <th className="text-left p-2">Next Billing</th>
                        <th className="text-left p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.map((subscription) => {
                        const user = users.find((u) => u.id === subscription.user_id)
                        return (
                          <tr key={subscription.id} className="border-b">
                            <td className="p-2">
                              <div>
                                <div className="font-medium">{user?.name}</div>
                                <div className="text-sm text-muted-foreground">{user?.email}</div>
                              </div>
                            </td>
                            <td className="p-2">
                              <Badge className={getPlanColor(subscription.plan)}>
                                {subscription.plan.toUpperCase()}
                              </Badge>
                            </td>
                            <td className="p-2">
                              <Badge variant="outline">{subscription.billing_cycle}</Badge>
                            </td>
                            <td className="p-2">${subscription.amount}</td>
                            <td className="p-2">
                              {subscription.next_billing_date
                                ? new Date(subscription.next_billing_date).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="p-2">
                              <Badge className={getStatusColor(subscription.status)}>{subscription.status}</Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                    <p>Analytics charts would be implemented here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                    <p>Revenue analytics would be implemented here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable maintenance mode for system updates</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New User Registrations</Label>
                      <p className="text-sm text-muted-foreground">Allow new users to register</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send system notifications via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit User Modal */}
        {selectedUser && (
          <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit User: {selectedUser.name}</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const updatedUser: User = {
                    ...selectedUser,
                    name: formData.get("name") as string,
                    email: formData.get("email") as string,
                    plan: formData.get("plan") as "free" | "premium" | "pro",
                    subscription_status: formData.get("status") as "active" | "cancelled" | "expired",
                    ai_credits: Number.parseInt(formData.get("ai_credits") as string) || 0,
                    is_lifetime: formData.get("is_lifetime") === "on",
                  }
                  handleSaveUser(updatedUser)
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" defaultValue={selectedUser.name} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={selectedUser.email} required />
                  </div>
                  <div>
                    <Label htmlFor="plan">Plan</Label>
                    <Select name="plan" defaultValue={selectedUser.plan}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={selectedUser.subscription_status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="ai_credits">AI Credits</Label>
                    <Input
                      id="ai_credits"
                      name="ai_credits"
                      type="number"
                      defaultValue={selectedUser.ai_credits}
                      min="0"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_lifetime"
                      name="is_lifetime"
                      defaultChecked={selectedUser.is_lifetime}
                    />
                    <Label htmlFor="is_lifetime">Lifetime Subscription</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
