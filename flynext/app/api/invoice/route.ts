// app/api/invoice/route.ts

import { prisma } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';

export async function GET(req: NextRequest) {
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invoices = await prisma.invoice.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        invoiceId: true,
        createdAt: true,
        totalAmount: true,
      },
    });

    return NextResponse.json(invoices);
  } catch (err) {
    console.error('Error fetching invoices:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
