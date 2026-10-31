import React from 'react';
import { GitCommit, ArrowDownRight, Users, Clock, AlertCircle, ShieldCheck, UserCheck } from 'lucide-react';

/**
 * FlightDependency Component
 * 
 * Maps inbound airframe turnaround buffers, crew handoffs, and downstream
 * connecting flights. Prevents network delay propagation.
 */
export const FlightDependency = ({ dependencies }) => {
  if (!dependencies) {
    return (
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center text-slate-400 text-xs">
        No active dependency graph for this flight.
      </div>
    );
  }

  const {
    inboundFlight,
    turnaroundMinutes = 0,
    turnaroundStatus = '',
    connectingPassengers = 0,
    connectingFlights = [],
    crewHandoff = ''
  } = dependencies;

  return (
    <div className="space-y-4">
      {/* Inbound Airframe & Turnaround Buffer */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Inbound Aircraft Turnaround
            </h4>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
            {turnaroundMinutes} min turn
          </span>
        </div>

        <div className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-medium">Inbound Leg: </span>
            <span className="font-semibold text-slate-200 font-mono">{inboundFlight}</span>
          </div>
          {turnaroundStatus && (
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
              turnaroundStatus.toLowerCase().includes('tight') || turnaroundStatus.toLowerCase().includes('delay')
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
            }`}>
              {turnaroundStatus}
            </span>
          )}
        </div>
      </div>

      {/* Downstream Connecting Flights Table */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Downstream Passenger Transfers ({connectingPassengers} Total Pax)
            </h4>
          </div>
        </div>

        {connectingFlights.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-2">
            No onward transfer connections tracked.
          </div>
        ) : (
          <div className="space-y-2">
            {connectingFlights.map((cf, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/70 text-xs"
              >
                <div className="flex items-center gap-2">
                  <ArrowDownRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono font-semibold text-white">{cf.flight}</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-slate-300 font-mono">
                    <span className="font-bold text-white">{cf.passengers}</span> pax
                  </span>

                  <span className="text-slate-400 font-mono text-[11px]">
                    Window: {cf.scheduledConnectWindow}
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono border ${
                    cf.status === 'CRITICAL_RISK'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : cf.status === 'HIGH_RISK'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {cf.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Crew Availability and Handoff Alert */}
      {crewHandoff && (
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-0.5">
              Crew Legality & Station Standby Assets
            </div>
            <p className="text-xs text-slate-300">
              {crewHandoff}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightDependency;
