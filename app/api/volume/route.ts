import { NextResponse } from 'next/server'

// GeckoTerminal API - Base ağında 24h hacme göre sıralı pool'lar
// Ücretsiz, API key gerektirmez
export async function GET() {
  try {
    const res = await fetch(
      'https://api.geckoterminal.com/api/v2/networks/base/pools?sort=h24_volume_usd_desc&page=1',
      {
        headers: { Accept: 'application/json;version=20230302' },
        next: { revalidate: 60 }, // 60 saniyede bir yenile
      }
    )

    if (!res.ok) {
      throw new Error(`GeckoTerminal API error: ${res.status}`)
    }

    const data = await res.json()

    // Veriyi sadeleştir
    const pools = data.data?.slice(0, 20).map((pool: any) => {
      const attr = pool.attributes
      return {
        id: pool.id,
        name: attr.name,
        address: attr.address,
        dex: attr.dex_id,
        baseToken: {
          name: attr.base_token_name,
          symbol: attr.base_token_symbol,
          address: attr.base_token_address,
        },
        price: parseFloat(attr.base_token_price_usd || '0'),
        volume24h: parseFloat(attr.volume_usd?.h24 || '0'),
        priceChange24h: parseFloat(attr.price_change_percentage?.h24 || '0'),
        liquidity: parseFloat(attr.reserve_in_usd || '0'),
        fdv: parseFloat(attr.fdv_usd || '0'),
        txCount24h: attr.transactions?.h24?.buys + attr.transactions?.h24?.sells || 0,
        poolCreatedAt: attr.pool_created_at,
        dexscreenerUrl: `https://dexscreener.com/base/${attr.address}`,
      }
    }) || []

    return NextResponse.json({ pools })
  } catch (err) {
    console.error('Volume API error:', err)
    return NextResponse.json({ error: 'Veri alınamadı', pools: [] }, { status: 500 })
  }
}
