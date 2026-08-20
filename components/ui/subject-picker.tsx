'use client';

/**
 * Multi-level subject picker.
 *
 * Teacher mode: Pick a class, then select multiple subjects for that class.
 *               Builds up { "Class 9": ["Math", "Physics"], ... }
 *
 * Student mode: Single class selector + multiple subjects for that class.
 */

import { useState } from 'react';
import { IconChevronDown, IconPlus, IconX } from '@tabler/icons-react';

interface SubjectPickerProps {
  catalog: Record<string, string[]>;
  /** Current value: { "Class 9": ["Math"], ... } */
  value: Record<string, string[]>;
  onChange: (next: Record<string, string[]>) => void;
  /** If true, only one class can be selected (student mode) */
  singleClass?: boolean;
}

export function SubjectPicker({
  catalog,
  value,
  onChange,
  singleClass = false,
}: SubjectPickerProps) {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const classes = Object.keys(catalog);

  function addClass() {
    if (!selectedClass || value[selectedClass] !== undefined) return;
    onChange({ ...value, [selectedClass]: [] });
    setSelectedClass('');
  }

  function removeClass(cls: string) {
    const next = { ...value };
    delete next[cls];
    onChange(next);
  }

  function toggleSubject(cls: string, subject: string) {
    const current = value[cls] ?? [];
    const next = current.includes(subject)
      ? current.filter((s) => s !== subject)
      : [...current, subject];
    onChange({ ...value, [cls]: next });
  }

  function handleSingleClassChange(cls: string) {
    // In student mode, clear previous class selection
    if (singleClass) {
      onChange({ [cls]: value[cls] ?? [] });
    }
    setSelectedClass(cls);
  }

  const activeClasses = Object.keys(value);

  return (
    <div className="space-y-4">
      {/* Class selector row */}
      {(!singleClass || activeClasses.length === 0) && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={selectedClass}
              onChange={(e) =>
                singleClass
                  ? handleSingleClassChange(e.target.value)
                  : setSelectedClass(e.target.value)
              }
              id="subject-picker-class-select"
              className="flex h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            >
              <option value="">Select a class / level…</option>
              {classes
                .filter((c) => !value[c]) // hide already-added classes (teacher mode)
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
            <IconChevronDown
              size={16}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>
          {!singleClass && (
            <button
              type="button"
              onClick={addClass}
              disabled={!selectedClass}
              id="btn-add-class"
              className="flex h-10 items-center gap-1.5 rounded-lg border border-primary bg-primary/10 px-3 text-sm font-medium text-primary hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <IconPlus size={15} />
              Add
            </button>
          )}
        </div>
      )}

      {/* Selected classes + subjects */}
      {activeClasses.map((cls) => {
        const subjects = catalog[cls] ?? [];
        const chosen = value[cls] ?? [];

        return (
          <div
            key={cls}
            className="rounded-xl border border-border bg-muted/30 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">{cls}</p>
              {!singleClass && (
                <button
                  type="button"
                  onClick={() => removeClass(cls)}
                  id={`btn-remove-class-${cls.replace(/\s+/g, '-')}`}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <IconX size={15} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => {
                const active = chosen.includes(subject);
                return (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(cls, subject)}
                    id={`btn-subject-${cls.replace(/\s+/g, '-')}-${subject.replace(/\s+/g, '-')}`}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-primary'
                      }`}
                  >
                    {subject}
                  </button>
                );
              })}
            </div>

            {chosen.length === 0 && (
              <p className="text-xs text-muted-foreground italic">
                Select at least one subject above
              </p>
            )}
          </div>
        );
      })}

      {activeClasses.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-2">
          {singleClass ? 'Choose a class to see available subjects.' : 'Add a class to get started.'}
        </p>
      )}
    </div>
  );
}
