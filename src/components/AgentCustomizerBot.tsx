import React, { useState, useRef, useEffect } from 'react';
import { Agent, ChatMessage } from '../types';

interface Props {
  selectedAgent: Agent | null;
  onApplyPromptPatch: (newPrompt: string) => void;
  executionState: string;
}

export const AgentCustomizerBot: React.FC<Props> = ({
  selectedAgent,
  onApplyPromptPatch,
  executionState,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Restart chat when agent switches, pre-seeding an agent intro message
  useEffect(() => {
    if (selectedAgent) {
      setMessages([
        {
          id: 'welcome',
          sender: 'agent',
          text: `[PORT ${selectedAgent.id.toUpperCase()} ONLINE] Hello. I am your Veklom Customization assistant for "${selectedAgent.name}". Direct me to tighten my invariants, attach SOC2/PCI compliance checks, or configure economic budget limits.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } else {
      setMessages([]);
    }
  }, [selectedAgent]);

  // Handle scrolling
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || !selectedAgent || loading) return;

    const userMsg: ChatMessage = {
      id: `m-${Math.random().toString(36).substring(2, 9)}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    try {
      const response = await fetch(`/api/agents/${selectedAgent.id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: messages.map((m) => ({ role: m.sender === 'user' ? 'user' : 'model', text: m.text })),
        }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `m-${Math.random().toString(36).substring(2, 9)}`,
        sender: 'agent',
        text: data.reply || '[ERROR] Unable to sync with Veklom Spine.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `m-${Math.random().toString(36).substring(2, 9)}`,
        sender: 'agent',
        text: `[NODE EMERGENCY BACKUP] Communication delay. Safeguard recommendation: prepend "ENFORCE MANDATORY SOC2 DEPLOYMENT CHECKS" to protect remote node against exfiltration vectors.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPatch = (msgText: string) => {
    const matchMarker = '[UPDATED PROMPT DIRECTIVE]';
    const index = msgText.indexOf(matchMarker);
    if (index !== -1) {
      const patchedText = msgText.substring(index + matchMarker.length).trim();
      onApplyPromptPatch(patchedText);
    }
  };

  const containsDirective = (msgText: string) => {
    return msgText.includes('[UPDATED PROMPT DIRECTIVE]');
  };

  const promptSuggestions = [
    'Enforce ISO-27001 SQL filters',
    'Cap x402 budget to 0.05 USDC',
    'Enable Secure Enclave isolation rules',
    'Verify SHA-256 certificate proof',
  ];

  if (!selectedAgent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-white/30 border border-white/10 rounded-2xl bg-[#040404]">
        <span className="material-symbols-outlined text-4xl opacity-35 mb-2.5 animate-pulse">
          forum
        </span>
        <span className="text-xs font-semibold tracking-wide uppercase font-display">No Profile Selected</span>
        <span className="text-[10px] text-white/20 mt-1 max-w-xs font-mono">
          Select or configure a registered profile from the left builder to customize its invariants and fine-tune directives.
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col border border-white/10 rounded-2xl bg-[#080808] overflow-hidden min-h-[300px]">
      {/* Head */}
      <div className="px-4 py-3 border-b border-white/10 bg-[#0c0c0c] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-mono tracking-wider font-bold text-white/60">
            SECURE CONVERSATION CANAL — COGNITIVE FEEDBACK
          </span>
        </div>
        <span className="text-[10px] font-mono text-white/25">GPC INTEGRATOR</span>
      </div>

      {/* Main chat window */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto dark-scrollbar p-4 flex flex-col gap-4">
        {messages.map((m) => {
          const isAgent = m.sender === 'agent';
          return (
            <div
              key={m.id}
              className={`flex flex-col max-w-[85%] ${isAgent ? 'self-start' : 'self-end'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[9px] font-mono font-medium text-white/40">
                <span>{isAgent ? `SYSTEM (${selectedAgent.name})` : 'OPERATOR'}</span>
                <span>•</span>
                <span>{m.timestamp}</span>
              </div>
              <div
                className={`p-3 rounded-xl border text-xs leading-relaxed break-words font-mono ${
                  isAgent
                    ? 'bg-[#121212] border-white/10 text-white/85 shadow-sm'
                    : 'bg-white text-black border-white font-bold shadow-md shadow-white/[0.02]'
                }`}
              >
                {/* Parse out updated directives and make them pretty */}
                {containsDirective(m.text) ? (
                  <div className="flex flex-col gap-3">
                    <p className="whitespace-pre-line text-[11px] text-white/80">
                      {m.text.split('[UPDATED PROMPT DIRECTIVE]')[0].trim()}
                    </p>
                    <div className="bg-[#040404] border border-blue-500/25 rounded-lg p-2.5 flex flex-col gap-2">
                      <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest block font-mono">
                        ⚙️ Compiled Safeguard Prompt Directive
                      </span>
                      <p className="text-[10px] font-mono text-white/70 italic leading-snug">
                        "{m.text.split('[UPDATED PROMPT DIRECTIVE]')[1].trim()}"
                      </p>
                      <button
                        onClick={() => handleApplyPatch(m.text)}
                        className="mt-1 bg-blue-500 text-white hover:bg-blue-600 border border-blue-400/20 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
                      >
                        ⚡ Apply Compliance Patch to Profile Invariants
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-line leading-relaxed text-[11px]">{m.text}</p>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex flex-col self-start max-w-[50%] animate-pulse">
            <span className="text-[9px] font-mono font-medium text-white/40 px-1 mb-1">
              SOVEREIGN ENCLAVE RESOLVING...
            </span>
            <div className="bg-[#121212] border border-white/10 p-3 rounded-xl text-xs font-mono text-white/40">
              <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce mr-1" />
              <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce mr-1 [animation-delay:0.2s]" />
              <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* Suggested prompts panel */}
      {messages.length <= 2 && !loading && (
        <div className="px-4 py-2 border-t border-white/10 bg-[#0c0c0c]/40">
          <span className="text-[8.5px] uppercase font-mono tracking-wider font-bold text-white/30 block mb-1.5">
            Suggested Safeguard Directives:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {promptSuggestions.map((sug) => (
              <button
                key={sug}
                onClick={() => handleSend(sug)}
                className="text-[9px] font-mono text-white/60 hover:text-white border border-white/10 bg-white/[0.01] px-2.5 py-1.5 rounded-lg cursor-pointer transition-all hover:bg-white/5"
              >
                + {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input section */}
      <div className="p-3 border-t border-white/10 bg-[#0c0c0c] flex gap-2">
        <input
          type="text"
          placeholder={`Instruct "${selectedAgent.name}"...`}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend(inputVal);
          }}
          className="flex-1 bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/20 font-mono"
        />
        <button
          onClick={() => handleSend(inputVal)}
          disabled={!inputVal.trim() || loading}
          className="bg-white hover:bg-gray-100 border border-white font-mono text-black px-4.5 py-2.5 rounded-xl font-bold uppercase transition-all text-[11px] flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-[16px]">send</span>
          <span>Inject</span>
        </button>
      </div>
    </div>
  );
};
