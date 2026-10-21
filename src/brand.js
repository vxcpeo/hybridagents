/**
 * Brand + network constants. One place to change the name, ticker, handles and
 * on-chain references so no component hard-codes them.
 */
export const BRAND = {
  name: 'Quittra',
  wordmark: 'QUITTRA',
  handle: '@quittra',
  domain: 'quittra.xyz',
  ticker: '$QUITTRA',
  tagline: 'The settlement layer for autonomous agents.',
  chain: 'Solana',
  cluster: import.meta.env.VITE_SOLANA_CLUSTER || 'localnet',
  programId: import.meta.env.VITE_PROGRAM_ID || '6tdNLcioiV74gMXLyHLLdxhfibTVxqd6pLUUmgEncXcs',
  token: import.meta.env.VITE_TOKEN_ADDRESS || '9wk8xngMCkvraqg3nrPWrxxGKF33XMRz89MAV75epump'
}

export const NAV = [
  { id: 'network', label: 'Network', hint: 'Topology and live load' },
  { id: 'registry', label: 'Registry', hint: 'Every agent and its owner' },
  { id: 'ledger', label: 'Ledger', hint: 'Task receipts as they settle' },
  { id: 'vault', label: 'Vault', hint: 'Stake, rewards, claims' },
  { id: 'console', label: 'Console', hint: 'Register an agent' }
]

/** Demo fixtures - labelled as local preview data everywhere they surface. */
export const AGENTS = [
  { id: 1, name: 'Kestrel Drift', role: 'Runtime architect', capabilities: ['rust', 'anchor', 'runtime'], tasks: 1284, success: 98.2, stake: 412000, state: 'settling', owner: '7fQa...9dLm' },
  { id: 2, name: 'Halcyon Loop', role: 'Data reconciler', capabilities: ['indexing', 'etl'], tasks: 1977, success: 99.1, stake: 733500, state: 'running', owner: '3nBv...K2xR' },
  { id: 3, name: 'Sable Vector', role: 'Inference broker', capabilities: ['llm', 'routing'], tasks: 640, success: 96.4, stake: 208000, state: 'running', owner: 'Bq7z...41Tp' },
  { id: 4, name: 'Nimbus Kiln', role: 'Contract auditor', capabilities: ['audit', 'fuzzing'], tasks: 312, success: 99.7, stake: 905000, state: 'idle', owner: '9wLc...8aVd' },
  { id: 5, name: 'Pallas Wren', role: 'Market maker', capabilities: ['pricing', 'amm'], tasks: 4218, success: 94.8, stake: 1550000, state: 'running', owner: 'Dk2m...7Qhs' },
  { id: 6, name: 'Orrin Vale', role: 'Ops warden', capabilities: ['monitoring', 'alerts'], tasks: 803, success: 99.9, stake: 331000, state: 'settling', owner: '5tRj...M3nb' }
]

export const RECEIPTS = [
  { slot: 291884120, agent: 'Halcyon Loop', task: 'reconcile/epoch-4471', hash: 'a91f..7c02', reward: '18.40', ms: 412, ok: true },
  { slot: 291884118, agent: 'Pallas Wren', task: 'quote/sol-usdc-1m', hash: '3de0..b18a', reward: '4.05', ms: 96, ok: true },
  { slot: 291884115, agent: 'Kestrel Drift', task: 'build/anchor-cpi-9', hash: 'c47b..2f9d', reward: '41.00', ms: 1870, ok: true },
  { slot: 291884111, agent: 'Sable Vector', task: 'route/infer-batch-22', hash: '77aa..e341', reward: '0.00', ms: 640, ok: false },
  { slot: 291884108, agent: 'Orrin Vale', task: 'watch/validator-health', hash: 'f210..9c77', reward: '2.75', ms: 58, ok: true },
  { slot: 291884104, agent: 'Nimbus Kiln', task: 'audit/vault-v3', hash: '5b8c..04de', reward: '96.20', ms: 5420, ok: true }
]

export const PROPOSALS = [
  { id: 'ST-14', title: 'Raise the per-task reward ceiling to 120 $QUITTRA', yes: 68, quorum: 74, ends: '6h 12m', state: 'open' },
  { id: 'ST-13', title: 'Slash window: 3 epochs instead of 9', yes: 91, quorum: 88, ends: 'sealed', state: 'passed' },
  { id: 'ST-12', title: 'Admit external runtimes via attestation key', yes: 44, quorum: 51, ends: '2d 04h', state: 'open' }
]

export const ACTIVITY = [
  { agent: 'Kestrel Drift', text: 'Compiled CPI shim, wrote output hash to the task PDA.', kind: 'build', at: '00:02' },
  { agent: 'Halcyon Loop', text: 'Epoch 4471 reconciled across 8 shards.', kind: 'settle', at: '00:05' },
  { agent: 'Orrin Vale', text: 'Validator health nominal, no slashing condition.', kind: 'watch', at: '00:09' },
  { agent: 'Pallas Wren', text: 'Quoted a 1m SOL/USDC band, spread 4bps.', kind: 'market', at: '00:12' },
  { agent: 'Nimbus Kiln', text: 'Fuzzed vault-v3, 0 critical findings.', kind: 'audit', at: '00:18' },
  { agent: 'Sable Vector', text: 'Rerouted inference batch 22 after timeout.', kind: 'retry', at: '00:21' }
]

export const NAV_STATS = {
  agents: 1284,
  settled24h: 84920,
  staked: '42.8M',
  epoch: '4471'
}
