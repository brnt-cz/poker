export type CurrencyCode = 'CZK' | 'EUR' | 'USD'

interface CurrencyConfig {
  code: CurrencyCode
  symbol: string
  position: 'prefix' | 'suffix'
  defaults: { buyin: number; bounty: number }
  steps: { buyin: number; bounty: number }
}

const currencies: Record<CurrencyCode, CurrencyConfig> = {
  CZK: {
    code: 'CZK',
    symbol: 'Kč',
    position: 'suffix',
    defaults: { buyin: 100, bounty: 50 },
    steps: { buyin: 10, bounty: 5 }
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    position: 'prefix',
    defaults: { buyin: 5, bounty: 2 },
    steps: { buyin: 5, bounty: 1 }
  },
  USD: {
    code: 'USD',
    symbol: '$',
    position: 'prefix',
    defaults: { buyin: 5, bounty: 2 },
    steps: { buyin: 5, bounty: 1 }
  }
}

export function useCurrency() {
  /**
   * Format amount with currency symbol
   * format(100, 'CZK') → '100 Kč'
   * format(5, 'EUR') → '€5'
   */
  function format(amount: number, code: CurrencyCode): string {
    const config = currencies[code]
    const formattedAmount = amount.toLocaleString('cs-CZ')

    if (config.position === 'prefix') {
      return `${config.symbol}${formattedAmount}`
    }
    return `${formattedAmount} ${config.symbol}`
  }

  /**
   * Get full currency configuration
   */
  function getCurrencyConfig(code: CurrencyCode): CurrencyConfig {
    return currencies[code]
  }

  /**
   * Get default buy-in amount for a currency
   */
  function getDefaultBuyin(code: CurrencyCode): number {
    return currencies[code].defaults.buyin
  }

  /**
   * Get default bounty amount for a currency
   */
  function getDefaultBounty(code: CurrencyCode): number {
    return currencies[code].defaults.bounty
  }

  /**
   * Get buy-in step for increment/decrement buttons
   */
  function getBuyinStep(code: CurrencyCode): number {
    return currencies[code].steps.buyin
  }

  /**
   * Get bounty step for increment/decrement buttons
   */
  function getBountyStep(code: CurrencyCode): number {
    return currencies[code].steps.bounty
  }

  /**
   * Get currency symbol
   */
  function getSymbol(code: CurrencyCode): string {
    return currencies[code].symbol
  }

  /**
   * Get all available currencies
   */
  function getAllCurrencies(): CurrencyConfig[] {
    return Object.values(currencies)
  }

  return {
    format,
    getCurrencyConfig,
    getDefaultBuyin,
    getDefaultBounty,
    getBuyinStep,
    getBountyStep,
    getSymbol,
    getAllCurrencies
  }
}
