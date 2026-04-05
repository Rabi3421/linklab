'use client';

import { useState } from 'react';
import Link from 'next/link';
import QrStyleConfigurator from '@/components/common/QrStyleConfigurator';
import StyledQrCode from '@/components/common/StyledQrCode';
import Icon from '@/components/ui/AppIcon';
import { DEFAULT_QR_STYLE } from '@/lib/links/qr-style';
import { downloadStyledQrCode } from '@/lib/links/qr-style-client';
import type { ManagedLinkRecord, QrStyleConfig } from '@/lib/links/types';

type LinkData = ManagedLinkRecord;

interface LinksTableProps {
  links: LinkData[];
  onCopy: (shortUrl: string) => void;
  onDelete: (id: string) => Promise<void>;
  onStatusChange: (id: string, status: string) => Promise<void>;
  onEdit: (id: string, data: { originalUrl: string; customAlias: string; expirationDate: string; qrStyle: QrStyleConfig }) => Promise<{ success: boolean; message?: string }>;
}

export default function LinksTable({ links, onCopy, onDelete, onStatusChange, onEdit }: LinksTableProps) {
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof LinkData>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [editingLink, setEditingLink] = useState<LinkData | null>(null);
  const [editForm, setEditForm] = useState<{ originalUrl: string; customAlias: string; expirationDate: string; qrStyle: QrStyleConfig }>({
    originalUrl: '',
    customAlias: '',
    expirationDate: '',
    qrStyle: DEFAULT_QR_STYLE,
  });
  const [editError, setEditError] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [expandedQrLinkId, setExpandedQrLinkId] = useState<string | null>(null);

  const buildPreviewUrl = (link: LinkData, nextAlias: string) => {
    try {
      const url = new URL(link.shortUrl);
      url.pathname = `/${nextAlias.trim() || link.shortCode}`;
      return url.toString();
    } catch {
      return link.shortUrl;
    }
  };

  const handleQrDownload = async (link: LinkData) => {
    if (link.qrStyle) {
      await downloadStyledQrCode({
        data: link.shortUrl,
        style: link.qrStyle,
        name: `${link.shortCode}-styled-qr`,
        extension: 'png',
      });
      return;
    }

    const anchor = document.createElement('a');
    anchor.href = link.qrCodeDataUrl;
    anchor.download = `${link.shortCode}-qr.png`;
    anchor.click();
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLinks(links.map(link => link.id));
    } else {
      setSelectedLinks([]);
    }
  };

  const handleSelectLink = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedLinks([...selectedLinks, id]);
    } else {
      setSelectedLinks(selectedLinks.filter(linkId => linkId !== id));
    }
  };

  const handleSort = (field: keyof LinkData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedLinks = [...links].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-success/10', text: 'text-success', label: 'Active' },
      expired: { bg: 'bg-error/10', text: 'text-error', label: 'Expired' },
      inactive: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Inactive' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
        {config.label}
      </span>
    );
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedLinks.length} link(s)?`)) {
      await Promise.all(selectedLinks.map((id) => onDelete(id)));
      setSelectedLinks([]);
    }
  };

  const openEditModal = (link: LinkData) => {
    setEditingLink(link);
    setEditForm({
      originalUrl: link.originalUrl,
      customAlias: link.customAlias,
      expirationDate: link.expirationDate ? new Date(link.expirationDate).toISOString().split('T')[0] : '',
      qrStyle: link.qrStyle || DEFAULT_QR_STYLE,
    });
    setEditError('');
  };

  const closeEditModal = () => {
    setEditingLink(null);
    setEditError('');
    setIsSavingEdit(false);
  };

  const handleSaveEdit = async () => {
    if (!editingLink) {
      return;
    }

    setIsSavingEdit(true);
    setEditError('');
    const result = await onEdit(editingLink.id, editForm);

    if (!result.success) {
      setEditError(result.message || 'Unable to save changes right now.');
      setIsSavingEdit(false);
      return;
    }

    closeEditModal();
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Icon name="LinkIcon" size={24} variant="outline" className="text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">Your Links</h2>
              <p className="text-sm text-muted-foreground">{links.length} total links</p>
            </div>
          </div>
          
          {selectedLinks.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {selectedLinks.length} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-error text-error-foreground font-medium rounded-lg shadow-sm transition-all duration-250 ease-smooth hover:shadow-md hover:-translate-y-[1px] active:scale-[0.97] flex items-center gap-2"
              >
                <Icon name="TrashIcon" size={18} variant="solid" />
                Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedLinks.length === links.length && links.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-primary"
                />
              </th>
              <th 
                className="px-6 py-4 text-left text-sm font-semibold text-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('originalUrl')}
              >
                <div className="flex items-center gap-2">
                  Original URL
                  <Icon name="ChevronUpDownIcon" size={16} variant="outline" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-sm font-semibold text-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('shortCode')}
              >
                <div className="flex items-center gap-2">
                  Short Code
                  <Icon name="ChevronUpDownIcon" size={16} variant="outline" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-sm font-semibold text-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center gap-2">
                  Created
                  <Icon name="ChevronUpDownIcon" size={16} variant="outline" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-sm font-semibold text-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('clicks')}
              >
                <div className="flex items-center gap-2">
                  Clicks
                  <Icon name="ChevronUpDownIcon" size={16} variant="outline" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Status
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedLinks.map((link) => (
              <tr key={link.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedLinks.includes(link.id)}
                    onChange={(e) => handleSelectLink(link.id, e.target.checked)}
                    className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-primary"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <p className="text-sm text-foreground truncate" title={link.originalUrl}>
                      {link.originalUrl}
                    </p>
                    {link.customAlias && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Alias: {link.customAlias}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <code className="px-2 py-1 bg-muted rounded text-sm text-primary font-mono">
                    {link.shortCode}
                  </code>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-foreground">{link.createdAt}</p>
                  {link.expirationDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Expires: {link.expirationDate}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-foreground">
                    {link.clicks.toLocaleString()}
                  </p>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(link.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onCopy(link.shortUrl)}
                      className="p-2 rounded-md hover:bg-muted transition-all duration-250"
                      title="Copy short URL"
                    >
                      <Icon name="ClipboardDocumentIcon" size={18} variant="outline" />
                    </button>
                    <Link
                      href={`/link-analytics?code=${link.shortCode}`}
                      className="p-2 rounded-md hover:bg-muted transition-all duration-250"
                      title="View analytics"
                    >
                      <Icon name="ChartBarIcon" size={18} variant="outline" />
                    </Link>
                    <button
                      onClick={() => setExpandedQrLinkId((current) => current === link.id ? null : link.id)}
                      className="p-2 rounded-md hover:bg-muted transition-all duration-250"
                      title="QR code"
                    >
                      <Icon name="QrCodeIcon" size={18} variant="outline" />
                    </button>
                    <button
                      onClick={() => openEditModal(link)}
                      className="p-2 rounded-md hover:bg-muted transition-all duration-250"
                      title="Edit link"
                    >
                      <Icon name="PencilIcon" size={18} variant="outline" />
                    </button>
                    <button
                      onClick={() => onDelete(link.id)}
                      className="p-2 rounded-md hover:bg-error/10 text-error transition-all duration-250"
                      title="Delete link"
                    >
                      <Icon name="TrashIcon" size={18} variant="outline" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sortedLinks.map((link) => (
              expandedQrLinkId === link.id ? (
                <tr key={`${link.id}-qr`} className="bg-muted/20">
                  <td colSpan={7} className="px-6 py-5">
                    <div className="flex items-center gap-6 rounded-xl border border-border bg-card p-4">
                      <StyledQrCode
                        data={link.shortUrl}
                        qrCodeDataUrl={link.qrCodeDataUrl}
                        qrStyle={link.qrStyle}
                        size={112}
                        imageClassName="border border-border bg-muted p-2"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">/{link.shortCode}</p>
                        <p className="text-sm text-muted-foreground truncate">{link.shortUrl}</p>
                        <div className="mt-4 flex items-center gap-3">
                          <button
                            onClick={() => handleQrDownload(link)}
                            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 transition-all duration-250 hover:shadow-md"
                          >
                            <Icon name="ArrowDownTrayIcon" size={16} variant="outline" />
                            Download PNG
                          </button>
                          <button
                            onClick={() => onCopy(link.shortUrl)}
                            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium flex items-center gap-2 transition-all duration-250 hover:shadow-md"
                          >
                            <Icon name="ShareIcon" size={16} variant="outline" />
                            Share Link
                          </button>
                          <button
                            onClick={() => onStatusChange(link.id, link.status === 'active' ? 'expired' : 'active')}
                            className="px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-medium flex items-center gap-2 transition-all duration-250 hover:bg-muted/80"
                          >
                            <Icon name="BoltIcon" size={16} variant="outline" />
                            Mark as {link.status === 'active' ? 'Expired' : 'Active'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : null
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden divide-y divide-border">
        {sortedLinks.map((link) => (
          <div key={link.id} className="p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedLinks.includes(link.id)}
                onChange={(e) => handleSelectLink(link.id, e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-primary"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate" title={link.originalUrl}>
                      {link.originalUrl}
                    </p>
                    {link.customAlias && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Alias: {link.customAlias}
                      </p>
                    )}
                  </div>
                  {getStatusBadge(link.status)}
                </div>
                
                <div className="flex items-center gap-4 mb-3">
                  <code className="px-2 py-1 bg-muted rounded text-xs text-primary font-mono">
                    {link.shortCode}
                  </code>
                  <span className="text-xs text-muted-foreground">{link.createdAt}</span>
                  <span className="text-xs font-semibold text-foreground">
                    {link.clicks.toLocaleString()} clicks
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onCopy(link.shortUrl)}
                    className="flex-1 px-3 py-2 bg-muted text-foreground text-sm font-medium rounded-lg transition-all duration-250 hover:bg-muted/80 active:scale-[0.97] flex items-center justify-center gap-2"
                  >
                    <Icon name="ClipboardDocumentIcon" size={16} variant="outline" />
                    Copy
                  </button>
                  <Link
                    href={`/link-analytics?code=${link.shortCode}`}
                    className="flex-1 px-3 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg transition-all duration-250 hover:shadow-md active:scale-[0.97] flex items-center justify-center gap-2"
                  >
                    <Icon name="ChartBarIcon" size={16} variant="outline" />
                    Analytics
                  </Link>
                  <button
                    onClick={() => setExpandedQrLinkId((current) => current === link.id ? null : link.id)}
                    className="px-3 py-2 bg-muted text-foreground text-sm font-medium rounded-lg transition-all duration-250 hover:bg-muted/80 active:scale-[0.97]"
                  >
                    <Icon name="QrCodeIcon" size={16} variant="outline" />
                  </button>
                  <button
                    onClick={() => openEditModal(link)}
                    className="px-3 py-2 bg-muted text-foreground text-sm font-medium rounded-lg transition-all duration-250 hover:bg-muted/80 active:scale-[0.97]"
                  >
                    <Icon name="PencilIcon" size={16} variant="outline" />
                  </button>
                  <button
                    onClick={() => onDelete(link.id)}
                    className="px-3 py-2 bg-error/10 text-error text-sm font-medium rounded-lg transition-all duration-250 hover:bg-error/20 active:scale-[0.97]"
                  >
                    <Icon name="TrashIcon" size={16} variant="outline" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {links.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="LinkIcon" size={48} variant="outline" className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No links yet</h3>
          <p className="text-sm text-muted-foreground">Create your first short link to get started</p>
        </div>
      )}

      {editingLink && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-[560px] rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Edit short link</h3>
                <p className="text-sm text-muted-foreground">Update destination URL, alias, or expiration date.</p>
              </div>
              <button onClick={closeEditModal} className="p-2 rounded-md hover:bg-muted transition-all duration-250">
                <Icon name="XMarkIcon" size={18} variant="outline" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Original URL</label>
                <input
                  value={editForm.originalUrl}
                  onChange={(event) => setEditForm((previous) => ({ ...previous, originalUrl: event.target.value }))}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Custom Alias</label>
                  <input
                    value={editForm.customAlias}
                    onChange={(event) => setEditForm((previous) => ({ ...previous, customAlias: event.target.value }))}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Expiration Date</label>
                  <input
                    type="date"
                    value={editForm.expirationDate}
                    onChange={(event) => setEditForm((previous) => ({ ...previous, expirationDate: event.target.value }))}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <QrStyleConfigurator
                value={editForm.qrStyle}
                onChange={(qrStyle) => setEditForm((previous) => ({ ...previous, qrStyle }))}
                previewUrl={buildPreviewUrl(editingLink, editForm.customAlias)}
                fallbackQrCodeDataUrl={editingLink.qrCodeDataUrl}
                title="Restyle QR code"
                description="Update the saved QR appearance for this short link."
                disabled={isSavingEdit}
              />

              {editError && <p className="text-sm text-error">{editError}</p>}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={closeEditModal} className="px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-medium transition-all duration-250 hover:bg-muted/80">Cancel</button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSavingEdit}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all duration-250 hover:shadow-md disabled:opacity-60 flex items-center gap-2"
                >
                  <Icon name={isSavingEdit ? 'ArrowPathIcon' : 'CheckIcon'} size={16} variant="outline" className={isSavingEdit ? 'animate-spin' : ''} />
                  {isSavingEdit ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}