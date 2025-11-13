import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    console.log("[v0] Starting signup for:", email, "with name:", name)

    // Step 1: Create user in Supabase Auth (this will trigger the database trigger that will fail)
    const signupResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name: name || email.split("@")[0],
        },
      }),
    })

    const signupData = await signupResponse.json()

    if (!signupResponse.ok) {
      console.error("[v0] Signup failed:", signupData.message || signupData.msg)

      // Check if it's the name constraint error from the trigger
      if (signupData.code === "23502" && signupData.message?.includes("name")) {
        // The user was created in auth.users but the trigger failed
        // We need to find the user and update the profile
        console.log("[v0] Trigger failed, attempting to fix profile...")

        // Try to find the user by email
        const listResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users`, {
          headers: {
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
          },
        })

        if (listResponse.ok) {
          const { users } = await listResponse.json()
          const createdUser = users?.find((u: any) => u.email === email)

          if (createdUser) {
            console.log("[v0] Found user, updating profile with name...")

            // Update the users table with the correct name using service role
            const updateResponse = await fetch(
              `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?id=eq.${createdUser.id}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
                  Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
                  Prefer: "return=minimal",
                },
                body: JSON.stringify({
                  name: name || email.split("@")[0],
                }),
              },
            )

            if (!updateResponse.ok) {
              const updateError = await updateResponse.json()
              console.error("[v0] Failed to update profile:", updateError)
              return NextResponse.json(
                { error: "Account created but profile setup failed. Please contact support." },
                { status: 500 },
              )
            }

            console.log("[v0] Profile updated successfully")
          }
        }
      } else {
        const errorMsg = signupData.msg || signupData.message || signupData.error || "Failed to create account"
        return NextResponse.json({ error: errorMsg }, { status: signupResponse.status })
      }
    } else {
      console.log("[v0] User created successfully with ID:", signupData.id)
    }

    // Step 2: Auto-login the user
    console.log("[v0] Attempting auto-login...")
    const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    if (loginResponse.ok) {
      const loginData = await loginResponse.json()

      if (loginData.access_token && loginData.refresh_token) {
        const cookieStore = await cookies()

        cookieStore.set("sb-access-token", loginData.access_token, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        })

        cookieStore.set("sb-refresh-token", loginData.refresh_token, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30,
        })

        console.log("[v0] Auto-login successful, cookies set")
      }
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully!",
    })
  } catch (error: any) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: error.message || "Signup failed" }, { status: 500 })
  }
}
