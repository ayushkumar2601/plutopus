import { NextResponse } from 'next/server';
import store from '@/lib/sessionStore';
import { startAutoSimulation, stopAutoSimulation, isSimulationRunning } from '@/lib/autoSimulation';

// Track if extension is connected
let extensionConnected = false;
let lastExtensionPing = 0;
const EXTENSION_TIMEOUT = 10000; // 10 seconds

export async function GET() {
  try {
    const traffic = store.getTraffic(20);
    const alerts  = store.getAlertDetections(10);
    const summary = store.getSummary();

    // Check if extension is connected (based on recent traffic from extension)
    const now = Date.now();
    const recentExtensionTraffic = traffic.filter(t => 
      t.source === 'extension' && 
      (now - new Date(t.timestamp).getTime()) < EXTENSION_TIMEOUT
    );
    
    extensionConnected = recentExtensionTraffic.length > 0;

    // Start auto-simulation if no extension and no traffic
    if (!extensionConnected && traffic.length < 5 && !isSimulationRunning()) {
      console.log('[Realtime] No extension detected, starting auto-simulation');
      startAutoSimulation(async (fakeTraffic) => {
        try {
          // Send fake traffic to traffic API
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/traffic`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fakeTraffic)
          });
        } catch (err) {
          console.error('[AutoSim] Failed to send traffic:', err);
        }
      });
    }

    // Stop simulation if extension connects
    if (extensionConnected && isSimulationRunning()) {
      console.log('[Realtime] Extension connected, stopping auto-simulation');
      stopAutoSimulation();
    }

    const highRisk   = traffic.filter(t => (t.riskScore ?? 0) >= 70).length;
    const threatLevel = highRisk > 10 ? 'critical' : highRisk > 5 ? 'high' : highRisk > 0 ? 'medium' : 'low';

    return NextResponse.json({
      success: true,
      stats: {
        packetsPerSecond: traffic.length / 10,
        alertsPerMinute:  alerts.length * 2,
        threatLevel,
        activeThreats:    alerts.length,
        topAttacker:      alerts[0]?.ip ?? null,
        ...summary,
      },
      recentTraffic: traffic.slice(0, 10),
      recentAlerts:  alerts.slice(0, 5),
      timestamp:     new Date(),
      extensionConnected,
      simulationActive: isSimulationRunning(),
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch real-time data' }, { status: 500 });
  }
}
