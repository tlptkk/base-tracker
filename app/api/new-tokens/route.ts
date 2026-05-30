import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [profilesRes, newPairsRes] = await Promise.all([
      // DexScreener - En son token profilleri
      fetch('https://api.dexscreener.com/token-profiles/latest/v1', {
        next: { revalidate: 30 },
      }),
      // DexScreener - Base'de en yeni pair'lar
      fetch('https://api.dexscreener.com/latest/dex/search?q=base&order=pairCreatedAt&chainIds=base', {
        next: { revalidate: 30 },
      }),
    ])

    // DexScreener token profilleri (Base filtreli)
    let newTokens: any[] = []
    if (profilesRes.ok) {
      const profiles = await profilesRes.json()
      newTokens = (Array.isArray(profiles) ? profiles : [])
        .filter((p: any) => p.chainId === 'base')
        .slice(0, 15)
        .map((p: any) => ({
          address: p.tokenAddress,
          icon: p.icon,
          description: p.description,
          links: p.links || [],
          dexscreenerUrl: p.url,
          source: 'dexscreener',
        }))
    }

    // DexScreener - Yeni pair'lar
    let newPairs: any[] = []
    if (newPairsRes.ok) {
      const pairsData = await newPairsRes.json()
      const pairs = (pairsData.pairs || [])
        .filter((p: any) => p.chainId === 'base')
        .sort((a: any, b: any) => (b.pairCreatedAt || 0) - (a.pairCreatedAt || 0))
        .slice(0, 20)

      newPairs = pairs.map((p: any) => ({
        id: p.pairAddress,
        name: `${p.baseToken?.symbol}/${p.quoteToken?.symbol}`,
        address: p.pairAddress,
        baseToken: {
          name: p.baseToken?.name || '',
          symbol: p.baseToken?.symbol || '',
          address: p.baseToken?.address || '',
        },
        price: parseFloat(p.priceUsd || '0'),
        volume24h: p.volume?.h24 || 0,
        liquidity: p.liquidity?.usd || 0,
        priceChange5m: p.priceChange?.m5 || 0,
        priceChange1h: p.priceChange?.h1 || 0,
        createdAt: p.pairCreatedAt ? new Date(p.pairCreatedAt).toISOString() : '',
        dexscreenerUrl: p.url || `https://dexscreener.com/base/${p.pairAddress}`,
        source: 'dexscreener',
      }))
    }

    return NextResponse.json({ newTokens, newPairs })
  } catch (err) {
    console.error('New tokens API error:', err)
    return NextResponse.json({ error: 'Veri alınamadı', newTokens: [], newPairs: [] }, { status: 500 })
  }
}
