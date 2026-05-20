import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'frontend', 'src', 'pages', 'Admin.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add Briefcase
content = content.replace('Newspaper,\n} from \'lucide-react\';', 'Newspaper,\n  Briefcase,\n} from \'lucide-react\';');

// 2. Add GymClient
content = content.replace('Blog,\n} from \'../lib/api\';', 'Blog,\n  GymClient,\n} from \'../lib/api\';');

// 3. Add clients to AdminTab
content = content.replace('  | \'blogs\';', '  | \'blogs\'\n  | \'clients\';');

// 4. Add to navItems
content = content.replace('{ id: \'analytics\', label: \'Analytics\', icon: BarChart3 },\n];', '{ id: \'analytics\', label: \'Analytics\', icon: BarChart3 },\n  { id: \'clients\', label: \'Client Mgmt\', icon: Briefcase },\n];');

// 5. Add state variables
content = content.replace('  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);', '  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);\n\n  const [gymClients, setGymClients] = useState<GymClient[]>([]);\n  const [editingClient, setEditingClient] = useState<Partial<GymClient> | null>(null);');

// 6. loadAllData array
content = content.replace('api.getBlogs().catch(() => []),\n      ]);', 'api.getBlogs().catch(() => []),\n        api.getClients().catch(() => []),\n      ]);');

content = content.replace('const [contactsData, usersData, trainersData, heroesData, offerData, membershipsData, galleryData, blogsData] = await Promise.all([', 'const [contactsData, usersData, trainersData, heroesData, offerData, membershipsData, galleryData, blogsData, clientsData] = await Promise.all([');

content = content.replace('setBlogs(blogsData);\n    } finally {', 'setBlogs(blogsData);\n      setGymClients(clientsData);\n    } finally {');

// 7. Handlers before if (!isAuthenticated)
const handlers = `
  const saveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    setSavingKey('client');
    try {
      if (editingClient.id) {
        const updated = await api.updateClient(editingClient.id, editingClient);
        setGymClients((items) => items.map((item) => item.id === updated.id ? updated : item));
      } else {
        const created = await api.createClient(editingClient);
        setGymClients((items) => [created, ...items]);
      }
      setEditingClient(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save client.');
    } finally {
      setSavingKey('');
    }
  };

  const deleteClient = async (id: string) => {
    if (!window.confirm('Delete this client?')) return;
    try {
      await api.deleteClient(id);
      setGymClients((items) => items.filter((item) => item.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete client.');
    }
  };

  const uploadClientLogo = async (file?: File) => {
    if (!file) return;
    setSavingKey('client-upload');
    try {
      const base64 = await fileToBase64(file);
      const { url } = await api.uploadAsset({ filename: \`client-\${Date.now()}.\${file.name.split('.').pop()}\`, base64 });
      if (editingClient) {
        setEditingClient((prev) => prev ? { ...prev, logoUrl: url } : { logoUrl: url });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setSavingKey('');
    }
  };

  if (!isAuthenticated) {`;

content = content.replace('  if (!isAuthenticated) {', handlers);

// 8. Render Panel
const renderPanel = `          {activeTab === 'analytics' && (
            <AnalyticsPanel metrics={metrics} memberships={memberships} trainers={trainers} />
          )}
          {activeTab === 'clients' && (
            <ClientsPanel
              clients={gymClients}
              editingClient={editingClient}
              setEditingClient={setEditingClient}
              onSave={saveClient}
              onDelete={deleteClient}
              onUploadImage={uploadClientLogo}
              savingKey={savingKey}
            />
          )}`;

content = content.replace(`          {activeTab === 'analytics' && (
            <AnalyticsPanel metrics={metrics} memberships={memberships} trainers={trainers} />
          )}`, renderPanel);


// 9. titleFor
content = content.replace('analytics: \'Admin: Expense/Profit Analytics\',\n  };', 'analytics: \'Admin: Expense/Profit Analytics\',\n    clients: \'Admin: Client Management\',\n  };');

// 10. Append ClientsPanel
const clientsPanelCode = \`

function ClientsPanel({
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
  onUploadImage: (file?: File) => void;
  savingKey: string;
}) {
  const AVAILABLE_FEATURES = ['blog', 'ecommerce', 'ai_plans', 'trainers', 'gallery', 'memberships'];

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
          <button onClick={() => setEditingClient({ name: '', slug: '', features: [], primaryColor: '#00E5FF', secondaryColor: '#0A0F24', status: 'active' })} className="primary-button text-xs py-1.5">
            + Add Client
          </button>
        </div>
        
        <div className="grid gap-3">
          {clients.map((client) => (
            <div key={client.id} className={\`panel-card cursor-pointer transition hover:border-[#0f8f9a] \${editingClient?.id === client.id ? 'border-[#0f8f9a] bg-white/70' : ''}\`} onClick={() => setEditingClient(client)}>
              <div className="flex items-center gap-4">
                {client.logoUrl ? (
                  <img src={client.logoUrl} alt={client.name} className="h-10 w-10 rounded-xl object-cover bg-white" />
                ) : (
                  <div className="h-10 w-10 rounded-xl bg-[#dff4f2] text-[#0f8f9a] flex items-center justify-center font-black">{client.name.charAt(0)}</div>
                )}
                <div>
                  <h4 className="font-black">{client.name}</h4>
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
              <div className="flex gap-3">
                {editingClient.logoUrl && (
                  <img src={editingClient.logoUrl} alt="Logo" className="h-12 w-12 rounded-xl object-cover border border-[#d7e8e8] bg-white" />
                )}
                <input value={editingClient.logoUrl || ''} onChange={(e) => setEditingClient({ ...editingClient, logoUrl: e.target.value })} className="admin-light-input flex-1" placeholder="URL or Upload ->" />
                <label className="secondary-button cursor-pointer whitespace-nowrap">
                  <Upload className="h-4 w-4" />
                  {savingKey === 'client-upload' ? 'Uploading...' : 'Upload'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => onUploadImage(e.target.files?.[0])} />
                </label>
              </div>
            </Field>

            <Field label="Enabled Features">
              <div className="flex flex-wrap gap-2 mt-2">
                {AVAILABLE_FEATURES.map((feature) => (
                  <label key={feature} className={\`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition \${(editingClient.features || []).includes(feature) ? 'bg-[#0f8f9a] text-white shadow-md' : 'bg-white/60 text-[#6b8b8f] border border-[#d7e8e8] hover:bg-[#dff4f2]'}\`}>
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
\`;

content += clientsPanelCode;

fs.writeFileSync(file, content, 'utf8');
console.log('Admin.tsx updated successfully');
