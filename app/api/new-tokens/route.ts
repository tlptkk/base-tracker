import { NextResponse } from 'next/server'

// DexScreener API - Yeni token profilleri (Base ağı filtreli)
// Ücretsiz, API key gerektirmez, rate limit: 60 req/min
export async function GET() {
  try {
    const [profilesRes, newPairsRes] = await Promise.all([
      // En son token profilleri
      fetch('https://api.dexscreener.com/token-profiles/latest/v1', {
        next: { revalidate: 30 },
      }),
      // Base'de yeni pair'lar (GeckoTerminal)
      fetch(
        'https://api.geckoterminal.com/api/v2/networks/base/pools?sort=pool_created_at_desc&page=1',
        {
          headers: { Accept: 'application/json;version=20230302' },
          next: { revalidate: 30 },
        }
      ),
    ])

    // DexScreener token profilleri
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

    // GeckoTerminal yeni pool'lar
    let newPairs: any[] = []
    if (newPairsRes.ok) {
      const pairsData = await newPairsRes.json()
      newPairs = (pairsData.data || []).slice(0, 20).map((pool: any) => {
        const attr = pool.attributes
        return {
          id: pool.id,
          name: attr.name,
          address: attr.address,
          baseToken: {
            name: attr.base_token_name,
            symbol: attr.base_token_symbol,
            address: attr.base_token_address,
          },
          price: parseFloat(attr.base_token_price_usd || '0'),
          volume24h: parseFloat(attr.volume_usd?.h24 || '0'),
          liquidity: parseFloat(attr.reserve_in_usd || '0'),
          priceChange5m: parseFloat(attr.price_change_percentage?.m5 || '0'),
          priceChange1h: parseFloat(attr.price_change_percentage?.h1 || '0'),
          createdAt: attr.pool_created_at,
          dexscreenerUrl: `https://dexscreener.com/base/${attr.address}`,
          source: 'geckoterminal',
        }
      })
    }

    return NextResponse.json({ newTokens, newPairs })
  } catch (err) {
    console.error('New tokens API error:', err)
    return NextResponse.json({ error: 'Veri alınamadı', newTokens: [], newPairs: [] }, { status: 500 })
  }
}
