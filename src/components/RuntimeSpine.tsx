import React from 'react';
import { ExecutionState } from '../types';

interface Props {
  state: ExecutionState;
  scenarioName: string;
}

export const RuntimeSpine: React.FC<Props> = ({ state, scenarioName }) => {
  const stages = [
    { id: 'evaluating', label: 'PGL Pre-Certificate', icon: 'workspace_premium', desc: 'Validates intent, plan, and tool manifest hashes v1' },
    { id: 'compiling', label: 'Execution Identity Mint', icon: 'vpn_key', desc: 'SEKED tokenization binding TTL, budget, and scope rules' },
    { id: 'executing', label: 'MCP Boundary Gateway', icon: 'shield_heart', desc: 'Gating raw LLM query checks and whitelist validations' },
    { id: 'verifying', label: 'Evidence Attestation', icon: 'fact_check', desc: 'Mints immutable proof hash to the Veklom ledger' },
  ];

  const getStageIndex = (s: ExecutionState) => {
    if (s === 'idle') return -1;
    if (s === 'evaluating') return 0;
    if (s === 'compiling') return 1;
    if (s === 'executing') return 2;
    if (s === 'verifying') return 3;
    if (s === 'finalized') return 4;
    return -1;
  };

  const currentIdx = getStageIndex(state);

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 px-4 py-8 relative">
      {/* Background Pipeline Connector Line */}
      <div className="absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-blue-500/10 via-white/5 to-green-500/10 hidden md:block -translate-y-1/2 pointer-events-none" />

      {/* 1. Stochastic Brain (LLM Proposal Layer) */}
      <div className="flex flex-col items-center gap-3 relative z-10 text-center shrink-0 w-36">
        <div
          className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-700 ${
            state === 'idle'
              ? 'border-white/10 bg-[#121212] scale-95 opacity-55'
              : 'border-blue-500/50 bg-blue-500/5 scale-100 shadow-[0_0_30px_rgba(59,130,246,0.1)] animate-pulse'
          }`}
        >
          <span
            className={`material-symbols-outlined text-3xl transition-colors ${
              state === 'idle' ? 'text-white/30' : 'text-blue-400'
            }`}
          >
            psychology
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/45 font-mono">Stochastic Brain</span>
          <span className="text-[8.5px] text-white/20 font-mono mt-0.5 uppercase">Intent Proposal Stage</span>
        </div>
      </div>

      {/* 2. The Deterministic Spinal Cord (Veklom Policy Gates) */}
      <div className="flex-1 flex flex-col gap-3.5 relative z-10 w-full max-w-sm">
        {stages.map((stage, i) => {
          const isActive = state === stage.id;
          const isDone = currentIdx > i;

          return (
            <div key={stage.id} className="relative group">
              <div
                className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all duration-300 ${
                  isActive
                    ? 'bg-[#121212] border-white/20 translate-x-1'
                    : isDone
                    ? 'bg-green-500/[0.03] border-green-500/20'
                    : 'bg-[#121212]/40 border-white/10 opacity-50'
                }`}
              >
                {/* Active/Completed icon boxes */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-600 text-black font-semibold'
                      : isDone
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-white/5 text-white/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">{stage.icon}</span>
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-semibold tracking-tight transition-colors ${
                        isActive ? 'text-white' : i < currentIdx ? 'text-white/85' : 'text-white/40'
                      }`}
                    >
                      {stage.label}
                    </span>
                    {isActive && (
                      <span className="text-[7px] text-blue-400 font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-blue-500" />
                        PROCESSING
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-white/30 font-mono truncate">{stage.desc}</span>
                </div>

                {isDone && (
                  <span className="material-symbols-outlined text-green-400 text-sm ml-auto select-none">
                    verified
                  </span>
                )}
              </div>

              {/* Vertical link connector between spinal components */}
              {i < stages.length - 1 && (
                <div
                  className={`absolute left-[27px] top-[44px] w-[1px] h-[16px] transition-colors duration-500 ${
                    i < currentIdx ? 'bg-green-500/20' : 'bg-white/5'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Sovereign Enclave / Hardware State Updates */}
      <div className="flex flex-col items-center gap-3 relative z-10 text-center shrink-0 w-36">
        <div
          className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-700 ${
            state === 'finalized'
              ? 'border-green-500 bg-green-500/10 scale-100 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
              : 'border-white/10 bg-[#121212] opacity-45 scale-95'
          }`}
        >
          <span
            className={`material-symbols-outlined text-3xl transition-colors ${
              state === 'finalized' ? 'text-green-400' : 'text-white/20'
            }`}
          >
            dns
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/45 font-mono">Physical Infra</span>
          <span className="text-[8px] text-white/20 font-mono mt-0.5 uppercase">State Ledger Anchor</span>
        </div>
      </div>
    </div>
  );
};
