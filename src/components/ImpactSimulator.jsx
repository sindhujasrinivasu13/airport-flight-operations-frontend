import React, { useState, useEffect } from 'react';
import { Sliders, RotateCcw, AlertTriangle, DollarSign, Users, Clock, ShieldAlert } from 'lucide-react';
import { simulateFlightImpact } from '../services/flightApi';

/**
 * ImpactSimulator Component
 * 
 * Interactive What-If scenario modeler for flight operations dispatchers.
 * Simulates delay increments and models downstream missed connections,
 * curfew penalties, and financial exposure changes via the flightApi service.
 */
export const ImpactSimulator = ({
  flight,
  onSimulationChange
}) => {
  const [additionalDelay, setAdditionalDelay] = useState(0);
  const [simulationResult, setSimulationResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const flightNumber = flight?.flightNumber;

  // Run simulation whenever additionalDelay or flight changes
  useEffect(() => {
    let isCancelled = false;

    const runSimulation = async () => {
      if (!flightNumber) return;
      setIsSimulating(true);

      try {
        const result = await simulateFlightImpact(flightNumber, additionalDelay);
        if (!isCancelled) {
          setSimulationResult(result);
          if (onSimulationChange) {
            onSimulationChange(result);
          }
        }
      } catch (err) {
        console.error('Impact simulation failed:', err);
      } finally {
        if (!isCancelled) setIsSimulating(false);
      }
    };

    runSimulation();

    return () => {
      isCancelled = true;
    };
  }, [flightNumber, additionalDelay]);

  // Reset simulator
  const handleReset = () => {
    setAdditionalDelay(0);
  };

  const presetIncrements = [15, 30, 45, 60, 90, 120];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              What-If Impact Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Project network consequences of additional departure delays
            </p>
          </div>
        </div>

        {additionalDelay > 0 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Interactive Delay Slider & Quick Buttons */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">
            Simulate Additional Delay:
          </label>
          <span className="font-mono text-base font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
            +{additionalDelay} min
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="120"
          step="5"
          value={additionalDelay}
          onChange={(e) => setAdditionalDelay(Number(e.target.value))}
          className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />

        {/* Quick increment buttons */}
        <div className="grid grid-cols-6 gap-1.5 pt-1">
          {presetIncrements.map((mins) => (
            <button
              key={mins}
              onClick={() => setAdditionalDelay(mins)}
              className={`py-1 text-xs font-mono rounded border transition-colors ${
                additionalDelay === mins
                  ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 font-bold'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              +{mins}m
            </button>
          ))}
        </div>
      </div>

      {/* Simulation Results Comparison Deck */}
      {simulationResult && (
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Projected Delay */}
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Total Delay</span>
                <Clock className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-lg font-bold font-mono text-white">
                {simulationResult.projectedTotalDelayMinutes}m
              </div>
              <div className="text-[11px] font-mono text-amber-400 mt-0.5">
                Baseline: {simulationResult.baselineDelayMinutes}m
              </div>
            </div>

            {/* Simulated Risk Score */}
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Projected Risk</span>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="flex items-baseline gap-1 text-lg font-bold font-mono text-white">
                <span>{simulationResult.simulatedRiskScore}</span>
                <span className="text-xs text-slate-500">/100</span>
              </div>
              <div className={`text-[11px] font-mono mt-0.5 ${simulationResult.riskDelta > 0 ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
                {simulationResult.riskDelta > 0 ? `+${simulationResult.riskDelta} pts` : 'No change'}
              </div>
            </div>

            {/* Missed Connections */}
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Missed Pax</span>
                <Users className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="text-lg font-bold font-mono text-white">
                {simulationResult.simulatedMissedConnections} pax
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                +{simulationResult.additionalMissedConnections} secondary
              </div>
            </div>

            {/* Financial Exposure */}
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Total Impact</span>
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-lg font-bold font-mono text-white">
                ${simulationResult.simulatedFinancialImpact?.toLocaleString()}
              </div>
              <div className="text-[11px] font-mono text-rose-400 mt-0.5">
                +${simulationResult.additionalFinancialCost?.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Curfew Trigger Alert if applicable */}
          {simulationResult.curfewRisk && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-rose-300">
                <span className="font-bold">Downstream Curfew Breach Warning: </span>
                Delay exceeds slot boundary at {simulationResult.curfewAirport}. Night curfew violation penalties and passenger hotel compensation will trigger automatically.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImpactSimulator;
