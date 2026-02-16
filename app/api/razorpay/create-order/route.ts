import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, receipt, notes } = body

    console.log('Creating Razorpay order with:', { amount, currency, receipt })
    console.log('Key ID:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)
    console.log('Key Secret exists:', !!process.env.RAZORPAY_KEY_SECRET)

    // Check if credentials are set
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials not configured')
    }

    if (process.env.RAZORPAY_KEY_SECRET === 'your_razorpay_key_secret_here') {
      throw new Error('Please update RAZORPAY_KEY_SECRET in .env.local with your actual secret key')
    }

    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    // Create order
    const order = await razorpay.orders.create({
      amount: amount, // amount in smallest currency unit (paise)
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    })

    console.log('Order created successfully:', order.id)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error)
    console.error('Error details:', error.message, error.stack)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create order',
      },
      { status: 500 }
    )
  }
}
