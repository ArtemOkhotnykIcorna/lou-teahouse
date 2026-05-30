import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

interface WebhookPayload {
  invoiceId: string;
  status: string;
  reference?: string;
}

export async function POST(request: NextRequest) {
  let payload: WebhookPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload.reference) {
    return NextResponse.json({ ok: true });
  }

  const db = await getDb();
  const order = await db.order.findUnique({
    where: { orderNumber: payload.reference },
  });

  if (!order) {
    return NextResponse.json({ ok: true });
  }

  if (payload.status === "success") {
    await db.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "paid",
        status: "processing",
        monoInvoiceId: payload.invoiceId,
      },
    });
  } else if (payload.status === "failure" || payload.status === "expired") {
    await db.order.update({
      where: { id: order.id },
      data: { paymentStatus: "failed" },
    });
  }

  return NextResponse.json({ ok: true });
}
