"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

const AccordionContext = React.createContext<{ openItems: string[]; toggle: (value: string) => void }>({ openItems: [], toggle: () => {} })

function Accordion({ children, type = "single", className }: { children: React.ReactNode; type?: "single" | "multiple"; className?: string }) {
  const [openItems, setOpenItems] = React.useState<string[]>([])
  const toggle = (value: string) => {
    setOpenItems(prev => {
      if (prev.includes(value)) return prev.filter(v => v !== value)
      return type === "single" ? [value] : [...prev, value]
    })
  }
  return <AccordionContext.Provider value={{ openItems, toggle }}><div className={cn("w-full", className)}>{children}</div></AccordionContext.Provider>
}

function AccordionItem({ children, value, className }: { children: React.ReactNode; value: string; className?: string }) {
  return <div className={cn("border-b border-zinc-200 dark:border-zinc-700/50", className)} data-value={value}>{React.Children.map(children, child => React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<{ itemValue?: string }>, { itemValue: value }) : child)}</div>
}

function AccordionTrigger({ children, className, itemValue }: { children: React.ReactNode; className?: string; itemValue?: string }) {
  const { openItems, toggle } = React.useContext(AccordionContext)
  const isOpen = itemValue ? openItems.includes(itemValue) : false
  return (
    <button onClick={() => itemValue && toggle(itemValue)} className={cn("flex w-full items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180", className)} data-state={isOpen ? "open" : "closed"}>
      {children}
      <ChevronDown className={cn("h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200", isOpen && "rotate-180")} />
    </button>
  )
}

function AccordionContent({ children, className, itemValue }: { children: React.ReactNode; className?: string; itemValue?: string }) {
  const { openItems } = React.useContext(AccordionContext)
  const isOpen = itemValue ? openItems.includes(itemValue) : false
  if (!isOpen) return null
  return <div className={cn("overflow-hidden text-sm pb-4", className)}>{children}</div>
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
