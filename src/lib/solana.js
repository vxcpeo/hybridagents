import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'

export const PROGRAM_ID = new PublicKey('6tdNLcioiV74gMXLyHLLdxhfibTVxqd6pLUUmgEncXcs')
export const LOCAL_RPC = import.meta.env.VITE_SOLANA_RPC_URL || 'http://127.0.0.1:8899'

export function localConnection() {
  return new Connection(LOCAL_RPC, 'confirmed')
}

export function deriveConfigAddress() {
  return PublicKey.findProgramAddressSync([Buffer.from('config')], PROGRAM_ID)[0]
}

export function deriveAgentAddress(owner, agentId) {
  const ownerKey = owner instanceof PublicKey ? owner : new PublicKey(owner)
  const id = new Uint8Array(8)
  new DataView(id.buffer).setBigUint64(0, BigInt(agentId), true)
  return PublicKey.findProgramAddressSync([Buffer.from('agent'), ownerKey.toBuffer(), id], PROGRAM_ID)[0]
}

export function localWalletAddress() {
  return import.meta.env.VITE_LOCAL_WALLET || ''
}

function encodeString(value) {
  const bytes = new TextEncoder().encode(value)
  const length = new Uint8Array(4)
  new DataView(length.buffer).setUint32(0, bytes.length, true)
  return new Uint8Array([...length, ...bytes])
}

export function buildCreateAgentInstruction({ owner, agentId, name, description, endpoint = 'local://agent' }) {
  const ownerKey = owner instanceof PublicKey ? owner : new PublicKey(owner)
  const id = new Uint8Array(8)
  new DataView(id.buffer).setBigUint64(0, BigInt(agentId), true)
  const agent = deriveAgentAddress(ownerKey, agentId)
  const payload = new Uint8Array([
    ...Uint8Array.from([0x8f, 0x42, 0xc6, 0x5f, 0x6e, 0x55, 0x3f, 0x9]),
    ...id,
    ...encodeString(name),
    ...encodeString(description),
    ...encodeString(endpoint),
    ...new Uint8Array(32)
  ])
  return {
    instruction: { programId: PROGRAM_ID.toBase58(), keys: [
      { pubkey: deriveConfigAddress().toBase58(), isSigner: false, isWritable: true },
      { pubkey: agent.toBase58(), isSigner: false, isWritable: true },
      { pubkey: ownerKey.toBase58(), isSigner: true, isWritable: true },
      { pubkey: '11111111111111111111111111111111', isSigner: false, isWritable: false }
    ], data: Array.from(payload) },
    agent
  }
}

export async function createAgentLocally({ owner, agentId = Date.now(), name = 'local-agent' }) {
  const normalizedOwner = owner || localWalletAddress()
  if (!normalizedOwner) {
    return { mode: 'mock', agent: `local-agent-${agentId}`, message: 'Local keypair is not configured' }
  }
  try {
    const address = deriveAgentAddress(normalizedOwner, agentId).toBase58()
    const instruction = buildCreateAgentInstruction({ owner: normalizedOwner, agentId, name, description: 'Local Quittra agent' })
    const blockhash = await localConnection().getLatestBlockhash().catch(() => null)
    return {
      mode: blockhash ? 'localnet' : 'mock',
      agent: address,
      instruction,
      blockhash: blockhash?.blockhash || null,
      message: blockhash ? 'PDA derived from the local Solana program' : 'Validator unavailable; local preview retained'
    }
  } catch {
    return { mode: 'mock', agent: `local-agent-${agentId}`, message: 'Wallet address is not a valid local keypair' }
  }
}

export const clusterLabel = import.meta.env.VITE_SOLANA_CLUSTER || 'localnet'
export const explorerBase = import.meta.env.VITE_EXPLORER_BASE_URL || clusterApiUrl('devnet')
