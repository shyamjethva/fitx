import React from 'react';
import { Briefcase, Trash2, Upload } from 'lucide-react';
import { GymClient } from '../lib/api';

const EmptyText = ({ label }: { label: string }) => (
  <div className="flex w-full items-center justify-center p-8 text-center text-sm font-bold text-[#6b8b8f] opacity-60">
    {label}
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-[#6b8b8f]">{label}</label>
    {children}
  </div>
);

const SaveButton = ({ onClick, saving }: { onClick: (e: React.FormEvent) => void; saving: boolean }) => (
  <button onClick={onClick} disabled={saving} className="primary-button w-full justify-center">
    {saving ? 'Saving...' : 'Save Details'}
  </button>
);

export function ClientsPanel({
  clients,
  editingClient,
  setEditingClient,
  onSave,
  onDelete,
  onUploadImage,
  savingKey,
}: {
  clients: GymClient[];
  editingClient: Partial<GymClient> | null;
  setEditingClient: React.Dispatch<React.SetStateAction<Partial<GymClient> | null>>;
  onSave: (e: React.FormEvent) => void;
  onDelete: (id: string) => void;
  onUploadImage: (type: 'logo' | 'qr', file?: File) => void;
  savingKey: string;
}) {
  const AVAILABLE_FEATURES = [
    'home', 'about', 'programs', 'transform', 'memberships', 
    'gallery', 'blog', 'contact_us', 'ai_plans', 'trainers'
  ];

  const handleFeatureToggle = (feature: string) => {
    if (!editingClient) return;
    const current = editingClient.features || [];
    if (current.includes(feature)) {
      setEditingClient({ ...editingClient, features: current.filter(f => f !== feature) });
    } else {
      setEditingClient({ ...editingClient, features: [...current, feature] });
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
      {/* Left: Client List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-xl">Clients</h3>
          <button onClick={() => setEditingClient({ name: '', slug: '', features: [], primaryColor: '#00E5FF', secondaryColor: '#0A0F24', status: 'active' })} className="primary-button text-xs py-1.5 px-3">
            + Add Client
          </button>
        </div>
        
        <div className="grid gap-3">
          {clients.map((client) => (
            <div key={client.id} className={`panel-card cursor-pointer transition hover:border-[#0f8f9a] ${editingClient?.id === client.id ? 'border-[#0f8f9a] bg-white/70' : ''}`} onClick={() => setEditingClient(client)}>
              <div className="flex items-center gap-4">
                {client.logoUrl ? (
                  <img src={client.logoUrl} alt={client.name} className="h-10 w-10 rounded-xl object-cover bg-white" />
                ) : (
                  <div className="h-10 w-10 rounded-xl bg-[#dff4f2] text-[#0f8f9a] flex items-center justify-center font-black">{client.name.charAt(0)}</div>
                )}
                <div>
                  <h4 className="font-black leading-tight">{client.name}</h4>
                  <p className="text-[10px] uppercase font-bold text-[#6b8b8f]">{client.slug}</p>
                </div>
              </div>
            </div>
          ))}
          {!clients.length && <EmptyText label="No clients found." />}
        </div>
      </div>

      {/* Right: Editor */}
      <div className="panel-card">
        {editingClient ? (
          <form onSubmit={onSave} className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#d7e8e8] pb-4">
              <h3 className="font-black text-xl">{editingClient.id ? 'Edit Client' : 'New Client'}</h3>
              {editingClient.id && (
                <button type="button" onClick={() => onDelete(editingClient.id!)} className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition">
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Client Name">
                <input required value={editingClient.name || ''} onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })} className="admin-light-input" placeholder="e.g. Titan Fitness" />
              </Field>
              <Field label="URL Slug (unique)">
                <input required value={editingClient.slug || ''} onChange={(e) => setEditingClient({ ...editingClient, slug: e.target.value.toLowerCase().replace(/\\s+/g, '-') })} className="admin-light-input" placeholder="e.g. titan-fitness" />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Primary Color">
                <div className="flex gap-2 items-center">
                  <input type="color" value={editingClient.primaryColor || '#00E5FF'} onChange={(e) => setEditingClient({ ...editingClient, primaryColor: e.target.value })} className="h-10 w-12 rounded-xl border-0 cursor-pointer" />
                  <input type="text" value={editingClient.primaryColor || '#00E5FF'} onChange={(e) => setEditingClient({ ...editingClient, primaryColor: e.target.value })} className="admin-light-input flex-1 uppercase" />
                </div>
              </Field>
              <Field label="Secondary Color">
                <div className="flex gap-2 items-center">
                  <input type="color" value={editingClient.secondaryColor || '#0A0F24'} onChange={(e) => setEditingClient({ ...editingClient, secondaryColor: e.target.value })} className="h-10 w-12 rounded-xl border-0 cursor-pointer" />
                  <input type="text" value={editingClient.secondaryColor || '#0A0F24'} onChange={(e) => setEditingClient({ ...editingClient, secondaryColor: e.target.value })} className="admin-light-input flex-1 uppercase" />
                </div>
              </Field>
            </div>

            <Field label="Logo Image">
              <div className="flex gap-3 items-center">
                {editingClient.logoUrl && (
                  <img src={editingClient.logoUrl} alt="Logo" className="h-12 w-12 rounded-xl object-cover border border-[#d7e8e8] bg-white" />
                )}
                <input value={editingClient.logoUrl || ''} onChange={(e) => setEditingClient({ ...editingClient, logoUrl: e.target.value })} className="admin-light-input flex-1" placeholder="Logo URL or Upload ->" />
                <label className="secondary-button cursor-pointer whitespace-nowrap m-0 h-11 flex items-center px-4">
                  <Upload className="h-4 w-4 mr-2" />
                  {savingKey === 'client-upload' ? 'Uploading...' : 'Upload Logo'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => onUploadImage('logo', e.target.files?.[0])} />
                </label>
              </div>
            </Field>

            <Field label="QR Code Image">
              <div className="flex gap-3 items-center">
                {editingClient.qrCodeUrl && (
                  <img src={editingClient.qrCodeUrl} alt="QR Code" className="h-12 w-12 rounded-xl object-cover border border-[#d7e8e8] bg-white" />
                )}
                <input value={editingClient.qrCodeUrl || ''} onChange={(e) => setEditingClient({ ...editingClient, qrCodeUrl: e.target.value })} className="admin-light-input flex-1" placeholder="QR Code URL or Upload ->" />
                <label className="secondary-button cursor-pointer whitespace-nowrap m-0 h-11 flex items-center px-4">
                  <Upload className="h-4 w-4 mr-2" />
                  {savingKey === 'client-qr-upload' ? 'Uploading...' : 'Upload QR Code'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => onUploadImage('qr', e.target.files?.[0])} />
                </label>
              </div>
            </Field>

            <Field label="Enabled Features">
              <div className="flex flex-wrap gap-2 mt-2">
                {AVAILABLE_FEATURES.map((feature) => (
                  <label key={feature} className={`cursor-pointer px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${(editingClient.features || []).includes(feature) ? 'bg-[#0f8f9a] text-white shadow-md' : 'bg-white/60 text-[#6b8b8f] border border-[#d7e8e8] hover:bg-[#dff4f2]'}`}>
                    <input type="checkbox" className="hidden" checked={(editingClient.features || []).includes(feature)} onChange={() => handleFeatureToggle(feature)} />
                    {feature.replace('_', ' ')}
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Status">
              <select value={editingClient.status || 'active'} onChange={(e) => setEditingClient({ ...editingClient, status: e.target.value })} className="admin-light-input">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </Field>

            <div className="pt-4 border-t border-[#d7e8e8]">
              <SaveButton onClick={onSave} saving={savingKey === 'client'} />
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center opacity-60">
            <Briefcase className="h-16 w-16 mb-4 text-[#0f8f9a]" />
            <h3 className="font-black text-xl">Client Editor</h3>
            <p className="text-sm font-bold text-[#6b8b8f] mt-2">Select a client from the list or create a new one to start editing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
