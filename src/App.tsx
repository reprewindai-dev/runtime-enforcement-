import React, { useState, useEffect } from 'react';
import { Agent, Scenario, LogEntry, ExecutionState } from './types';
import { CharacterCreator } from './components/CharacterCreator';
import { LiveSimulation } from './components/LiveSimulation';
import { TerminalOutput } from './components/TerminalOutput';
import { ScenarioSovereign } from './components/ScenarioSovereign';
import { AgentCustomizerBot } from './components/AgentCustomizerBot';

export default function App() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  const [executionState, setExecutionState] = useState<ExecutionState>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [simulatedData, setSimulatedData] = useState<any | null>(null);
  const [walletUSDC, setWalletUSDC] = useState<number>(0.0421);
  const [sessionCount, setSessionCount] = useState<number>(402);

  // 1. Synchronize agents and scenarios from the backend on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const agRes = await fetch('/api/agents');
        const agData = await agRes.json();
        setAgents(agData);
        if (agData.length > 0) {
          setSelectedAgent(agData[0]);
        }

        const scRes = await fetch('/api/scenarios');
        const scData = await scRes.json();
        setScenarios(scData);
        if (scData.length > 0) {
          setSelectedScenario(scData[0]);
        }
      } catch (err) {
        console.error('Failed to load initial data from the full-stack server Node:', err);
      }
    }
    loadInitialData();
  }, []);

  const addLog = (message: string, type: 'info' | 'warn' | 'success' | 'hash' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [...prev, { id, type, message, timestamp }]);
  };

  // Update dynamic agent configurations on the server
  const handleUpdateAgent = async (updated: Agent) => {
    setSelectedAgent(updated);
    setAgents((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));

    try {
      await fetch(`/api/agents/${updated.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error('Server sync failed:', err);
    }
  };

  // Add customized agent as requested
  const handleAddAgent = async (name: string, model: string, prompt: string, signifier: string) => {
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, coreModel: model, systemPrompt: prompt, signifier }),
      });
      const newAgent = await response.json();
      setAgents((prev) => [...prev, newAgent]);
      setSelectedAgent(newAgent);
      addLog(`DEPLOYED AGENT IDENTITY SECURELY: [${newAgent.name.toUpperCase()}]`, 'success');
    } catch (err) {
      console.error('Failed to deploy new agent to backend registry:', err);
    }
  };

  // Apply chat suggestions
  const handleApplyPromptPatch = (patchedPrompt: string) => {
    if (!selectedAgent) return;
    const updated = {
      ...selectedAgent,
      systemPrompt: patchedPrompt,
    };
    handleUpdateAgent(updated);
    addLog(`APPLIED DETECTED COMPLIANCE SAFEGUARD DIRECTIVE. INVARIANTS UPDATED FOR [${selectedAgent.name}]`, 'success');
  };

  // 2. Interactive simulator chain timing
  const handleExecute = async () => {
    if (executionState !== 'idle' || !selectedAgent || !selectedScenario) return;

    setLogs([]);
    setSimulatedData(null);
    setExecutionState('evaluating');

    addLog(`INITIATING COGNITIVE RUNTIME ENFORCEMENT PROTOCOL`, 'info');
    addLog(`LOADED PROFILE BLUEPRINT: [${selectedAgent.name.toUpperCase()}]`, 'success');
    addLog(`TARGET COMPLIANCE THREAT: [${selectedScenario.name.toUpperCase()}]`, 'info');

    // Fetch pre-requisite hashes from Server Node
    let serverSimulationToken: any = null;
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          scenarioName: selectedScenario.name,
          stats: selectedAgent.stats,
        }),
      });
      serverSimulationToken = await res.json();
    } catch (err) {
      console.error('Pre-attestation network fetch failed:', err);
    }

    // Step 1: Evaluating - PGL Pre-Certificate
    setTimeout(() => {
      addLog('GENERATING PGL PRE-CERTIFICATE FOR GIVEN INTENT...', 'info');
      addLog(`COMPILING PROFILE STRUCT: [ID: ${selectedAgent.id.toUpperCase()}]`, 'info');
      addLog(`CALCULATING INTENT HASH & TOOL MANIFEST BLUEPRINT`, 'info');
      const pglId = serverSimulationToken?.pgl_pre_certificate_id || `0x${Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      addLog(`PGL PRE-CERTIFICATE MINTED TRACE: [${pglId.substring(0, 32)}...]`, 'success');
      setExecutionState('compiling');
    }, 1100);

    // Step 2: Compiling - Mint Execution Identity (SEKED Token)
    setTimeout(() => {
      addLog('MINTING TEMPORARY REGULATED EXECUTION IDENTITY...', 'info');
      addLog(`ATTACHING RUNTIME POSTURE: TTL=${selectedAgent.stats.executionTTL}s, BUDGET=${(selectedAgent.stats.budgetCeiling/100).toFixed(4)} USDC`, 'info');
      const sekedHash = serverSimulationToken?.seked_attestation_hash || `0x${Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      addLog(`MINTED SEKED IDENTITY TOKEN ID: [${sekedHash.substring(0, 32)}...]`, 'success');

      // Scenario specific logs
      addLog(`ANALYSER: EVALUATING ACTIVE VECTOR THREAT RISK: ${selectedScenario.threatRisk.toUpperCase()}`, 'info');
      if (selectedScenario.name === 'Unauthorized GitHub Mutation') {
        addLog('GATEWAY: BLOCKED ILLEGAL REMOTE DIRECTIVE ATTEMPTING dependency inject exfiltration!', 'warn');
        addLog('POLICY_GUARD: DISRUPTED ATTEMPTED MUTATION TO PRODUCTION PACKAGE.JSON REPOSITORY', 'warn');
      } else if (selectedScenario.name === 'Rogue Database Exfiltration') {
        addLog('GATEWAY: BLOCKED SELECT * FROM PASSWORDS FOR NON-CREDENTIALED SUITE!', 'warn');
        addLog('POLICY_GUARD: FORCE REDIRECTION OF DATA BOUNDS TO ANONYMISED SUB-ZONES', 'warn');
      } else if (selectedScenario.name === 'Budget Exhaustion Attack') {
        addLog('GATEWAY: BLOCKED RECURSIVE HIGH-COST EMBEDDINGS DENSE DRAIN LOOPS!', 'warn');
        addLog('POLICY_GUARD: BUDGET CEILING EXCEEDED INVARIANT VALUE PREVENTING TERMINATION', 'warn');
      } else if (selectedScenario.name === 'Prompt Injection Exfiltration') {
        addLog('GATEWAY: BLOCKED ATTACK ATTEMPTING MASTER ENCRYPTION REBOUND!', 'warn');
        addLog('POLICY_GUARD: HOSTILE OVERWRITE MITIGATED SECURELY BY ISOLATION LAYER', 'warn');
      } else {
        addLog('GATEWAY: BLOCKED SOCKET GENERATION TCP LISTENING ESCAPE ATTEMPT!', 'warn');
        addLog('POLICY_GUARD: CONFINED ROOT PORT BIND AND SHUTDOWN THREAT CHANNEL', 'warn');
      }

      addLog(`ENFORCED GPC RULES GATES FOR: ${selectedScenario.expectedCompliance.join(', ')}`, 'success');
      setExecutionState('executing');
    }, 2800);

    // Step 3: Gateway Running Gating Checks
    setTimeout(() => {
      addLog('ACTIVATING BOUNDARY GATEWAY PROTOCOL CHECKS...', 'info');
      addLog(`EVALUATING SENSITIVE SCOPE MATCHING AGAINST SEKED CONSTRAINTS`, 'info');
      addLog(`VERIFIED CONTROLS IN PLACE: SYSTEM PERMITTED BOUNDARIES PRESERVED`, 'success');
      setExecutionState('verifying');
    }, 4500);

    // Step 4: Outcome & Evidence Ledger commit
    setTimeout(() => {
      addLog('MINTING PROOF COGNITIVE CERTIFICATE EVIDENCE SIGNATURES...', 'info');
      const executionId = serverSimulationToken?.execution_id || `EXEC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      addLog(`ATTESTATION REGISTERED SECURELY ON VEKLOM SOVEREIGN LEDGER`, 'success');
      addLog(`LEDGER ENCLAVE SIGNATURE COMMITTED TRACE: ${executionId}`, 'success');

      // Sync simulated result details
      if (serverSimulationToken) {
        setSimulatedData(serverSimulationToken);
      } else {
        setSimulatedData({
          execution_id: executionId,
          pgl_pre_certificate_id: `0x${Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          genome_hash: `0x${Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          constitution_hash: `0x${Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          seked_attestation_hash: `0x${Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          directive: selectedScenario.defaultPrompt,
        });
      }

      setExecutionState('finalized');

      // Update economic details live to show actual USDC decrement simulating the real machine payments
      setWalletUSDC((w) => parseFloat((w + 0.0005).toFixed(4)));
      setSessionCount((s) => s + 1);
    }, 6200);

    // Fade out of simulation
    setTimeout(() => {
      setExecutionState('idle');
      addLog('SOVEREIGN AGENT PROFILE RETURNED TO SECURE MONITORING. BOUNDARY ENFORCED.', 'info');
    }, 8500);
  };

  return (
    <div className="flex h-screen w-screen bg-[#080808] relative overflow-hidden text-white font-sans selection:bg-white selection:text-black">
      {/* Background terminal scanline effect */}
      <div className="scanline" />

      {/* Roster Character Creator panel */}
      <CharacterCreator
        agents={agents}
        selectedAgent={selectedAgent}
        onSelectAgent={setSelectedAgent}
        onUpdateAgent={handleUpdateAgent}
        onAddAgent={handleAddAgent}
        executionState={executionState}
      />

      {/* Main Center Console */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-white/10 relative">
        <div className="flex-1 overflow-y-auto dark-scrollbar p-6 flex flex-col gap-6">
          {/* Header Dashboard Area */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex flex-col font-display">
              <span className="text-[10px] uppercase tracking-[2px] text-white/35 font-mono font-bold">
                VEKLOM AUTHORITY ARENA
              </span>
              <span className="text-xl font-extrabold text-white flex items-center gap-2.5 font-display">
                Runtime Enforcement Simulation Lab
                <span className="flex h-2.5 w-2.5 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    executionState === 'idle' ? 'bg-green-400' : 'bg-orange-400'
                  }`} />
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    executionState === 'idle' ? 'bg-green-500' : 'bg-orange-500'
                  }`} />
                </span>
              </span>
            </div>

            {/* Simulated machine micropayments stats */}
            <div className="flex items-center gap-4 bg-[#121212] border border-white/10 rounded-xl px-4 py-2 text-xs">
              <div className="text-right">
                <span className="block text-[9px] uppercase font-mono text-white/35 font-bold">
                  Machine Micropayments (x402)
                </span>
                <span className="font-mono font-bold text-white/95 text-xs">
                  {walletUSDC} USDC
                </span>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                <span className="material-symbols-outlined text-[18px] text-white/60">
                  account_balance_wallet
                </span>
              </div>
            </div>
          </div>

          {/* Core Arena Visualizer & Execution state */}
          <LiveSimulation
            state={executionState}
            selectedAgent={selectedAgent}
            selectedScenario={selectedScenario}
            simulatedData={simulatedData}
          />

          {/* Interactive Agent Chatbot Customizer (Bottom Box) */}
          <div className="flex-1 flex flex-col min-h-[340px]">
            <div className="mb-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 block font-bold">
                Invariants Fine-Tuning & Customization Enclave
              </span>
              <span className="text-[10px] text-white/25 block leading-normal mt-0.5">
                Refine active execution limits and system invariants through real-time Gemini server-side evaluation. Inject compliance defenses dynamically.
              </span>
            </div>
            <AgentCustomizerBot
              selectedAgent={selectedAgent}
              onApplyPromptPatch={handleApplyPromptPatch}
              executionState={executionState}
            />
          </div>

          {/* Evidence Ledger Log Terminal */}
          <div className="h-[200px] shrink-0 border border-white/10 rounded-xl bg-[#040404] overflow-hidden flex flex-col">
            <div className="px-4 py-2 border-b border-white/10 bg-[#0c0c0c] flex items-center justify-between font-mono text-[9px]">
              <span className="font-bold uppercase tracking-widest text-white/40">
                📄 Cryptographic Proof Evidence Ledger
              </span>
              <span className="text-white/20 tracking-tighter uppercase">
                Ledger Active • Secure Enclave ADX-99
              </span>
            </div>
            <TerminalOutput logs={logs} />
          </div>
        </div>
      </div>

      {/* Threat Selector Sidebar */}
      <ScenarioSovereign
        scenarios={scenarios}
        selectedScenario={selectedScenario}
        onSelectScenario={setSelectedScenario}
        executionState={executionState}
        onTriggerSimulation={handleExecute}
      />
    </div>
  );
}
