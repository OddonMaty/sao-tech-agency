import * as React from "react"
import { cn } from "@/lib/utils"
const field = "flex w-full rounded-md border border-border bg-card px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...p }, ref) => <input ref={ref} className={cn(field, "h-10", className)} {...p} />)
Input.displayName = "Input"
const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...p }, ref) => <textarea ref={ref} className={cn(field, "min-h-[110px] py-2", className)} {...p} />)
Textarea.displayName = "Textarea"
const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, ...p }, ref) => <select ref={ref} className={cn(field, "h-10", className)} {...p} />)
Select.displayName = "Select"
export { Input, Textarea, Select }
