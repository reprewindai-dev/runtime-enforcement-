import React, { useState } from 'react';
import { Agent, AgentStats } from '../types';

interface Props {
  agents: Agent[];
  selectedAgent: Agent | null;
  onSelectAgent: (agent: Agent) => void;
  onUpdateAgent: (agent: Agent) => void;
  onAddAgent: (name: string, model: string, prompt: string, signifier: string) => void;
  executionState: string;
}

export const CharacterCreator: React.FC<Props> = ({
  agents,
  selectedAgent,
  onSelectAgent,
  onUpdateAgent,
  onAddAgent,
  executionState,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newModel, setNewModel] = useState('Frontier-3.5-Turbo');
  const [newPrompt, setNewPrompt] = useState('');
  const [newSignifier, setNewSignifier] = useState('gavel');

  const updateStat = (key: keyof AgentStats, val: number) => {
    if (!selectedAgent || executionState !== 'idle') return;
    const updated = {
      ...selectedAgent,
      stats: {
        ...selectedAgent.stats,
        [key]: val,
      },
    };
    onUpdateAgent(updated);
  };

  const handleUpdatePrompt = (val: string) => {
    if (!selectedAgent || executionState !== 'idle') return;
    const updated = {
      ...selectedAgent,
      systemPrompt: val,
    };
    onUpdateAgent(updated);
  };

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrompt.trim()) return;
    onAddAgent(newName, newModel, newPrompt, newSignifier);
    setNewName('');
    setNewPrompt('');
    setIsAdding(false);
  };

  const signifierOptions = [
    { value: 'gavel', label: 'Governed Gavel', desc: 'Pre-eval Pro' },
    { value: 'shield', label: 'Shield Aegis', desc: 'Secure Agent' },
    { value: 'account_balance_wallet', label: 'Coin Wallet', desc: 'x402 Micropayments' },
    { value: 'admin_panel_settings', label: 'Sentinel Root', desc: 'Key-lock isolation' },
    { value: 'terminal', label: 'Core Terminal', desc: 'Physical Spine' },
  ];

  const getPostCheckLabel = (key: string) => {
    switch (key) {
      case 'autonomyLevel': return { label: 'Autonomy Level', unit: '%' };
      case 'toolAccess': return { label: 'Tool Access Posture', unit: '%' };
      case 'dataSensitivity': return { label: 'Data Sensitivity Scope', unit: '%' };
      case 'budgetCeiling': return { label: 'Budget Limit (Cents)', unit: '¢' };
      case 'delegationDepth': return { label: 'Delegation Depth Limit', unit: ' Levels' };
      case 'riskTolerance': return { label: 'Risk Tolerance Threshold', unit: '%' };
      case 'executionTTL': return { label: 'Execution TTL Window', unit: 's' };
      default: return { label: key, unit: '%' };
    }
  };

  return (
    <div className="w-[280px] shrink-0 border-r border-white/10 bg-[#0a0a0a] flex flex-col h-full overflow-hidden">
      {/* Roster Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0c0c0c]">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono font-bold">Authority Profiles</span>
          <span className="text-xs font-bold tracking-wider text-white uppercase font-display">Execution Profile Builder</span>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          disabled={executionState !== 'idle'}
          className="text-[9px] font-mono tracking-tight uppercase px-2 py-1 rounded border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-xs">add</span>
          <span>Register</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto dark-scrollbar p-5 flex flex-col gap-6">
        {isAdding ? (
          /* Create New Agent Form */
          <form onSubmit={handleSubmitNew} className="flex flex-col gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/10 animate-fadeIn text-xs">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="font-bold text-white uppercase tracking-wider font-display text-[10px]">Register Sandbox Profile</span>
              <button
                type="button"
                className="text-white/40 hover:text-white"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-mono text-white/40 font-bold tracking-widest">Profile Name</label>
              <input
                type="text"
                placeholder="e.g. Finance Vault Certifier"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-[#121212] border border-white/10 rounded-lg px-2.5 py-2 text-white placeholder-white/20 focus:outline-none focus:border-white/20 text-xs"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-mono text-white/40 font-bold tracking-widest">Base Runtime LLM</label>
              <select
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
                className="bg-[#121212] border border-white/10 rounded-lg px-2.5 py-2 text-white focus:outline-none text-xs cursor-pointer"
              >
                <option>gemini-3.5-flash (Standard)</option>
                <option>Llama 3 70B (Sovereign Dual)</option>
                <option>Mixtral-8x22B (Governed)</option>
                <option>Ollama Local Node (Custom)</option>
                <option>OpenAI GPT-4o-Sovereign</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-mono text-white/40 font-bold tracking-widest">Profile Signifier</label>
              <div className="grid grid-cols-5 gap-2">
                {signifierOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setNewSignifier(opt.value)}
                    title={opt.label}
                    className={`h-9 rounded-lg border flex items-center justify-center transition-all ${
                      newSignifier === opt.value
                        ? 'bg-white text-black border-white shadow-md'
                        : 'bg-[#121212] border-white/5 text-white/60 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">{opt.value}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-mono text-white/40 font-bold tracking-widest">Initial System Invariant</label>
              <textarea
                placeholder="e.g. REJECT ANY TRANSACTION ATTEMPT EXCEEDING COEF DEVIATION..."
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                rows={3}
                className="bg-[#121212] border border-white/10 rounded-lg px-2.5 py-2 text-white placeholder-white/20 focus:outline-none focus:border-white/20 font-mono text-[10px] leading-relaxed resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black font-bold uppercase tracking-widest py-2.5 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-[10px]"
            >
              REGISTER PROFILE
            </button>
          </form>
        ) : (
          /* Agent Badges Selection */
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono font-bold">Authority Profiles</span>
            <div className="flex flex-col gap-2">
              {agents.map((agent) => {
                const isSelected = selectedAgent?.id === agent.id;
                return (
                  <div
                    key={agent.id}
                    onClick={() => {
                      if (executionState === 'idle') onSelectAgent(agent);
                    }}
                    className={`p-3.5 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#121212] border-white/20 shadow-lg'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* Corner gradient for selected card */}
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none rounded-tr-xl" />
                    )}

                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-black border-blue-500 font-bold'
                            : 'bg-white/5 text-white/75 border-white/10'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">{agent.signifier}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-white/90 truncate font-display">{agent.name}</span>
                        <span className="text-[10px] font-mono text-white/40 truncate">{agent.coreModel}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/5 text-[9px] font-mono text-white/40">
                      <span>ID: {agent.id.toUpperCase()}</span>
                      <span className="flex items-center gap-1 select-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        ACTIVE
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedAgent && !isAdding && (
          /* Active Agent configuration detail */
          <div className="flex flex-col gap-6 animate-fadeIn">
            {/* Visual avatar slot like in theme */}
            <div className="space-y-4">
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Active Profile Identity</p>
              <div className="w-full aspect-square rounded-xl border border-white/10 bg-[#121212] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#3b82f6_1px,_transparent_1px)] bg-[size:16px_16px]" />
                <div className="text-4xl text-white/85">
                  <span className="material-symbols-outlined text-[64px]">{selectedAgent.signifier}</span>
                </div>
                <div className="absolute bottom-3 text-[10px] font-mono text-white/20">VERIFIED ID: {selectedAgent.id.toUpperCase()}</div>
              </div>
            </div>

            {/* Skill sliders */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono font-bold">Runtime Posture matrix</span>
              <div className="flex flex-col gap-4 bg-[#121212]/40 p-4 rounded-xl border border-white/10">
                {Object.entries(selectedAgent.stats).map(([key, value]) => {
                  const check = getPostCheckLabel(key);
                  return (
                    <div key={key} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-white/60 capitalize font-medium">{check.label}</span>
                        <span className="text-blue-400 font-bold">{value}{check.unit}</span>
                      </div>

                      {/* Styled Range Slider */}
                      <div className="relative flex items-center">
                        <input
                          type="range"
                          min="1"
                          max="100"
                          value={value}
                          disabled={executionState !== 'idle'}
                          onChange={(e) => updateStat(key as keyof AgentStats, parseInt(e.target.value))}
                          className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500 transition-opacity disabled:opacity-50"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Directive config */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono font-bold">System Invariants</span>
              <div className="bg-[#121212] p-3.5 rounded-xl border border-white/10 flex flex-col gap-2">
                <span className="text-[8px] tracking-wider uppercase font-mono text-white/30 font-bold">Secure Directive System Prompt</span>
                <textarea
                  value={selectedAgent.systemPrompt}
                  disabled={executionState !== 'idle'}
                  onChange={(e) => handleUpdatePrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-[#080808] border border-white/5 rounded-lg px-2.5 py-2 font-mono text-[10px] leading-relaxed text-white/90 placeholder-white/30 focus:outline-none focus:border-white/20 resize-none disabled:opacity-75"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Model Core Footer */}
      {selectedAgent && !isAdding && (
        <div className="p-4 border-t border-white/10 bg-[#0c0c0c] flex flex-col gap-2">
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1.5">
            <p className="text-[9px] text-white/40 uppercase font-bold tracking-widest">Runtime Mode</p>
            <p className="text-xs text-white/90 font-medium">Deterministic Spinal (η)</p>
            <p className="text-[9px] text-white/30 italic leading-tight">Governed by Obfuscation Membrane Protocol Law 0.</p>
          </div>
        </div>
      )}
    </div>
  );
};
