import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useCategories } from '../hooks/useCategories';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import type { Category } from '../types/category.types';

// ─── Category Card ────────────────────────────────────────────────────────────

interface CategoryCardProps {
  category: Category;
  onDelete: (id: string) => void;
}

function CategoryCard({ category, onDelete }: CategoryCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
          style={{ backgroundColor: category.color ?? '#6b7280' }}
        >
          {category.icon ?? '📁'}
        </div>
        <span className="font-medium text-sm">{category.name}</span>
      </div>
      <button
        onClick={() => onDelete(category.id)}
        className="text-xs text-muted-foreground hover:text-red-500 transition-colors px-2 py-1 rounded"
        aria-label={`Eliminar ${category.name}`}
      >
        ✕
      </button>
    </div>
  );
}

// ─── New Category Modal ───────────────────────────────────────────────────────

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, icon: string, color: string) => Promise<void>;
}

function CategoryModal({ open, onClose, onSave }: CategoryModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('#6b7280');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('El nombre es requerido'); return; }
    setSaving(true);
    try {
      await onSave(name.trim(), icon.trim(), color);
      setName(''); setIcon(''); setColor('#6b7280'); setError('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-card border border-border rounded-xl p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold mb-4">Nueva categoría</Dialog.Title>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ej: Viajes"
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ícono (emoji)</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Ej: ✈️"
                maxLength={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-input"
                />
                <span className="text-sm text-muted-foreground">{color}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-md border border-border hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function CategoriesPage() {
  const { categories, loading, error, createCategory, deleteCategory } = useCategories();
  const [modalOpen, setModalOpen] = useState(false);

  async function handleSave(name: string, icon: string, color: string) {
    await createCategory({ name, icon: icon || undefined, color });
  }

  async function handleDelete(id: string) {
    await deleteCategory(id);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          + Nueva categoría
        </button>
      </div>

      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : error ? (
        <p className="text-sm text-red-500 py-4">{error}</p>
      ) : categories.length === 0 ? (
        <p className="text-muted-foreground text-sm">No hay categorías. Crea una nueva.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <CategoryModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} />
    </div>
  );
}
