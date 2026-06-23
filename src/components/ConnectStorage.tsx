import { useState } from 'react';
import type { GitHubConfig } from '../lib/github';
import { verifyAccess } from '../lib/github';

interface Props {
  onSave: (cfg: GitHubConfig) => void;
  onClose: () => void;
}

export function ConnectStorage({ onSave, onClose }: Props) {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [token, setToken] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!owner || !repo || !token) {
      setError('all three fields are needed to connect');
      return;
    }
    setVerifying(true);
    setError('');
    const cfg: GitHubConfig = {
      owner: owner.trim(),
      repo: repo.trim(),
      branch: 'main',
      token: token.trim(),
      dataPath: 'src/data/data.json',
    };
    const ok = await verifyAccess(cfg);
    setVerifying(false);
    if (!ok) {
      setError("couldn't access that repo with this token — check the scopes and try again");
      return;
    }
    onSave(cfg);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <h2>connect storage</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <form onSubmit={handleSubmit} className="item-form modal-form-padded">
          <p className="gate-sub" style={{ margin: '0 0 4px' }}>
            paste a GitHub token so edits save permanently. needs Contents read/write
            on this repo (fine-grained token, scoped to just this repo).
          </p>
          <label className="form-field">
            <span>github username</span>
            <input value={owner} onChange={(e) => setOwner(e.target.value)} autoFocus />
          </label>
          <label className="form-field">
            <span>repo name</span>
            <input value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="finder" />
          </label>
          <label className="form-field">
            <span>personal access token</span>
            <input type="password" value={token} onChange={(e) => setToken(e.target.value)} />
          </label>
          {error && <p className="gate-error">{error}</p>}
          <div className="modal-actions">
            <div className="modal-actions-right">
              <button type="button" className="btn-ghost" onClick={onClose}>cancel</button>
              <button type="submit" className="btn-primary" disabled={verifying}>
                {verifying ? 'checking…' : 'connect'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
