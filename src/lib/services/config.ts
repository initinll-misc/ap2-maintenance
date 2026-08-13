import type { MaintenanceConfig } from '$lib/types/config';

function defaultConfigPath(): string {
  const base = import.meta.env.BASE_URL;
  return `${base}config/maintenance.json`;
}

export async function loadMaintenanceConfig(path?: string): Promise<MaintenanceConfig> {
  const response = await fetch(path ?? defaultConfigPath());
  if (!response.ok) {
    throw new Error(`Failed to load config (${response.status})`);
  }
  return response.json() as Promise<MaintenanceConfig>;
}
