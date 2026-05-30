interface BasketItem {
  name: string;
  qty: number;
  sum: number;
  total: number;
}

interface CreateInvoiceParams {
  amount: number;
  orderNumber: string;
  basket: BasketItem[];
  redirectUrl: string;
  webHookUrl: string;
}

interface CreateInvoiceResponse {
  invoiceId: string;
  pageUrl: string;
}

export async function createMonobankInvoice(
  params: CreateInvoiceParams
): Promise<CreateInvoiceResponse> {
  const token = process.env.MONOBANK_TOKEN;
  if (!token) {
    throw new Error("MONOBANK_TOKEN не налаштовано");
  }

  const res = await fetch("https://api.monobank.ua/api/merchant/invoice/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Token": token,
    },
    body: JSON.stringify({
      amount: Math.round(params.amount * 100),
      ccy: 980,
      merchantPaymInfo: {
        reference: params.orderNumber,
        destination: `Замовлення ${params.orderNumber} — LOU Tea`,
        basketOrder: params.basket.map((item) => ({
          name: item.name,
          qty: item.qty,
          sum: Math.round(item.sum * 100),
          total: Math.round(item.total * 100),
          unit: "шт.",
        })),
      },
      redirectUrl: params.redirectUrl,
      webHookUrl: params.webHookUrl,
      validity: 86400,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Monobank API error: ${res.status} ${text}`);
  }

  return res.json() as Promise<CreateInvoiceResponse>;
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";
}
