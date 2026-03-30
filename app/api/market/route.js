export async function GET() {
  try {
    const [fxRes, spyRes, goldRes, oilRes] = await Promise.allSettled([
      fetch("https://open.er-api.com/v6/latest/USD"),
      fetch(`https://finnhub.io/api/v1/quote?symbol=SPY&token=${process.env.FINNHUB_API_KEY}`),
      fetch(`https://finnhub.io/api/v1/quote?symbol=GLD&token=${process.env.FINNHUB_API_KEY}`),
      fetch(`https://finnhub.io/api/v1/quote?symbol=USO&token=${process.env.FINNHUB_API_KEY}`),
    ]);

    let fx = {};
    if (fxRes.status === "fulfilled") {
      const d = await fxRes.value.json();
      if (d.rates) fx = d.rates;
    }

    const parseQuote = async (res) => {
      if (res.status !== "fulfilled") return null;
      const d = await res.value.json();
      if (!d.c) return null;
      return { price: d.c, change: d.dp };
    };

    const [spy, gold, oil] = await Promise.all([
      parseQuote(spyRes),
      parseQuote(goldRes),
      parseQuote(oilRes),
    ]);

    const krw = fx.KRW ? (1 / fx.KRW) * 1 * fx.KRW : null;

    return Response.json({
      fx: {
        krw: fx.KRW ? Math.round(fx.KRW) : null,
        eur: fx.EUR ? +(fx.KRW / fx.EUR).toFixed(0) : null,
        jpy: fx.JPY ? +(fx.KRW / fx.JPY * 100).toFixed(0) : null,
      },
      market: { spy, gold, oil },
      ts: Date.now(),
    });
  } catch (e) {
    return Response.json({ error: "시장 데이터 로드 실패" }, { status: 500 });
  }
}