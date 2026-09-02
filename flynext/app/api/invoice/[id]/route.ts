import { prisma } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';

export async function GET(req: NextRequest, { params } : { params: Promise<{ id: string }> }) {
  const { id } =  await params; 
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { invoiceId: id },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (invoice.userId !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(invoice);
  } catch (err) {
    console.error('Error fetching invoice:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

