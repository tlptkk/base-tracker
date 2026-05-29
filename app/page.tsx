'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── Tipler ─────────────────────────────────────────────────────────────────

interface VolumePool {
  id: string
  name: string
  address: string
  dex: string
  baseToken: { name: string; symbol: string; address: string }
  price: number
  volume24h: number
  priceChange24h: number
  liquidity: number
  fdv: number
  txCount24h: number
  poolCreatedAt: string
  dexscreenerUrl: string
}

interface NewPair {
  id: string
  name: string
  address: string
  baseToken: { name: string; symbol: string; address: string }
  price: number
  volume24h: number
  liquidity: number
  priceChange5m: number
  priceChange1h: number
  createdAt: string
  dexscreenerUrl: string
}

// ─── Yardımcı Fonksiyonlar ───────────────────────────────────────────────────

function formatUSD(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toFixed(2)}`
}

function formatPrice(n: number): string {
  if (n === 0) return '$0'
  if (n < 0.000001) return `$${n.toExponential(2)}`
  if (n < 0.01) return `$${n.toFixed(6)}`
  if (n < 1) return `$${n.toFixed(4)}`
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return 'Bilinmiyor'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}d önce`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}s önce`
  return `${Math.floor(hrs / 24)}g önce`
}

function PriceChange({ value, suffix = '' }: { value: number; suffix?: string }) {
  const isPos = value >= 0
  return (
    <span className={`font-semibold text-sm ${isPos ? 'text-green-400' : 'text-red-400'}`}>
      {isPos ? '▲' : '▼'} {Math.abs(value).toFixed(2)}%{suffix}
    </span>
  )
}

// ─── Skeleton ───────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-16 rounded-xl bg-[#1A1A1A] animate-pulse"
          style={{ opacity: 1 - i * 0.08 }}
        />
      ))}
    </div>
  )
}

// ─── Volume Tablosu ─────────────────────────────────────────────────────────

function VolumeTable({ pools }: { pools: VolumePool[] }) {
  if (!pools.length) return <Skeleton />

  return (
    <div className="space-y-2">
      {pools.map((pool, idx) => (
        <a
          key={pool.id}
          href={pool.dexscreenerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-xl bg-[#111] border border-[#1E1E1E] hover:border-[#0052FF] hover:bg-[#0A0A20] transition-all duration-200 group"
        >
          {/* Sıra */}
          <div className="w-6 text-center text-xs text-gray-500 font-bold shrink-0">
            {idx + 1}
          </div>

          {/* Token Bilgisi */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white truncate">
                {pool.baseToken.symbol || pool.name.split('/')[0]}
              </span>
              <span className="text-xs text-gray-500 bg-[#1A1A1A] px-1.5 py-0.5 rounded shrink-0">
                {pool.dex?.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-gray-500 truncate">{pool.name}</div>
          </div>

          {/* Fiyat & Değişim */}
          <div className="text-right shrink-0">
            <div className="text-sm font-semibold text-white">
              {formatPrice(pool.price)}
            </div>
            <PriceChange value={pool.priceChange24h} />
          </div>

          {/* Hacim */}
          <div className="text-right shrink-0 hidden sm:block">
            <div className="text-xs text-gray-400">24s Hacim</div>
            <div className="text-sm font-bold text-[#0052FF]">
              {formatUSD(pool.volume24h)}
            </div>
          </div>

          {/* Ok */}
          <div className="text-gray-600 group-hover:text-[#0052FF] transition-colors shrink-0">
            →
          </div>
        </a>
      ))}
    </div>
  )
}

// ─── Yeni Tokenlar Tablosu ──────────────────────────────────────────────────

function NewTokensTable({ pairs }: { pairs: NewPair[] }) {
  if (!pairs.length) return <Skeleton />

  return (
    <div className="space-y-2">
      {pairs.map((pair) => (
        <a
          key={pair.id}
          href={pair.dexscreenerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-xl bg-[#111] border border-[#1E1E1E] hover:border-[#0052FF] hover:bg-[#0A0A20] transition-all duration-200 group"
        >
          {/* Yeni etiketi */}
          <div className="w-6 flex items-center justify-center shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#0052FF] live-dot" />
          </div>

          {/* Token Bilgisi */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white truncate">
                {pair.baseToken.symbol || pair.name.split('/')[0]}
              </span>
              {pair.liquidity < 10000 && (
                <span className="text-xs text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded shrink-0">
                  Düşük Likidite
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">{timeAgo(pair.createdAt)}</div>
          </div>

          {/* Fiyat & Değişim */}
          <div className="text-right shrink-0">
            <div className="text-sm font-semibold text-white">
              {formatPrice(pair.price)}
            </div>
            <div className="flex gap-2 justify-end">
              <span className="text-xs text-gray-500">5d:</span>
              <PriceChange value={pair.priceChange5m} />
            </div>
          </div>

          {/* Likidite */}
          <div className="text-right shrink-0 hidden sm:block">
            <div className="text-xs text-gray-400">Likidite</div>
            <div className="text-sm font-semibold text-gray-200">
              {formatUSD(pair.liquidity)}
            </div>
          </div>

          <div className="text-gray-600 group-hover:text-[#0052FF] transition-colors shrink-0">
            →
          </div>
        </a>
      ))}
    </div>
  )
}

// ─── Ana Bileşen ────────────────────────────────────────────────────────────

export default function Home() {
  const [tab, setTab] = useState<'volume' | 'new'>('volume')
  const [volumePools, setVolumePools] = useState<VolumePool[]>([])
  const [newPairs, setNewPairs] = useState<NewPair[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      if (tab === 'volume') {
        const res = await fetch('/api/volume')
        const data = await res.json()
        setVolumePools(data.pools || [])
      } else {
        const res = await fetch('/api/new-tokens')
        const data = await res.json()
        setNewPairs(data.newPairs || [])
      }
      setLastUpdated(new Date())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [tab])

  useEffect(() => {
    fetchData()
    // 60 saniyede bir otomatik yenile
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [fetchData])

  return (
    <div className="min-h-screen bg-[#0A0A0A] max-w-xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#1E1E1E] px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* Base Logo */}
            <div className="w-8 h-8 rounded-full bg-[#0052FF] flex items-center justify-center font-black text-white text-sm">
              B
            </div>
            <div>
              <h1 className="font-black text-white text-lg leading-none">Base Tracker</h1>
              <p className="text-xs text-gray-500">Base Network · Canlı Veri</p>
            </div>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-40 flex items-center gap-1"
          >
            {loading ? (
              <span className="animate-spin">↻</span>
            ) : (
              <span>↻</span>
            )}
            Yenile
          </button>
        </div>

        {/* Sekmeler */}
        <div className="flex rounded-xl bg-[#111] p-1 gap-1">
          <button
            onClick={() => setTab('volume')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === 'volume'
                ? 'bg-[#0052FF] text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🔥 Top 24s Hacim
          </button>
          <button
            onClick={() => setTab('new')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === 'new'
                ? 'bg-[#0052FF] text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ✨ Yeni Tokenlar
          </button>
        </div>
      </div>

      {/* İçerik */}
      <div className="px-4 py-3">
        {/* Son güncelleme */}
        {lastUpdated && !loading && (
          <p className="text-xs text-gray-600 mb-3 text-right">
            Son güncelleme: {lastUpdated.toLocaleTimeString('tr-TR')}
          </p>
        )}

        {loading ? (
          <Skeleton />
        ) : tab === 'volume' ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-gray-400">
                Base ağında son 24 saatte en fazla işlem hacmi yapan tokenlar
              </span>
            </div>
            <VolumeTable pools={volumePools} />
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#0052FF] live-dot shrink-0" />
              <span className="text-xs text-gray-400">
                Base ağına en son deploy edilen token çiftleri
              </span>
            </div>
            <NewTokensTable pairs={newPairs} />
          </>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-xs text-gray-700">
        Veri: GeckoTerminal & DexScreener · Base Network
      </div>
    </div>
  )
}
