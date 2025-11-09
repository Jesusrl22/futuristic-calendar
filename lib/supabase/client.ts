export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const getAccessToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("sb-access-token="))
      ?.split("=")[1]
  }

  return {
    auth: {
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
          },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
          return { data: { session: null, user: null }, error: data }
        }

        return {
          data: {
            session: data,
            user: data.user,
          },
          error: null,
        }
      },
      signUp: async ({ email, password }: { email: string; password: string }) => {
        const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
          },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
          return { data: { session: null, user: null }, error: data }
        }

        return {
          data: {
            session: data.session,
            user: data.user,
          },
          error: null,
        }
      },
      signOut: async () => {
        document.cookie = "sb-access-token=; path=/; max-age=0"
        document.cookie = "sb-refresh-token=; path=/; max-age=0"
        return { error: null }
      },
      getSession: async () => {
        const accessToken = getAccessToken()

        if (!accessToken) {
          return { data: { session: null }, error: null }
        }

        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            apikey: supabaseKey,
          },
        })

        if (!response.ok) {
          return { data: { session: null }, error: null }
        }

        const user = await response.json()
        return {
          data: {
            session: { access_token: accessToken, user },
          },
          error: null,
        }
      },
      getUser: async () => {
        const accessToken = getAccessToken()

        if (!accessToken) {
          return { data: { user: null }, error: null }
        }

        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            apikey: supabaseKey,
          },
        })

        if (!response.ok) {
          return { data: { user: null }, error: null }
        }

        const user = await response.json()
        return {
          data: { user },
          error: null,
        }
      },
    },
    from: (table: string) => {
      const queryParams: string[] = []
      const filters: string[] = []
      let orderBy = ""
      let updateData: any = null
      let insertData: any = null
      let isDelete = false

      const builder = {
        select: (columns = "*") => {
          queryParams.push(`select=${columns}`)
          return builder
        },
        eq: (column: string, value: any) => {
          filters.push(`${column}=eq.${value}`)
          return builder
        },
        order: (column: string, options?: { ascending?: boolean }) => {
          orderBy = `${column}.${options?.ascending ? "asc" : "desc"}`
          return builder
        },
        update: (data: any) => {
          updateData = data
          return builder
        },
        insert: (data: any) => {
          insertData = data
          return builder
        },
        delete: () => {
          isDelete = true
          return builder
        },
        // Execute the query
        then: async (resolve: any, reject: any) => {
          try {
            const accessToken = getAccessToken()

            // Build URL with filters
            let url = `${supabaseUrl}/rest/v1/${table}`
            const allParams = [...queryParams, ...filters]
            if (orderBy) allParams.push(`order=${orderBy}`)
            if (allParams.length > 0) {
              url += `?${allParams.join("&")}`
            }

            let response

            // Handle different query types
            if (isDelete) {
              response = await fetch(url, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  apikey: supabaseKey,
                },
              })
            } else if (updateData) {
              response = await fetch(url, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                  apikey: supabaseKey,
                  Prefer: "return=representation",
                },
                body: JSON.stringify(updateData),
              })
            } else if (insertData) {
              response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                  apikey: supabaseKey,
                  Prefer: "return=representation",
                },
                body: JSON.stringify(insertData),
              })
            } else {
              response = await fetch(url, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  apikey: supabaseKey,
                },
              })
            }

            const data = await response.json()
            resolve({ data: response.ok ? data : null, error: response.ok ? null : data })
          } catch (error) {
            reject(error)
          }
        },
      }

      return builder
    },
  }
}
