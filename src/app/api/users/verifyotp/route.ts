import { NextResponse } from 'next/server';
import User from '@/models/userModel';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

  
    if (
      user.verifyCode !== otp ||
      user.verifyCodeExpiry < Date.now()
    ) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

   
    user.isVerified = true;
    user.verifyCode = undefined; 
    user.verifyCodeExpiry = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: 'Email verified successfully' });

  } catch (error: any) {
    console.error('OTP verification error:', error.message);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
