export interface AgentStats {
  autonomyLevel: number;      // range 0-100 (represented or mapping to actual levels)
  toolAccess: number;         // range 0-100
  dataSensitivity: number;    // range 0-100
  budgetCeiling: number;      // range 0-100 / cents max
  delegationDepth: number;    // range 0-100 / maximum depth
  riskTolerance: number;      // range 0-100
  executionTTL: number;       // range 0-100 seconds
}

export interface Agent {
  id: string;
  name: string;
  signifier: string; // Material symbol icon
  coreModel: string;
  authorityRuntime: string;
  stats: AgentStats;
  systemPrompt: string;
  tags: string[];
}

export type ExecutionState =
  | 'idle'
  | 'evaluating'  // PGL & Intent evaluation
  | 'compiling'   // GPC policy gate compilation
  | 'executing'   // Sovereign network routing
  | 'verifying'   // Evidence seal generation
  | 'finalized';

export interface LogEntry {
  id: string;
  type: 'info' | 'warn' | 'success' | 'hash';
  message: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export interface Scenario {
  name: string;
  icon: string;
  description: string;
  threatRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  expectedCompliance: string[]; // SOC2, HIPAA, PCI-DSS, GDPR
  defaultPrompt: string;
}
