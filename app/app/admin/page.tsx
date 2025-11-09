"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Shield, Search, Crown, Zap } from "lucide-react"

interface User {
  id: string
  email: string
  name: string | null
  subscription_tier: string | null
  created_at: string
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      // Check if user is admin (you can add an is_admin column to users table)
      // For now, checking if email contains "admin" - replace with proper admin check
      const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

      // Simple admin check - replace with your own logic
      if (userData?.email?.includes("admin") || userData?.subscription_tier === "admin") {
        setIsAdmin(true)
        fetchUsers()
      } else {
        router.push("/app")
      }
    } catch (error) {
      console.error("[v0] Admin access check error:", error)
      router.push("/app")
    }
  }

  const fetchUsers = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("users")
        .select("id, email, name, subscription_tier, created_at")
        .order("created_at", { ascending: false })

      if (error) throw error

      setUsers(data || [])
      setFilteredUsers(data || [])
    } catch (error) {
      console.error("[v0] Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserTier = async (userId: string, newTier: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("users").update({ subscription_tier: newTier }).eq("id", userId)

      if (error) throw error

      // Update local state
      setUsers(users.map((u) => (u.id === userId ? { ...u, subscription_tier: newTier } : u)))
      setFilteredUsers(filteredUsers.map((u) => (u.id === userId ? { ...u, subscription_tier: newTier } : u)))
    } catch (error) {
      console.error("[v0] Error updating user tier:", error)
    }
  }

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-8 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </Card>
      </div>
    )
  }

  const getTierIcon = (tier: string | null) => {
    switch (tier) {
      case "pro":
        return <Zap className="w-4 h-4 text-yellow-500" />
      case "premium":
        return <Crown className="w-4 h-4 text-purple-500" />
      default:
        return null
    }
  }

  const getTierBadge = (tier: string | null) => {
    const tierLower = tier?.toLowerCase() || "free"
    const colors = {
      free: "bg-gray-500/20 text-gray-500",
      premium: "bg-purple-500/20 text-purple-500",
      pro: "bg-yellow-500/20 text-yellow-500",
    }
    return colors[tierLower as keyof typeof colors] || colors.free
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Admin Panel</h1>
        </div>
        <p className="text-muted-foreground">Manage user subscriptions and access</p>
      </div>

      {/* Search */}
      <Card className="glass-card p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search users by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border/50">
              <tr className="bg-secondary/50">
                <th className="text-left p-4 font-semibold">User</th>
                <th className="text-left p-4 font-semibold">Email</th>
                <th className="text-left p-4 font-semibold">Current Tier</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <div className="font-medium">{user.name || "No name"}</div>
                      <div className="text-sm text-muted-foreground">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 text-sm">{user.email}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getTierBadge(
                          user.subscription_tier,
                        )}`}
                      >
                        {getTierIcon(user.subscription_tier)}
                        {user.subscription_tier?.toUpperCase() || "FREE"}
                      </span>
                    </td>
                    <td className="p-4">
                      <Select
                        value={user.subscription_tier || "free"}
                        onValueChange={(value) => updateUserTier(user.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <Card className="glass-card p-6">
          <div className="text-sm text-muted-foreground mb-2">Total Users</div>
          <div className="text-3xl font-bold">{users.length}</div>
        </Card>
        <Card className="glass-card p-6">
          <div className="text-sm text-muted-foreground mb-2">Premium Users</div>
          <div className="text-3xl font-bold text-purple-500">
            {users.filter((u) => u.subscription_tier === "premium").length}
          </div>
        </Card>
        <Card className="glass-card p-6">
          <div className="text-sm text-muted-foreground mb-2">Pro Users</div>
          <div className="text-3xl font-bold text-yellow-500">
            {users.filter((u) => u.subscription_tier === "pro").length}
          </div>
        </Card>
      </div>
    </div>
  )
}
