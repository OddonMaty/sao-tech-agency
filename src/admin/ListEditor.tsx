import { useRef } from "react"
import { ArrowDown, ArrowUp, Plus, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input, Select, Textarea } from "@/components/ui/input"
import { api } from "./api"

export type F = { k: string; l: string; t?: "area" | "lines" | "select" | "img"; o?: string[] }

export async function upload(file: File): Promise<string> {
  const fd = new FormData(); fd.append("file", file)
  return (await api("admin.php?a=upload", undefined, fd)).url
}

function ImgField({ v, onChange }: { v: string; onChange: (s: string) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div className="flex items-center gap-2">
      {v && <img src={v} alt="" className="h-10 w-14 shrink-0 rounded border bg-white object-contain" />}
      <Input value={v} onChange={(e) => onChange(e.target.value)} placeholder="/uploads/… ou /img/…" />
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; try { onChange(await upload(f)) } catch (x) { alert((x as Error).message) } e.target.value = "" }} />
      <Button type="button" variant="outline" className="shrink-0" onClick={() => ref.current?.click()} aria-label="Téléverser une image"><Upload className="h-4 w-4" /></Button>
    </div>
  )
}

export default function ListEditor({ items, set, fields, blank, titleKey, label = "Ajouter" }: { items: any[]; set: (v: any[]) => void; fields: F[]; blank: any; titleKey: string; label?: string }) {
  const up = (i: number, k: string, v: any) => set(items.map((x, j) => (j === i ? { ...x, [k]: v } : x)))
  const move = (i: number, d: number) => { const a = [...items]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; set(a) }
  return (
    <div className="space-y-4">
      {items.length === 0 && <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">Aucun élément pour l'instant.</p>}
      {items.map((it, i) => (
        <div key={i} className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="min-w-0 truncate font-semibold">{it[titleKey] || `Élément ${i + 1}`}</p>
            <div className="flex shrink-0 gap-1">
              <button type="button" aria-label="Monter" onClick={() => move(i, -1)} className="rounded-lg p-2 hover:bg-muted"><ArrowUp className="h-4 w-4" /></button>
              <button type="button" aria-label="Descendre" onClick={() => move(i, 1)} className="rounded-lg p-2 hover:bg-muted"><ArrowDown className="h-4 w-4" /></button>
              <button type="button" aria-label="Supprimer" onClick={() => confirm("Supprimer cet élément ?") && set(items.filter((_, j) => j !== i))} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((f) => {
              const v = it[f.k] ?? ""; const wide = f.t === "area" || f.t === "lines" || f.t === "img"
              return (
                <div key={f.k} className={wide ? "sm:col-span-2" : ""}>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">{f.l}{f.t === "lines" ? " (une par ligne)" : ""}</label>
                  {f.t === "area" && <Textarea value={v} onChange={(e) => up(i, f.k, e.target.value)} />}
                  {f.t === "lines" && <Textarea value={Array.isArray(v) ? v.join("\n") : v} onChange={(e) => up(i, f.k, e.target.value.split("\n"))} />}
                  {f.t === "select" && <Select value={v} onChange={(e) => up(i, f.k, e.target.value)}>{f.o!.map((o) => <option key={o} value={o}>{o || "(automatique)"}</option>)}</Select>}
                  {f.t === "img" && <ImgField v={v} onChange={(s) => up(i, f.k, s)} />}
                  {!f.t && <Input value={v} onChange={(e) => up(i, f.k, e.target.value)} />}
                </div>
              )
            })}
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => set([...items, JSON.parse(JSON.stringify(blank))])}><Plus className="h-4 w-4" />{label}</Button>
    </div>
  )
}
