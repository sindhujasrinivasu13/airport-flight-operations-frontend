import React from 'react';
import { Activity, AlertTriangle, Clock, CheckCircle2, DollarSign, Radio, Compass } from 'lucide-react';

/**
 * OperationalPulse Component
 * 
 * High-level executive pulse bar summarizing network health,
 * active disruption counts, financial exposure avoided, and hub conditions.
 */
export const OperationalPulse = ({
  pulseData,
  isLiveApi = false,
  lastUpdated = new Date()
}) => {
  const data = pulseData || {
    totalMonitoredFlights: 0,
    criticalRiskFlights: 0,
    highRiskFlights: 0,
    onTimePercentage: 0,
    networkAverageDelayMinutes: 0,
    activeDisruptions: 0,
    proactiveSavingsEst: '$0',
    hubStatus: {}
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-md">
      {/* Top status bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLiveApi ? 'bg-emerald-400' : 'bg-cyan-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveApi ? 'bg-emerald-500' : 'bg-cyan-500'}`}></span>
            </span>
            <span className="font-medium tracking-wide uppercase">
              {isLiveApi ? 'Live FastAPI Stream' : 'Operational Demo Mode'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Telemetry Synchronized</span>
          </div>
        </div>

        {/* Airport hub status pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          {data.hubStatus && Object.entries(data.hubStatus).map(([hub, info]) => (
            <span
              key={hub}
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border ${
                info.status.includes('CRITICAL') || info.status.includes('GDP')
                  ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                  : info.status.includes('WARN')
                  ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300'
              }`}
            >
              <span className="font-bold">{hub}</span>
              <span className="opacity-75">{info.delay}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3">
        {/* Monitored Flights */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Monitored Flights</span>
            <Activity className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {data.totalMonitoredFlights}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Active airborne & turnaround
          </div>
        </div>

        {/* Critical Risk Flights */}
        <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-3 hover:border-rose-700/60 transition-colors relative overflow-hidden">
          <div className="flex items-center justify-between text-rose-300 text-xs mb-1">
            <span className="font-semibold">Critical Risk</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          </div>
          <div className="text-xl font-bold font-mono text-rose-400">
            {data.criticalRiskFlights}
          </div>
          <div className="text-[11px] text-rose-300/70 mt-0.5">
            Immediate dispatch action
          </div>
        </div>

        {/* High Risk Flights */}
        <div className="bg-amber-950/20 border border-amber-900/40 rounded-lg p-3 hover:border-amber-700/60 transition-colors">
          <div className="flex items-center justify-between text-amber-300 text-xs mb-1">
            <span className="font-semibold">High Watch</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">
            {data.highRiskFlights}
          </div>
          <div className="text-[11px] text-amber-300/70 mt-0.5">
            Turnaround / slot watch
          </div>
        </div>

        {/* On-Time Performance */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>On-Time Rate</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {data.onTimePercentage}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Within 15 min buffer
          </div>
        </div>

        {/* Network Average Delay */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Avg Network Delay</span>
            <Compass className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono text-purple-300">
            +{data.networkAverageDelayMinutes}m
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Across 4 primary hubs
          </div>
        </div>

        {/* Proactive Cost Avoidance */}
        <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-3 hover:border-emerald-700/60 transition-colors">
          <div className="flex items-center justify-between text-emerald-300 text-xs mb-1">
            <span className="font-semibold">Cost Avoided</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {data.proactiveSavingsEst}
          </div>
          <div className="text-[11px] text-emerald-300/70 mt-0.5">
            Via AI mitigation swaps
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationalPulse;
