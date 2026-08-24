// supabase/functions/get-shipping-rates/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// MANWE Store HQ / Warehouse Origin
const MANWE_ORIGIN = {
  city: "Lagos",
  state: "Lagos",
  country: "Nigeria",
  zip: "100001",
};

// Item weight estimation helper (GSM/Category based)
const estimateCartWeightKg = (cartItems: any[]): number => {
  if (!Array.isArray(cartItems)) return 1.0;
  
  const totalWeight = cartItems.reduce((acc, item) => {
    const cat = String(item.category || "").toLowerCase();
    let unitWeight = 0.4; // default tee/short weight (~400g)
    
    if (cat.includes("bottoms") || cat.includes("jogger")) unitWeight = 0.8;
    if (cat.includes("jersey") || cat.includes("hoodie")) unitWeight = 0.6;
    
    return acc + unitWeight * (item.quantity || 1);
  }, 0);

  return Math.max(0.5, Math.round(totalWeight * 10) / 10); // Minimum 0.5kg
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { checkoutData, cartItems } = await req.json();

    const destinationState = checkoutData?.state || "Lagos";
    const destinationCity = checkoutData?.city || destinationState;
    const destinationCountry = checkoutData?.country || "Nigeria";
    const weightKg = estimateCartWeightKg(cartItems);

    const TERMINAL_SECRET_KEY = Deno.env.get("TERMINAL_SECRET_KEY");

    // ─── IF TERMINAL AFRICA API KEY IS CONFIGURED ───────────────────────────
    if (TERMINAL_SECRET_KEY) {
      try {
        const terminalResponse = await fetch("https://api.terminal.africa/v1/rates/shipment", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${TERMINAL_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pickup_address: {
              city: MANWE_ORIGIN.city,
              state: MANWE_ORIGIN.state,
              country: "NG",
            },
            delivery_address: {
              city: destinationCity,
              state: destinationState,
              country: destinationCountry.toLowerCase().includes("ivoire") ? "CI" : "NG",
            },
            parcel: {
              weight: weightKg,
              items: cartItems.map((item: any) => ({
                name: item.name,
                quantity: item.quantity,
                weight: 0.4,
              })),
            },
          }),
        });

        const terminalData = await terminalResponse.json();

        if (terminalData.status && Array.isArray(terminalData.data) && terminalData.data.length > 0) {
          const rates = terminalData.data.map((rate: any) => ({
            id: rate.rate_id || rate.id,
            carrier: rate.carrier_name?.toUpperCase() || "EXPRESS COURIER",
            name: `${rate.carrier_name?.toUpperCase() || "STANDARD"} (${rate.delivery_time || "3-5 DAYS"})`,
            cost: Math.round(Number(rate.amount || rate.charge || 4500)),
            estDelivery: (rate.delivery_time || "3-5 BUSINESS DAYS").toUpperCase(),
            carrierLogo: rate.carrier_logo || null,
          }));

          return new Response(JSON.stringify({ rates, weightKg }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }
      } catch (err) {
        console.error("Terminal Africa API Call Failed, falling back to dynamic matrix:", err);
      }
    }

    // ─── DYNAMIC MATRIX FALLBACK (Calculates real distance rates automatically) ───
    const isLagos = destinationState.toLowerCase().includes("lagos");
    const isAbuja = destinationState.toLowerCase().includes("fct") || destinationState.toLowerCase().includes("abuja");
    const isRivers = destinationState.toLowerCase().includes("rivers");

    let baseGiglCost = 4500;
    let baseExpressCost = 7500;

    if (isLagos) {
      baseGiglCost = 3500 + Math.round(weightKg * 500);
      baseExpressCost = 5500 + Math.round(weightKg * 800);
    } else if (isAbuja || isRivers) {
      baseGiglCost = 5500 + Math.round(weightKg * 700);
      baseExpressCost = 8500 + Math.round(weightKg * 1000);
    } else {
      baseGiglCost = 5000 + Math.round(weightKg * 600);
      baseExpressCost = 8000 + Math.round(weightKg * 1000);
    }

    const fallbackRates = [
      {
        id: "gigl_standard",
        carrier: "GIG LOGISTICS",
        name: "GIGL STANDARD DELIVERY",
        cost: baseGiglCost,
        estDelivery: isLagos ? "1–2 BUSINESS DAYS" : "3–5 BUSINESS DAYS",
      },
      {
        id: "topship_express",
        carrier: "TOPSHIP / DHL EXPRESS",
        name: "EXPRESS AIR FREIGHT",
        cost: baseExpressCost,
        estDelivery: isLagos ? "SAME DAY / NEXT DAY" : "1–2 BUSINESS DAYS",
      },
    ];

    return new Response(JSON.stringify({ rates: fallbackRates, weightKg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});