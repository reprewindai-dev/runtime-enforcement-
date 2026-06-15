import React from 'react';
import { ExecutionState, Scenario, Agent } from '../types';
import { RuntimeSpine } from './RuntimeSpine';

interface Props {
  state: ExecutionState;
  selectedAgent: Agent | null;
  selectedScenario: Scenario | null;
  simulatedData: any | null;
}

export const LiveSimulation: React.FC<Props> = ({
  state,
  selectedAgent,
  selectedScenario,
  simulatedData,
}) => {
  return (
    <div className="flex-1 rounded-2xl border border-white/10 bg-[#080808] overflow-hidden flex flex-col relative min-h-[360px]">
      {/* Background radial matrix grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_#3b82f6_1px,_transparent_1px)] bg-[size:16px_16px]" />

      {/* Header bar */}
      <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-[#0c0c0c]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[17px] text-white/40">analytics</span>
          <span className="text-[10px] font-mono font-bold text-white/60 uppercase tracking-wider">
            Sovereign pipeline monitor (Veklom Core)
          </span>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                state !== 'idle' ? 'bg-orange-500 animate-ping' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* State details & pipeline */}
      <div className="flex-1 p-5 flex flex-col items-center justify-center relative min-h-[160px] border-b border-white/10">
        <RuntimeSpine state={state} scenarioName={selectedScenario?.name || ''} />

        {/* Dynamic status alert message box */}
        {state !== 'idle' && (
          <div className="absolute bottom-4 left-4 right-4 bg-white/[0.02] border border-white/10 p-3 rounded-xl flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3 min-w-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-mono tracking-wide uppercase text-white/80 truncate">
                {state === 'evaluating' && 'Generating PGL Pre-Certificate... analyzing intent & tool manifest hashes.'}
                {state === 'compiling' && 'Minting Execution Identity... compiling SEKED decision compliance token.'}
                {state === 'executing' && 'Running through Gateway... evaluating MCP boundary, TTL, and budget ceilings.'}
                {state === 'verifying' && 'Committing evidence ledger... generating cryptographic proofs on Veklom ledger.'}
                {state === 'finalized' && 'Enforcement Completed: Threat blocked. Proof attestation successfully registered.'}
              </span>
            </div>
            <span className="text-[9px] font-mono text-white/33 hidden sm:inline uppercase">
              Veklom Runtime v1
            </span>
          </div>
        )}
      </div>

      {/* Authentic CAPPO ExecutionIdentityV1 Container */}
      <div className="bg-[#040404] p-4 flex flex-col gap-3 min-h-[180px] overflow-y-auto max-h-[300px] dark-scrollbar border-t border-white/10">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-mono text-white/40 uppercase">Spec Blueprint Compliance</span>
            <span className="text-xs font-semibold text-white/90 font-display">
              ExecutionIdentityV1 Object
            </span>
          </div>
          <span className="text-[9px] font-mono text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/15">
            LAW 0 ENFORCED
          </span>
        </div>

        {simulatedData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] font-mono animate-fadeIn">
            {/* Column A */}
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col">
                <span className="text-[8px] text-white/30 uppercase">execution_id</span>
                <span className="text-white/80 break-all select-all">{simulatedData.execution_id}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-white/30 uppercase">pgl_pre_certificate_id</span>
                <span className="text-blue-400 break-all select-all font-semibold">
                  {simulatedData.pgl_pre_certificate_id}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-white/30 uppercase">genome_hash (Agent Configuration)</span>
                <span className="text-white/60 break-all select-all">{simulatedData.genome_hash}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-white/30 uppercase">constitution_hash</span>
                <span className="text-white/60 break-all select-all">{simulatedData.constitution_hash}</span>
              </div>
            </div>

            {/* Column B */}
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col">
                <span className="text-[8px] text-white/30 uppercase">seked_attestation_hash</span>
                <span className="text-white/60 break-all select-all">{simulatedData.seked_attestation_hash}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-white/30 uppercase">complying_directive_intent</span>
                <span className="text-amber-500 break-words line-clamp-2 italic leading-relaxed">
                  "{simulatedData.directive}"
                </span>
              </div>
              <div className="flex-row sm:flex items-center gap-4 pt-1">
                <div className="flex flex-col">
                  <span className="text-[8px] text-white/30 uppercase">budget_approved</span>
                  <span className="text-green-400 font-bold">
                    {selectedAgent ? `${(selectedAgent.stats.budgetCeiling / 100).toFixed(4)} USDC` : '0.0500 USDC'} Mode
                  </span>
                </div>
                <div className="flex flex-col mt-2 sm:mt-0">
                  <span className="text-[8px] text-white/30 uppercase">delegation_depth_limit</span>
                  <span className="text-white font-mono">
                    {selectedAgent ? `${selectedAgent.stats.delegationDepth} Levels` : '1 Level'} Max
                  </span>
                </div>
                <div className="flex flex-col mt-2 sm:mt-0">
                  <span className="text-[8px] text-white/30 uppercase font-bold">ttl_seconds</span>
                  <span className="text-white font-bold">
                    {selectedAgent ? `${selectedAgent.stats.executionTTL}s` : '30s'} window
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-3 text-white/20 select-none">
            <div className="flex flex-col items-center gap-1.5">
              <span className="material-symbols-outlined text-lg opacity-25">fingerprint</span>
              <span className="text-[9.5px] uppercase tracking-wider font-semibold font-mono">
                No active session execution token
              </span>
              <span className="text-[8px] text-white/15 max-w-xs leading-normal">
                Executing a target threat validation scenario generates an interactive immutable ExecutionIdentity v1 receipt token in line with CAPPO runtime specifications.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
