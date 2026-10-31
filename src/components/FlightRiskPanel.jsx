import React, { useState } from 'react';
import { Plane, AlertTriangle, ShieldCheck, Clock, GitCommit, Sliders, Cpu, Sparkles, MapPin } from 'lucide-react';
import { RiskScore } from './RiskScore';
import { RiskFactors } from './RiskFactors';
import { RiskChart } from './RiskChart';
import { FlightDependency } from './FlightDependency';
import { ImpactSimulator } from './ImpactSimulator';
import { AIRecommendation } from './AIRecommendation';
import { AgentWorkflow } from './AgentWorkflow';

/**
 * FlightRiskPanel Component
 * 
 * Central operational command deck for an individual flight.
 * Provides granular diagnostic drilldowns: risk scores, contributing factors,
 * network ripple effects, interactive simulation, multi-agent status,
 * and AI mitigation decision controls.
 */
export const FlightRiskPanel = ({
  flight,
  onDecisionUpdated
}) => {
  const [activeTab, setActiveTab] = useState('RISK_ASSESSMENT');

  if (!flight) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-900/50 border border-slate-800 rounded-xl text-center">
        <Plane className="w-12 h-12 text-slate-700 mb-3 transform -rotate-45" />
        <h3 className="text-base font-semibold text-slate-300">No Flight Selected</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Select any flight from the priority queue to open the detailed Operations Command Deck.
        </p>
      </div>
    );
  }

  const {
    flightNumber,
    airline,
    origin,
    destination,
    aircraft,
    delayMinutes = 0,
    delayReason = '',
    riskScore = 0,
    riskLevel = 'LOW',
    status = 'On Time',
    riskFactors = [],
    dependencies,
    agentWorkflow = [],
    historicalTrend = []
  } = flight;

  return (
    <div className="flex flex-col h-full bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Flight Detail Banner */}
      <div className="bg-slate-950/90 border-b border-slate-800 p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Flight Ident & Routing */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-black text-white tracking-tight">
                {flightNumber}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded border uppercase ${
                status === 'Critical Risk'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : status === 'Delayed'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {status}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {airline}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>{aircraft?.model}</span>
              <span>•</span>
              <span>Tail: {aircraft?.tailNumber}</span>
              <span>•</span>
              <span>Pax: {aircraft?.passengerLoad}/{aircraft?.capacity}</span>
            </div>
          </div>

          {/* Quick Route Summary */}
          <div className="flex items-center gap-6 bg-slate-900/90 border border-slate-800 rounded-lg p-3">
            <div className="text-center">
              <div className="text-lg font-bold font-mono text-white">{origin?.code}</div>
              <div className="text-[11px] text-slate-400">Terminal {origin?.terminal}</div>
              <div className="text-[10px] text-slate-500 font-mono">Gate {origin?.gate}</div>
            </div>

            <div className="flex flex-col items-center">
              <div className={`text-xs font-mono font-bold ${delayMinutes > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {delayMinutes > 0 ? `+${delayMinutes}m delay` : 'On Schedule'}
              </div>
              <div className="w-16 h-0.5 bg-slate-700 relative my-1">
                <Plane className="w-3 h-3 text-cyan-400 absolute left-1/2 -top-1.5 -translate-x-1/2 transform rotate-45" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {origin?.scheduledTime} &rarr; {destination?.estimatedTime}
              </div>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold font-mono text-white">{destination?.code}</div>
              <div className="text-[11px] text-slate-400">Terminal {destination?.terminal}</div>
              <div className="text-[10px] text-slate-500 font-mono">Gate {destination?.gate}</div>
            </div>
          </div>
        </div>

        {/* Operational Delay Advisory */}
        {delayReason && (
          <div className="mt-3 p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">Operational Bottleneck: </span>
              {delayReason}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950/50 px-4 py-2 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('RISK_ASSESSMENT')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'RISK_ASSESSMENT'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Risk Assessment & Trend</span>
        </button>

        <button
          onClick={() => setActiveTab('SIMULATOR')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'SIMULATOR'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>Impact Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('DEPENDENCIES')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'DEPENDENCIES'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitCommit className="w-3.5 h-3.5 text-purple-400" />
          <span>Network & Pax Connections</span>
        </button>

        <button
          onClick={() => setActiveTab('AI_RECOMMENDATION')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'AI_RECOMMENDATION'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI Mitigation Strategy</span>
        </button>

        <button
          onClick={() => setActiveTab('AGENT_PIPELINE')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'AGENT_PIPELINE'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>Agent Pipeline</span>
        </button>
      </div>

      {/* Command Deck Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {activeTab === 'RISK_ASSESSMENT' && (
          <div className="space-y-5">
            {/* Top row: Gauge score + Trend chart */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <RiskScore score={riskScore} level={riskLevel} size="gauge" showLabel={true} />
              </div>
              <div className="md:col-span-2">
                <RiskChart data={historicalTrend} />
              </div>
            </div>

            {/* Contributing Risk Factors */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Risk Dimension Diagnostics
              </h4>
              <RiskFactors factors={riskFactors} />
            </div>
          </div>
        )}

        {activeTab === 'SIMULATOR' && (
          <ImpactSimulator flight={flight} />
        )}

        {activeTab === 'DEPENDENCIES' && (
          <FlightDependency dependencies={dependencies} />
        )}

        {activeTab === 'AI_RECOMMENDATION' && (
          <AIRecommendation
            flight={flight}
            onActionComplete={onDecisionUpdated}
          />
        )}

        {activeTab === 'AGENT_PIPELINE' && (
          <AgentWorkflow workflow={agentWorkflow} />
        )}
      </div>
    </div>
  );
};

export default FlightRiskPanel;
