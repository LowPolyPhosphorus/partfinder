import { useCallback, useEffect, useState } from 'react';
import type { GitHubConfig } from '../lib/github';

const LS_GH_CONFIG = 'finder.ghConfig';

/**
 * Viewing access is handled entirely outside this app, by Cloudflare Access
 * sitting in front of the domain — nobody reaches this JS at all unless
 * Cloudflare already verified their identity. See README for setup.
 *
 * This hook only manages the GitHub token, which is the separate thing that
 * authorizes *writes* (saving edits back to the repo). Without it the site
 * is still fully viewable/searchable, just not editable-and-persisted.
 */
export function useAuth() {
  const [ghConfig, setGhConfig] = useState<GitHubConfig | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(LS_GH_CONFIG);
    if (raw) {
      try {
        setGhConfig(JSON.parse(raw));
      } catch {
        // corrupted value, ignore
      }
    }
    setLoaded(true);
  }, []);

  const saveGhConfig = useCallback((cfg: GitHubConfig) => {
    localStorage.setItem(LS_GH_CONFIG, JSON.stringify(cfg));
    setGhConfig(cfg);
  }, []);

  const clearGhConfig = useCallback(() => {
    localStorage.removeItem(LS_GH_CONFIG);
    setGhConfig(null);
  }, []);

  return { ghConfig, saveGhConfig, clearGhConfig, loaded };
}
