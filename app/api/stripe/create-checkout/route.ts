import { type NextRequest, NextResponse } from "next/server"
import { stripe, CREDIT_PACKS } from "@/lib/stripe"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { packId } = await request.json()

    // Get user from session
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the credit pack
    const pack = CREDIT_PACKS.find((p) => p.id === packId)
    if (!pack) {
      return NextResponse.json({ error: "Invalid pack" }, { status: 400 })
    }

    // Get user email
    const { data: userData } = await supabase.from("users").select("email").eq("id", user.id).single()

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: pack.name,
              description: pack.description,
            },
            unit_amount: Math.round(pack.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/app/subscription?success=true&credits=${pack.credits}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/app/subscription?canceled=true`,
      customer_email: userData?.email || user.email,
      metadata: {
        userId: user.id,
        packId: pack.id,
        credits: pack.credits.toString(),
        type: "credit_pack",
      },
    })

    // Create pending purchase record
    await supabase.from("credit_purchases").insert({
      user_id: user.id,
      credits_amount: pack.credits,
      price_paid: pack.price,
      currency: "EUR",
      stripe_session_id: session.id,
      status: "pending",
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
