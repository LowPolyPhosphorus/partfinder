/**
 * Talks to the GitHub Contents API directly from the browser using a
 * Personal Access Token the user pastes in once (stored in localStorage,
 * never committed to the repo). This is what makes a "static" GitHub Pages
 * site able to save edits permanently — every save is a real git commit.
 *
 * Token needs the "repo" scope (classic) or "Contents: read & write"
 * (fine-grained) on the target repo.
 */

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
  dataPath: string; // e.g. "src/data/data.json"
}

interface GitHubFileResponse {
  content: string; // base64
  sha: string;
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

/** Fetch a file's content + sha (sha is required to commit an update). */
export async function getFile(
  cfg: GitHubConfig,
  path: string
): Promise<GitHubFileResponse> {
  const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${path}?ref=${cfg.branch}`;
  const res = await fetch(url, { headers: authHeaders(cfg.token) });
  if (!res.ok) {
    throw new Error(`GitHub read failed (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

/** Base64-encode a JS string as UTF-8 (browser btoa chokes on non-Latin1 otherwise). */
function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

/** Commit a text file (e.g. data.json) to the repo. */
export async function putTextFile(
  cfg: GitHubConfig,
  path: string,
  content: string,
  message: string,
  existingSha?: string
): Promise<void> {
  const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${path}`;
  const body: Record<string, unknown> = {
    message,
    content: utf8ToBase64(content),
    branch: cfg.branch,
  };
  if (existingSha) body.sha = existingSha;

  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...authHeaders(cfg.token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`GitHub write failed (${res.status}): ${await res.text()}`);
  }
}

/** Commit a binary file (image) given a base64 string (no data: prefix). */
export async function putBinaryFile(
  cfg: GitHubConfig,
  path: string,
  base64Content: string,
  message: string
): Promise<void> {
  const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${path}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...authHeaders(cfg.token), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: base64Content,
      branch: cfg.branch,
    }),
  });
  if (!res.ok) {
    throw new Error(`GitHub image upload failed (${res.status}): ${await res.text()}`);
  }
}

/** Save the full inventory JSON back to the repo. Handles fetching the current sha. */
export async function saveInventory(
  cfg: GitHubConfig,
  data: unknown,
  message = 'Update inventory data'
): Promise<void> {
  let sha: string | undefined;
  try {
    const current = await getFile(cfg, cfg.dataPath);
    sha = current.sha;
  } catch {
    // file might not exist yet on first save — proceed without sha
  }
  await putTextFile(cfg, cfg.dataPath, JSON.stringify(data, null, 2), message, sha);
}

/** Quick check that the token + repo combo actually works. */
export async function verifyAccess(cfg: GitHubConfig): Promise<boolean> {
  try {
    const res = await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}`, {
      headers: authHeaders(cfg.token),
    });
    return res.ok;
  } catch {
    return false;
  }
}
