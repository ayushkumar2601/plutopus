// ============================================================
// PLUTO Auto Simulation System
// Continuously generates traffic when extension is not connected
// ============================================================

import { generateRealisticPattern, generateFakeTraffic } from './devTrafficGenerator';

let simulationInterval: NodeJS.Timeout | null = null;
let isRunning = false;
let trafficCallback: ((traffic: any) => void) | null = null;

export function startAutoSimulation(callback: (traffic: any) => void) {
  if (isRunning) {
    console.log('[AutoSim] Already running');
    return;
  }

  console.log('[AutoSim] Starting continuous traffic simulation...');
  isRunning = true;
  trafficCallback = callback;

  // Generate initial burst
  const initialTraffic = generateRealisticPattern();
  initialTraffic.forEach(traffic => {
    if (trafficCallback) {
      trafficCallback(traffic);
    }
  });

  // Continue generating traffic every 3-5 seconds
  simulationInterval = setInterval(() => {
    if (!isRunning || !trafficCallback) {
      stopAutoSimulation();
      return;
    }

    // Random interval between batches
    const shouldGenerate = Math.random() > 0.3; // 70% chance
    
    if (shouldGenerate) {
      const traffic = generateFakeTraffic();
      trafficCallback(traffic);
    }
  }, randomInterval(3000, 5000));

  console.log('[AutoSim] Simulation started');
}

export function stopAutoSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
  isRunning = false;
  trafficCallback = null;
  console.log('[AutoSim] Simulation stopped');
}

export function isSimulationRunning(): boolean {
  return isRunning;
}

function randomInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Singleton pattern to ensure only one simulation runs
let instance: {
  start: typeof startAutoSimulation;
  stop: typeof stopAutoSimulation;
  isRunning: typeof isSimulationRunning;
} | null = null;

export function getSimulationInstance() {
  if (!instance) {
    instance = {
      start: startAutoSimulation,
      stop: stopAutoSimulation,
      isRunning: isSimulationRunning
    };
  }
  return instance;
}
