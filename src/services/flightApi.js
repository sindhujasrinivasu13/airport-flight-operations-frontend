import axios from 'axios';
import { DEMO_FLIGHTS, DEMO_OPERATIONAL_PULSE } from '../data/demoFlights';

/**
 * Axios API Service Layer for Flight Operations
 * 
 * Configured to communicate with FastAPI backend endpoints.
 * Includes seamless fallback to local demonstration data when backend
 * is offline or when running in standalone demo mode.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const USE_DEMO_DATA = import.meta.env.VITE_USE_DEMO_DATA !== 'false';

// Create configured Axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// In-memory demo state store to support dynamic updates (approvals, simulations) during demo sessions
let localFlightsState = JSON.parse(JSON.stringify(DEMO_FLIGHTS));

// Helper for simulated network delay in demo mode (enhances realistic UX testing)
const demoDelay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch all flights for the priority board and search index
 * Endpoint: GET /flights
 */
export const getAllFlights = async () => {
  if (USE_DEMO_DATA) {
    await demoDelay(150);
    return [...localFlightsState];
  }

  try {
    const response = await apiClient.get('/flights');
    return response.data;
  } catch (error) {
    console.warn('[flightApi] Live API unavailable, falling back to demo data', error);
    return [...localFlightsState];
  }
};

/**
 * Fetch operational pulse metrics
 * Endpoint: GET /operations/pulse
 */
export const getOperationalPulse = async () => {
  if (USE_DEMO_DATA) {
    await demoDelay(100);
    return { ...DEMO_OPERATIONAL_PULSE };
  }

  try {
    const response = await apiClient.get('/operations/pulse');
    return response.data;
  } catch (error) {
    console.warn('[flightApi] Live API unavailable, falling back to demo data', error);
    return { ...DEMO_OPERATIONAL_PULSE };
  }
};

/**
 * Fetch risk score and risk factor breakdown for a specific flight
 * Endpoint: GET /flights/{flightNumber}/risk
 */
export const getFlightRisk = async (flightNumber) => {
  if (USE_DEMO_DATA) {
    await demoDelay(200);
    const flight = localFlightsState.find(
      (f) => f.flightNumber.toLowerCase() === flightNumber.toLowerCase()
    );
    if (!flight) throw new Error(`Flight ${flightNumber} not found`);
    return {
      flightNumber: flight.flightNumber,
      riskScore: flight.riskScore,
      riskLevel: flight.riskLevel,
      riskFactors: flight.riskFactors,
      historicalTrend: flight.historicalTrend
    };
  }

  try {
    const response = await apiClient.get(`/flights/${encodeURIComponent(flightNumber)}/risk`);
    return response.data;
  } catch (error) {
    console.error(`[flightApi] Failed to fetch flight risk for ${flightNumber}:`, error);
    throw error;
  }
};

/**
 * Fetch delay details and reasons for a specific flight
 * Endpoint: GET /flights/{flightNumber}/delay
 */
export const getFlightDelay = async (flightNumber) => {
  if (USE_DEMO_DATA) {
    await demoDelay(150);
    const flight = localFlightsState.find(
      (f) => f.flightNumber.toLowerCase() === flightNumber.toLowerCase()
    );
    if (!flight) throw new Error(`Flight ${flightNumber} not found`);
    return {
      flightNumber: flight.flightNumber,
      delayMinutes: flight.delayMinutes,
      delayReason: flight.delayReason,
      status: flight.status,
      origin: flight.origin,
      destination: flight.destination
    };
  }

  try {
    const response = await apiClient.get(`/flights/${encodeURIComponent(flightNumber)}/delay`);
    return response.data;
  } catch (error) {
    console.error(`[flightApi] Failed to fetch flight delay for ${flightNumber}:`, error);
    throw error;
  }
};

/**
 * Simulate what-if impact scenario given additional delay in minutes
 * Endpoint: POST /flights/{flightNumber}/simulate-impact
 * Body: { additionalDelay: number }
 */
export const simulateFlightImpact = async (flightNumber, additionalDelay = 0) => {
  if (USE_DEMO_DATA) {
    await demoDelay(300);
    const flight = localFlightsState.find(
      (f) => f.flightNumber.toLowerCase() === flightNumber.toLowerCase()
    );
    if (!flight) throw new Error(`Flight ${flightNumber} not found`);

    const delayNum = Number(additionalDelay) || 0;
    const baselineDelay = flight.delayMinutes;
    const projectedDelay = baselineDelay + delayNum;

    // Realistic non-linear risk and impact calculation
    const delayFactor = Math.min(projectedDelay / 120, 1.6);
    const simulatedRiskScore = Math.min(
      Math.round(flight.riskScore * 0.75 + (delayFactor * 35)),
      100
    );

    const baseMissed = flight.impactAnalysis?.missedConnections || 0;
    const simulatedMissedConnections = Math.round(baseMissed + (delayNum * 0.35));
    
    const baseCost = flight.impactAnalysis?.totalFinancialImpact || 15000;
    const simulatedCost = Math.round(baseCost + (delayNum * 450) + (simulatedMissedConnections * 650));

    const simulatedCurfewRisk = projectedDelay > 60 || flight.impactAnalysis?.curfewRisk;

    return {
      flightNumber: flight.flightNumber,
      baselineDelayMinutes: baselineDelay,
      additionalDelayMinutes: delayNum,
      projectedTotalDelayMinutes: projectedDelay,
      baselineRiskScore: flight.riskScore,
      simulatedRiskScore,
      riskDelta: simulatedRiskScore - flight.riskScore,
      baselineMissedConnections: baseMissed,
      simulatedMissedConnections,
      additionalMissedConnections: Math.max(0, simulatedMissedConnections - baseMissed),
      curfewRisk: simulatedCurfewRisk,
      curfewAirport: flight.impactAnalysis?.curfewAirport || 'N/A',
      baselineFinancialImpact: baseCost,
      simulatedFinancialImpact: simulatedCost,
      additionalFinancialCost: simulatedCost - baseCost,
      severityCategory: simulatedRiskScore >= 80 ? 'CRITICAL' : simulatedRiskScore >= 60 ? 'HIGH' : simulatedRiskScore >= 30 ? 'MEDIUM' : 'LOW'
    };
  }

  try {
    const response = await apiClient.post(
      `/flights/${encodeURIComponent(flightNumber)}/simulate-impact`,
      { additionalDelay: Number(additionalDelay) }
    );
    return response.data;
  } catch (error) {
    console.error(`[flightApi] Failed to simulate impact for ${flightNumber}:`, error);
    throw error;
  }
};

/**
 * Fetch AI mitigation recommendation for a flight
 * Endpoint: GET /flights/{flightNumber}/recommendation
 */
export const getFlightRecommendation = async (flightNumber) => {
  if (USE_DEMO_DATA) {
    await demoDelay(200);
    const flight = localFlightsState.find(
      (f) => f.flightNumber.toLowerCase() === flightNumber.toLowerCase()
    );
    if (!flight) throw new Error(`Flight ${flightNumber} not found`);
    return flight.recommendation;
  }

  try {
    const response = await apiClient.get(
      `/flights/${encodeURIComponent(flightNumber)}/recommendation`
    );
    return response.data;
  } catch (error) {
    console.error(`[flightApi] Failed to fetch recommendation for ${flightNumber}:`, error);
    throw error;
  }
};

/**
 * Approve AI mitigation decision
 * Endpoint: POST /flights/{flightNumber}/approve
 * Body: { approvedBy: string }
 */
export const approveDecision = async (flightNumber, approvedBy = 'Operations Dispatcher') => {
  if (USE_DEMO_DATA) {
    await demoDelay(350);
    const flightIndex = localFlightsState.findIndex(
      (f) => f.flightNumber.toLowerCase() === flightNumber.toLowerCase()
    );
    if (flightIndex === -1) throw new Error(`Flight ${flightNumber} not found`);

    const now = new Date().toISOString();
    localFlightsState[flightIndex].recommendation = {
      ...localFlightsState[flightIndex].recommendation,
      status: 'APPROVED',
      approvedBy,
      timestamp: now
    };

    // Reflect approval in agent workflow
    if (Array.isArray(localFlightsState[flightIndex].agentWorkflow)) {
      const lastWorkflow = localFlightsState[flightIndex].agentWorkflow[localFlightsState[flightIndex].agentWorkflow.length - 1];
      if (lastWorkflow) {
        lastWorkflow.status = 'COMPLETED';
        lastWorkflow.detail = `Approved by ${approvedBy} at ${now.substring(11, 19)} UTC`;
      }
    }

    return {
      success: true,
      message: `Recommendation for ${flightNumber} successfully approved.`,
      flightNumber,
      approvedBy,
      status: 'APPROVED',
      timestamp: now
    };
  }

  try {
    const response = await apiClient.post(
      `/flights/${encodeURIComponent(flightNumber)}/approve`,
      { approvedBy }
    );
    return response.data;
  } catch (error) {
    console.error(`[flightApi] Failed to approve decision for ${flightNumber}:`, error);
    throw error;
  }
};

/**
 * Escalate/Review decision for secondary flight controller evaluation
 * Endpoint: POST /flights/{flightNumber}/review
 * Body: { reviewedBy: string }
 */
export const reviewDecision = async (flightNumber, reviewedBy = 'Senior Operations Lead') => {
  if (USE_DEMO_DATA) {
    await demoDelay(350);
    const flightIndex = localFlightsState.findIndex(
      (f) => f.flightNumber.toLowerCase() === flightNumber.toLowerCase()
    );
    if (flightIndex === -1) throw new Error(`Flight ${flightNumber} not found`);

    const now = new Date().toISOString();
    localFlightsState[flightIndex].recommendation = {
      ...localFlightsState[flightIndex].recommendation,
      status: 'REVIEW_REQUESTED',
      reviewedBy,
      timestamp: now
    };

    return {
      success: true,
      message: `Decision review requested for flight ${flightNumber}. Escrow notification sent.`,
      flightNumber,
      reviewedBy,
      status: 'REVIEW_REQUESTED',
      timestamp: now
    };
  }

  try {
    const response = await apiClient.post(
      `/flights/${encodeURIComponent(flightNumber)}/review`,
      { reviewedBy }
    );
    return response.data;
  } catch (error) {
    console.error(`[flightApi] Failed to request review for ${flightNumber}:`, error);
    throw error;
  }
};
