'use client';

import { useState } from 'react';
import { createRoleTemplate, updateRoleTemplate } from '@/app/actions/roles';

export default function AdminRolesView({ initialTemplates }) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null); // null if creating
  const [loading, setLoading] = useState(false);

  // Form State
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [requiredTools, setRequiredTools] = useState('');

  const openCreate = () => {
    setEditingTemplate(null);
    setId('');
    setTitle('');
    setDescription('');
    setSystemPrompt('');
    setRequiredTools('');
    setIsModalOpen(true);
  };

  const openEdit = (template) => {
    setEditingTemplate(template);
    setId(template.id);
    setTitle(template.title_default);
    setDescription(template.description);
    setSystemPrompt(template.system_prompt || '');
    setRequiredTools((template.required_tools || []).join(', '));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const toolArray = requiredTools.split(',').map(t => t.trim()).filter(Boolean);
      
      if (editingTemplate) {
        await updateRoleTemplate(editingTemplate.id, {
          title_default: title,
          description,
          system_prompt: systemPrompt,
          required_tools: toolArray
        });
        
        // Optimistic update
        setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? {
          ...t, title_default: title, description, system_prompt: systemPrompt, required_tools: toolArray
        } : t));
      } else {
        const res = await createRoleTemplate({
          id,
          title_default: title,
          description,
          system_prompt: systemPrompt,
          required_tools: toolArray
        });
        setTemplates([res.data, ...templates]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, marginLeft: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Role Templates</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Manage the catalog of deployable AI roles globally.</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary" style={{ padding: '0.7rem 1.5rem', background: 'var(--accent-color)', color: '#fff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>
          + Create Template
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {templates.map(template => (
          <div key={template.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '0.5rem', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>{template.title_default}</h3>
              <span style={{ fontSize: '0.8rem', background: 'rgba(59,130,246,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', color: 'var(--accent-color)' }}>
                {template.id}
              </span>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', minHeight: '40px' }}>
              {template.description}
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Required Tools</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(template.required_tools || []).map(tool => (
                  <span key={tool} style={{ fontSize: '0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--text-primary)' }}>
                    {tool}
                  </span>
                ))}
                {(!template.required_tools || template.required_tools.length === 0) && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>None</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => openEdit(template)} style={{ flex: 1, padding: '0.6rem', background: 'transparent', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.3rem', cursor: 'pointer' }}>Edit Role</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <form onSubmit={handleSubmit} style={{ background: 'var(--bg-primary)', padding: '2rem', borderRadius: '0.5rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              {editingTemplate ? 'Edit Role Template' : 'Create Role Template'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {!editingTemplate && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>ID (e.g. sales_rep)</label>
                  <input type="text" value={id} onChange={e => setId(e.target.value)} required style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.3rem' }} />
                </div>
              )}
              
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.3rem' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={2} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.3rem' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>System Prompt Template</label>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>Use {'{company_name}'} and other variables to inject context.</p>
                <textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} required rows={8} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.3rem', fontFamily: 'monospace' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Required Tools (comma separated)</label>
                <input type="text" value={requiredTools} onChange={e => setRequiredTools(e.target.value)} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', borderRadius: '0.3rem' }} placeholder="draft_email, search_crm" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.8rem 1.5rem', background: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ padding: '0.8rem 1.5rem', background: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: '0.3rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Saving...' : 'Save Template'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
