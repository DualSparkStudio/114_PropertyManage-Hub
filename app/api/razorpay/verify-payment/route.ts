import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    // Create signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex')

    // Verify signature
    if (razorpay_signature === expectedSign) {
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid signature',
        },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to verify payment',
      },
      { status: 500 }
    )
  }
}
