import type { ChipDenomination } from '@/types/poker'

export interface ChipBreakdownItem {
  id: string
  value: number
  count: number
  color: string
  label: string
}

export interface ChipBreakdown {
  items: ChipBreakdownItem[]
  total: number
  /** True when the items add up to the starting stack exactly. */
  exact: boolean
}

/**
 * How many of the smallest denominations each player should get for a 10,000
 * stack, smallest first. Enough small chips mean nobody has to make change for
 * the blinds in the early levels (PKR-10). Scaled with the stack.
 */
const SMALL_CHIP_TARGETS = [10, 8, 6]

/** Upper bound on search steps, so a set with no exact answer cannot hang the UI. */
const SEARCH_BUDGET = 200_000

/**
 * Splits the starting stack into chips for one player (PKR-15).
 *
 * Each denomination is limited to its share of the physical set,
 * `floor(count / players)`, so the breakdown can be dealt to every player.
 *
 * Among the combinations that add up to the stack, the one whose small chips
 * are closest to their targets in total wins; the rest of the stack goes into
 * the largest chips that fit. When the set cannot make the stack exactly, the
 * closest total below it is returned with `exact: false`.
 */
export function calculateChipBreakdown(
  chips: readonly ChipDenomination[],
  startingStack: number,
  players: number,
): ChipBreakdown {
  const playerCount = Math.max(1, Math.floor(players))
  const stack = Math.max(0, Math.floor(startingStack))
  const sorted = [...chips]
    .filter(c => c.value > 0)
    .sort((a, b) => a.value - b.value)
  const limits = sorted.map(c => Math.floor(Math.max(0, c.count || 0) / playerCount))

  const scale = Math.max(1, stack / 10000)
  // Only denominations below the largest get a small-chip target.
  const smallCount = Math.min(SMALL_CHIP_TARGETS.length, Math.max(0, sorted.length - 1))
  const targets = sorted.map((_, i) =>
    i < smallCount ? Math.min(limits[i]!, Math.round(SMALL_CHIP_TARGETS[i]! * scale)) : 0,
  )

  // Small-chip combinations, closest to the targets first. Picking the
  // smallest denomination greedily would starve the next one (7 whites and 4
  // reds instead of 6 and 7), so the whole combination is ranked at once.
  // They are generated one distance at a time: listing every combination up
  // front costs a third of a second for a single player with a big stack.
  const smallIdx = sorted.map((_, i) => i).slice(0, smallCount)
  const smallSum = (combo: number[]) => combo.reduce((sum, n, k) => sum + n * sorted[k]!.value, 0)
  const maxDistance = smallIdx.reduce((d, i) => d + Math.max(targets[i]!, limits[i]! - targets[i]!), 0)

  /** Combinations whose counts differ from the targets by `distance` in total. */
  function combosAt(distance: number): number[][] {
    const result: number[][] = []
    const walk = (k: number, left: number, combo: number[]) => {
      if (k === smallIdx.length) {
        if (left === 0) result.push(combo)
        return
      }
      const target = targets[k]!
      for (let offset = 0; offset <= left; offset++) {
        for (const n of offset === 0 ? [target] : [target - offset, target + offset]) {
          if (n >= 0 && n <= limits[k]!) walk(k + 1, left - offset, [...combo, n])
        }
      }
    }
    walk(0, distance, [])
    return result.filter(combo => smallSum(combo) <= stack).sort((x, y) => smallSum(y) - smallSum(x))
  }

  // The rest of the stack, largest denomination first.
  const bigIdx = sorted.map((_, i) => i).slice(smallCount).reverse()
  const maxAfter = new Array<number>(bigIdx.length + 1).fill(0)
  for (let p = bigIdx.length - 1; p >= 0; p--) {
    const i = bigIdx[p]!
    maxAfter[p] = maxAfter[p + 1]! + limits[i]! * sorted[i]!.value
  }

  const counts = new Array<number>(sorted.length).fill(0)
  let best = { total: -1, counts: [...counts] }
  let steps = 0
  let found = false

  function fill(p: number, sum: number): void {
    if (found || steps++ > SEARCH_BUDGET) return
    if (sum > best.total) best = { total: sum, counts: [...counts] }
    if (sum === stack) {
      found = true
      return
    }
    if (p === bigIdx.length) return
    // Even every remaining chip cannot reach the stack or beat the best so far.
    if (sum + maxAfter[p]! < stack && sum + maxAfter[p]! <= best.total) return
    const i = bigIdx[p]!
    const value = sorted[i]!.value
    for (let n = Math.min(limits[i]!, Math.floor((stack - sum) / value)); n >= 0; n--) {
      counts[i] = n
      fill(p + 1, sum + n * value)
      if (found) return
    }
    counts[i] = 0
  }

  search: for (let distance = 0; distance <= maxDistance; distance++) {
    for (const combo of combosAt(distance)) {
      combo.forEach((n, k) => (counts[smallIdx[k]!] = n))
      fill(0, smallSum(combo))
      if (found || steps > SEARCH_BUDGET) break search
    }
  }

  const items = sorted
    .map((chip, i) => ({
      id: chip.id,
      value: chip.value,
      count: best.counts[i] ?? 0,
      color: chip.color,
      label: chip.label,
    }))
    .filter(item => item.count > 0)

  return { items, total: Math.max(0, best.total), exact: best.total === stack }
}
