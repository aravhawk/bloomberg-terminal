# Bloomberg Terminal Clone

## Project Overview
A Bloomberg Terminal clone built with Next.js 15 (App Router), TypeScript, and Tailwind CSS v4. Features 29 function screens mimicking Bloomberg Terminal functionality with real-time data streaming via WebSocket.

## Tech Stack
- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 (`@theme inline` in globals.css, no tailwind.config.ts)
- **State**: Zustand v5 with `persist` middleware
- **Data Fetching**: TanStack Query v5
- **Charts**: lightweight-charts v5 (candlestick), Recharts (line/area/bar/pie/treemap)
- **Real-time**: WebSocket (Finnhub)
- **Package Manager**: pnpm

## API Integrations
- **Finnhub** (FINNHUB_API_KEY): Quotes, profiles, candles, news, earnings, recommendations, peers, dividends, economic calendar, symbol search
- **FMP** (FMP_API_KEY): Financial statements, key metrics, screener, peers
- **CoinGecko** (no key): Cryptocurrency prices and market data
- **FRED** (FRED_API_KEY): Economic indicators, Treasury yields
- **ExchangeRate-API** (no key): Forex rates and currency conversion
- **Alpha Vantage** (ALPHA_VANTAGE_API_KEY): Commodities (with fallback data)

## Architecture
```
src/
  app/              # Next.js App Router pages and API routes
    api/            # 22 API route handlers
  components/
    charts/         # 7 chart components (CandlestickChart, LineChart, etc.)
    data-display/   # 6 reusable data display components
    functions/      # 29 function screen components (DES, GP, FA, etc.)
    terminal/       # 6 terminal shell components (Terminal, CommandBar, etc.)
  hooks/            # 20 custom hooks
  lib/
    api/            # 6 API client modules
    types.ts        # All TypeScript interfaces/types
    constants.ts    # Function registry, market data constants
    commands.ts     # Command bar parsing
    formatters.ts   # Number/date formatting utilities
    utils.ts        # General utilities (cn, nanoid, debounce, etc.)
    indicators.ts   # Technical indicators (SMA, EMA, RSI, MACD, Bollinger)
    rateLimit.ts    # In-memory rate limiter
  providers/        # QueryProvider, WebSocketProvider
  store/            # 7 Zustand stores
```

## Key Patterns
- **Command system**: `TICKER FUNCTION` syntax (e.g., "AAPL GP") parsed in CommandBar
- **Panel system**: Quad/single/dual/triple layouts with tab management and security group linking (A/B/C/D)
- **Dynamic imports**: Function screens lazy-loaded via `next/dynamic` in FunctionRouter
- **API routes**: All external API calls proxied through Next.js API routes (server-side keys)
- **Next.js 15 params**: API route params are `Promise` and must be awaited
- **lightweight-charts v5**: Uses `chart.addSeries(CandlestickSeries, opts)` (not `addCandlestickSeries`)
- **Tailwind v4**: Uses `@theme inline` in CSS, no tailwind.config.ts, PostCSS via `@tailwindcss/postcss`

## Commands
- `pnpm dev` - Start development server
- `pnpm build` - Production build
- `pnpm lint` - Run ESLint

## Environment Variables
See `.env.example` for required API keys. Copy to `.env.local` and fill in values.
