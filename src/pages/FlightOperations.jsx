import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Radio, Compass, Plane, AlertCircle } from 'lucide-react';
import { OperationalPulse } from '../components/OperationalPulse';
import { SearchFilter } from '../components/SearchFilter';
import { FlightPriorityBoard } from '../components/FlightPriorityBoard';
import { FlightRiskPanel } from '../components/FlightRiskPanel';
import { getAllFlights, getOperationalPulse, USE_DEMO_DATA } from '../services/flightApi';

/**
 * FlightOperations Main Page Component
 * 
 * Complete operational control center orchestrating real-time flight telemetry,
 * priority triage, multi-agent AI mitigation recommendations, and What-If simulation.
 */
export const FlightOperations = () => {
  const [flights, setFlights] = useState([]);
  const [pulseData, setPulseData] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('risk');

  // Live UTC Clock
  const [currentTime, setCurrentTime] = useState(new Date().toUTCString().slice(17, 25));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toUTCString().slice(17, 25));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial telemetry
  const loadData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      const [flightsData, pulse] = await Promise.all([
        getAllFlights(),
        getOperationalPulse()
      ]);

      setFlights(flightsData);
      setPulseData(pulse);

      // Auto-select highest critical flight on initial load or preserve current selection
      setSelectedFlight((prev) => {
        if (prev) {
          const updated = flightsData.find((f) => f.flightNumber === prev.flightNumber);
          return updated || prev;
        }
        // Pick first critical flight or first in list
        const critical = flightsData.find((f) => f.riskScore >= 80) || flightsData[0];
        return critical || null;
      });
    } catch (err) {
      console.error('Failed to load flight operations data:', err);
      setError('Unable to retrieve flight telemetry. Please check API connection.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter and sort flights
  const filteredFlights = useMemo(() => {
    return flights
      .filter((f) => {
        // Search term check
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchNumber = f.flightNumber?.toLowerCase().includes(term);
          const matchAirline = f.airline?.toLowerCase().includes(term);
          const matchOrigin = f.origin?.code?.toLowerCase().includes(term) || f.origin?.name?.toLowerCase().includes(term);
          const matchDest = f.destination?.code?.toLowerCase().includes(term) || f.destination?.name?.toLowerCase().includes(term);
          if (!matchNumber && !matchAirline && !matchOrigin && !matchDest) return false;
        }

        // Risk filter check
        if (riskFilter !== 'ALL') {
          if (riskFilter === 'CRITICAL' && f.riskScore < 80) return false;
          if (riskFilter === 'HIGH' && (f.riskScore < 60 || f.riskScore >= 80)) return false;
          if (riskFilter === 'MEDIUM' && (f.riskScore < 30 || f.riskScore >= 60)) return false;
          if (riskFilter === 'LOW' && f.riskScore >= 30) return false;
        }

        // Status filter check
        if (statusFilter !== 'ALL') {
          if (f.status !== statusFilter) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'risk') return (b.riskScore || 0) - (a.riskScore || 0);
        if (sortBy === 'delay') return (b.delayMinutes || 0) - (a.delayMinutes || 0);
        if (sortBy === 'flightNumber') return a.flightNumber.localeCompare(b.flightNumber);
        return 0;
      });
  }, [flights, searchTerm, riskFilter, statusFilter, sortBy]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setRiskFilter('ALL');
    setStatusFilter('ALL');
    setSortBy('risk');
  };

  // Callback when recommendation decision is approved or reviewed
  const handleDecisionUpdated = () => {
    // Refresh telemetry silently to update statuses
    loadData(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Flight Operations Deck Header */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-black tracking-tight text-white flex items-center gap-2">
                Flight Operations Control Deck
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                  DISPATCH v2.4
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                AeroPulse Multi-Agent Dispatch & Network Risk Mitigation Engine
              </p>
            </div>
          </div>

          {/* Time, Mode, and Refresh Trigger */}
          <div className="flex items-center gap-3">
            {/* UTC Clock */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs">
              <span className="text-slate-500 font-semibold">UTC:</span>
              <span className="text-cyan-400 font-bold">{currentTime}</span>
            </div>

            {/* Refresh Action */}
            <button
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors shadow-sm"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-5">
        {/* Error notification banner if any */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadData()}
              className="underline hover:text-white"
            >
              Retry
            </button>
          </div>
        )}

        {/* Global Operational Pulse Metrics */}
        <OperationalPulse
          pulseData={pulseData}
          isLiveApi={!USE_DEMO_DATA}
        />

        {/* Search, Filter & Sort Bar */}
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          riskFilter={riskFilter}
          onRiskFilterChange={setRiskFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onResetFilters={handleResetFilters}
          resultCount={filteredFlights.length}
          totalCount={flights.length}
        />

        {/* Two-Column Operations Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Priority Dispatch Board */}
          <div className="lg:col-span-5 h-[800px]">
            <FlightPriorityBoard
              flights={filteredFlights}
              selectedFlightId={selectedFlight?.id || selectedFlight?.flightNumber}
              onSelectFlight={(flight) => setSelectedFlight(flight)}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column: Active Flight Command Deck */}
          <div className="lg:col-span-7 h-[800px]">
            <FlightRiskPanel
              flight={selectedFlight}
              onDecisionUpdated={handleDecisionUpdated}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-500">
        <p className="font-mono">
          Flight Operations Control Center &bull; Production Architecture &bull; Module Isolated for Backend Integration
        </p>
      </footer>
    </div>
  );
};

export default FlightOperations;
