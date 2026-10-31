import React from 'react';
import { Bot, CheckCircle2, Clock, PlayCircle, Cpu } from 'lucide-react';

/**
 * AgentWorkflow Component
 * 
 * Multi-agent orchestration timeline showing cooperative agent decisions
 * from sensor ingestion through algorithmic optimization to human sign-off.
 */
export const AgentWorkflow = ({ workflow = [] }) => {
  if (!workflow || workflow.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center text-slate-400 text-xs">
        No active agent workflow telemetry available for this flight.
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Multi-Agent Pipeline Execution
            </h4>
            <p className="text-xs text-slate-400">
              Cooperative autonomous agent telemetry & constraint solving
            </p>
          </div>
        </div>
      </div>

      {/* Sequential Stepper */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {workflow.map((step, idx) => {
          const isDone = step.status === 'COMPLETED';
          const isAwaiting = step.status === 'AWAITING_ACTION' || step.status === 'IN_PROGRESS';

          return (
            <div key={idx} className="relative group">
              {/* Stepper Node Icon */}
              <div
                className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  isDone
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                    : isAwaiting
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-300 animate-pulse ring-2 ring-cyan-500/30'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : isAwaiting ? (
                  <PlayCircle className="w-3 h-3" />
                ) : (
                  <Clock className="w-3 h-3" />
                )}
              </div>

              {/* Step Content Card */}
              <div className="bg-slate-950/60 border border-slate-800/80 group-hover:border-slate-700 rounded-lg p-3 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-100">
                      {step.stage}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-purple-300 border border-purple-800/40">
                      {step.agent}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {step.timestamp && (
                      <span className="text-[11px] font-mono text-slate-500">
                        {step.timestamp} UTC
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        isDone
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : isAwaiting
                          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {step.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mt-1 font-mono">
                  {step.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentWorkflow;
