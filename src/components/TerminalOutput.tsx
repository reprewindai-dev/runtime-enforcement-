import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';

interface Props {
  logs: LogEntry[];
}

export const TerminalOutput: React.FC<Props> = ({ logs }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new logs arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto dark-scrollbar p-4 font-mono text-[10px] md:text-[11px] leading-relaxed flex flex-col gap-1.5 bg-[#040404]"
    >
      {logs.length === 0 ? (
        <div className="text-white/10 flex items-center justify-center h-full flex-col gap-2.5">
          <span className="material-symbols-outlined text-3xl opacity-20 animate-pulse">
            terminal
          </span>
          <span className="uppercase tracking-[2px] text-[10px] font-semibold text-white/35">
            Waiting for simulation trigger...
          </span>
          <span className="text-[9px] text-white/20 text-center max-w-xs font-mono">
            Hit 'Test Runtime Enforcement' (or choose another scenario first) to deploy execution evaluation checks.
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex gap-3 group animate-in fade-in slide-in-from-bottom-1 duration-200"
            >
              <span className="text-white/25 shrink-0 select-none">[{log.timestamp}]</span>
              <span
                className={`flex-1 break-all select-all font-mono ${
                  log.type === 'info'
                    ? 'text-white/60'
                    : log.type === 'warn'
                    ? 'text-amber-500 font-semibold'
                    : log.type === 'success'
                    ? 'text-green-400 font-medium'
                    : 'text-blue-400 font-semibold'
                }`}
              >
                {log.type === 'hash' && (
                  <span className="mr-1.5 px-1 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold font-mono text-[9px]">
                    SHA-256 PROOF
                  </span>
                )}
                {log.type === 'warn' && <span className="mr-1">⚠️</span>}
                {log.type === 'success' && <span className="mr-1">✓</span>}
                {log.message}
              </span>
            </div>
          ))}
          <div className="h-2" />
        </div>
      )}
    </div>
  );
};
