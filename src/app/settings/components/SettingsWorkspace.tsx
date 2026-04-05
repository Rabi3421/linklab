'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';
import ApiAccessPanel from './ApiAccessPanel';

export default function SettingsWorkspace() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('Rabi Narayan');
  const [workspaceName, setWorkspaceName] = useState('LinkLab Growth Team');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [emailReports, setEmailReports] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [savedMessage, setSavedMessage] = useState('');

  const handleSave = (section: string) => {
    setSavedMessage(`${section} updated successfully.`);
    window.setTimeout(() => setSavedMessage(''), 2200);
  };

  return (
    <div className="space-y-6">
      {savedMessage && (
        <div className="rounded-lg border border-success/20 bg-success/10 px-4 py-3 text-sm text-success flex items-center gap-2">
          <Icon name="CheckCircleIcon" size={18} variant="solid" />
          {savedMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <ApiAccessPanel />

          <section className="bg-card rounded-lg border border-border p-6">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-foreground">Profile details</h2>
              <p className="text-sm text-muted-foreground">
                Update how your name and workspace appear across LinkLab.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Display name
                </label>
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email address
                </label>
                <input
                  value={user?.email ?? ''}
                  disabled
                  className="w-full px-4 py-3 bg-muted border border-input rounded-lg text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Workspace name
                </label>
                <input
                  value={workspaceName}
                  onChange={(event) => setWorkspaceName(event.target.value)}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
                <select
                  value={timezone}
                  onChange={(event) => setTimezone(event.target.value)}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="America/New_York">America/New_York</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => handleSave('Profile')}
                className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-250 hover:shadow-md"
              >
                Save profile
              </button>
            </div>
          </section>

          <section className="bg-card rounded-lg border border-border p-6">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
              <p className="text-sm text-muted-foreground">
                Choose which updates reach your inbox.
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Weekly email reports</p>
                  <p className="text-xs text-muted-foreground">
                    Get a digest of top-performing links and campaigns.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailReports}
                  onChange={(event) => setEmailReports(event.target.checked)}
                  className="h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Security alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Be notified when sessions refresh from new browsers or devices.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={securityAlerts}
                  onChange={(event) => setSecurityAlerts(event.target.checked)}
                  className="h-4 w-4"
                />
              </label>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => handleSave('Notification preferences')}
                className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-250 hover:shadow-md"
              >
                Save notifications
              </button>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Security</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-lg bg-muted/40 border border-border p-4">
                <p className="text-foreground font-medium mb-1">JWT sessions enabled</p>
                <p>Access tokens rotate through secure refresh-token cookies.</p>
              </div>
              <div className="rounded-lg bg-muted/40 border border-border p-4">
                <p className="text-foreground font-medium mb-1">Recommended next step</p>
                <p>Add password reset and email verification when you are ready.</p>
              </div>
            </div>
          </section>

          <section className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Workspace defaults</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Icon
                  name="CheckCircleIcon"
                  size={18}
                  variant="solid"
                  className="text-success mt-0.5"
                />
                Branded short domain recommended for public campaigns
              </li>
              <li className="flex items-start gap-2">
                <Icon
                  name="CheckCircleIcon"
                  size={18}
                  variant="solid"
                  className="text-success mt-0.5"
                />
                Use lowercase UTM values for clean reporting
              </li>
              <li className="flex items-start gap-2">
                <Icon
                  name="CheckCircleIcon"
                  size={18}
                  variant="solid"
                  className="text-success mt-0.5"
                />
                Expire time-sensitive promotional links automatically
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
