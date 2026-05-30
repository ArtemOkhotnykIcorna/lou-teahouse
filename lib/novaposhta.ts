const NP_API_URL = "https://api.novaposhta.ua/v2.0/json/";

interface NpResponse<T> {
  success: boolean;
  data: T[];
  errors: string[];
  warnings: string[];
}

async function npRequest<T>(
  calledMethod: string,
  methodProperties: Record<string, unknown>,
  modelName = "AddressGeneral"
): Promise<T[]> {
  const configuredKey = process.env.NOVA_POSHTA_API_KEY?.trim() ?? "";
  const keysToTry = configuredKey ? [configuredKey, ""] : [""];

  let lastError = "Nova Poshta API error";

  for (const apiKey of keysToTry) {
    const res = await fetch(NP_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey,
        modelName,
        calledMethod,
        methodProperties,
      }),
      cache: "no-store",
    });

    const json = (await res.json()) as NpResponse<T>;

    if (json.success) {
      return json.data ?? [];
    }

    lastError = json.errors?.join(", ") || lastError;

    const isInvalidKey = json.errors?.some((e) =>
      e.toLowerCase().includes("api key")
    );
    if (!isInvalidKey) break;
  }

  throw new Error(lastError);
}

export interface NpSettlement {
  Present: string;
  MainDescription: string;
  Area: string;
  Region: string;
  Ref: string;
  DeliveryCity: string;
}

export interface NpWarehouse {
  Ref: string;
  Description: string;
  ShortAddress: string;
  Number: string;
  CityRef: string;
}

export async function searchSettlements(query: string): Promise<NpSettlement[]> {
  if (query.length < 2) return [];

  const data = await npRequest<{ TotalCount: number; Addresses: NpSettlement[] }>(
    "searchSettlements",
    { CityName: query, Limit: 20, Page: 1 }
  );

  return data.flatMap((item) => item.Addresses ?? []);
}

export async function getWarehouses(cityRef: string): Promise<NpWarehouse[]> {
  return npRequest<NpWarehouse>("getWarehouses", {
    CityRef: cityRef,
    Limit: 500,
    Page: 1,
    Language: "UA",
  });
}

export const PICKUP_ADDRESS = "вул. Друкарська, 11";
export const PICKUP_CITY = "Львів";
