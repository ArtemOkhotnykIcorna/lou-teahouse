import { NextRequest, NextResponse } from "next/server";
import { searchSettlements, getWarehouses } from "@/lib/novaposhta";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const action = searchParams.get("action");

  try {
    if (action === "cities") {
      const q = searchParams.get("q")?.trim() ?? "";
      if (q.length < 2) {
        return NextResponse.json({ data: [] });
      }
      const cities = await searchSettlements(q);
      return NextResponse.json({
        data: cities.map((c) => ({
          ref: c.DeliveryCity,
          label: c.Present,
          name: c.MainDescription,
        })),
      });
    }

    if (action === "warehouses") {
      const cityRef = searchParams.get("cityRef");
      if (!cityRef) {
        return NextResponse.json({ error: "cityRef required" }, { status: 400 });
      }
      const warehouses = await getWarehouses(cityRef);
      return NextResponse.json({
        data: warehouses.map((w) => ({
          ref: w.Ref,
          label: w.Description,
          address: w.ShortAddress,
          number: w.Number,
        })),
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "API error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
