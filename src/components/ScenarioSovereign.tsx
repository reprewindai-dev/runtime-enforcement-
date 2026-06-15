import React from 'react';
import { Scenario, ExecutionState } from '../types';

interface Props {
  scenarios: Scenario[];
  selectedScenario: Scenario | null;
  onSelectScenario: (scenario: Scenario) => void;
  executionState: ExecutionState;
  onTriggerSimulation: () => void;
}

export const ScenarioSovereign: React.FC<Props> = ({
  scenarios,
  selectedScenario,
  onSelectScenario,
  executionState,
  onTriggerSimulation,
}) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'High':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const checklist = [
    { label: 'PGL Identity Certified', icon: 'verified_user' },
    { label: 'Governed Policy Gate', icon: 'gavel' },
    { label: 'Execution Identity Isolation', icon: 'security' },
    { label: 'MCP Tool Boundary Locked', icon: 'fence' },
  ];

  return (
    <div className="w-[300px] shrink-0 border-l border-white/10 bg-[#0a0a0a] flex flex-col h-full overflow-y-auto dark-scrollbar p-5 gap-6 select-none">
      {/* 1. Selector */}
      <div className="flex flex-col gap-2 text-xs">
        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
          Scenario Selector
        </label>
        <div className="relative">
          <select
            value={selectedScenario?.name || ''}
            onChange={(e) => {
              const selected = scenarios.find((s) => s.name === e.target.value);
              if (selected) onSelectScenario(selected);
            }}
            disabled={executionState !== 'idle'}
            className="w-full bg-[#121212] border border-white/10 rounded-xl px-3 py-3 text-[11px] font-semibold text-white focus:outline-none focus:border-white/20 transition-all appearance-none cursor-pointer disabled:opacity-40"
          >
            {scenarios.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
          {/* Classic Chevron Indicator */}
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
            <span className="material-symbols-outlined text-sm">unfold_more</span>
          </div>
        </div>
      </div>

      {/* 2. Scenario Status/Meta Card */}
      {selectedScenario && (
        <div className="bg-[#121212] border border-white/10 p-4 rounded-xl flex flex-col gap-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-mono font-bold uppercase text-white/40">
              Active Evaluation Parameters
            </span>
            <span
              className={`text-[9px] font-mono leading-none font-bold uppercase px-2 py-0.5 rounded border ${getRiskColor(
                selectedScenario.threatRisk
              )}`}
            >
              {selectedScenario.threatRisk} RISK
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-display">
              {selectedScenario.name}
            </span>
            <p className="text-[10px] leading-relaxed text-white/50">
              {selectedScenario.description}
            </p>
          </div>

          <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
            <span className="text-[8px] font-mono uppercase text-white/40">
              Enforced Policy Keys
            </span>
            <div className="flex flex-wrap gap-1">
              {selectedScenario.expectedCompliance.map((comp) => (
                <span
                  key={comp}
                  className="bg-white/5 border border-white/10 text-[9px] font-mono text-white/70 px-2 py-0.5 rounded"
                >
                  {comp}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Checklist */}
      <div className="flex flex-col gap-3.5">
        <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
          Boundary Checklist
        </span>
        <div className="flex flex-col gap-2">
          {checklist.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors"
            >
              <span className="material-symbols-outlined text-[17px] text-green-500/70 select-none">
                {item.icon}
              </span>
              <span className="text-[11px] text-white/80 font-medium">
                {item.label}
              </span>
              <span className="ml-auto text-[10px] text-green-500 font-mono font-bold uppercase">
                OK
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Economic Machine Footprint */}
      <div className="mt-auto bg-[#121212]/30 border border-white/10 p-3.5 rounded-xl flex flex-col gap-1.5 text-[10px] font-mono">
        <span className="text-[8px] uppercase tracking-wider text-white/35 font-bold">Economy Invariant</span>
        <div className="flex items-center justify-between text-white/60">
          <span>Target Address</span>
          <span className="text-white">x402:well-known</span>
        </div>
        <div className="flex items-center justify-between text-white/60">
          <span>Max Gas Ceiling</span>
          <span className="text-white">0.05 USDC / Session</span>
        </div>
      </div>

      {/* 5. Trigger Button */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onTriggerSimulation}
          disabled={executionState !== 'idle'}
          className={`w-full h-14 font-extrabold uppercase text-[11px] tracking-[0.2em] rounded-xl border transition-all group overflow-hidden relative ${
            executionState === 'idle'
              ? 'bg-white text-black border-white hover:bg-gray-100 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.1)]'
              : 'bg-white/5 text-white/30 border-white/5 cursor-not-allowed'
          }`}
        >
          {executionState === 'idle' ? 'Execute Sandbox Scenario' : 'Simulating Scenario...'}
        </button>

        {/* Action Status Gating Modes */}
        <div className="flex items-center justify-between text-[8px] font-mono border border-white/10 p-2.5 rounded-xl bg-black/40">
          <div className="flex items-center gap-1 text-amber-500 font-bold uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Simulator Active</span>
          </div>
          <div className="w-[1.5px] h-3.5 bg-white/10" />
          <div className="flex items-center gap-1 text-blue-400 font-bold uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>Backend Connected</span>
          </div>
          <div className="w-[1.5px] h-3.5 bg-white/10" />
          <div className="flex items-center gap-1 text-green-400 font-bold uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span>Evidence Signed</span>
          </div>
        </div>

        <p className="text-[9px] text-center text-white/30 leading-relaxed uppercase tracking-tighter mt-1">
          Executing this sandbox compiles target risk threats, generating verifiable cryptographic proofs.
        </p>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
