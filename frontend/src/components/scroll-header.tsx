"use client"

import React, { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { ModeToggle } from "./mode-toggle"
import Link from "next/link"
import { useRouter } from "next/router"
import { cn } from "../lib/utils"
import { Menu, Home, Users, CreditCard, Package, FileText } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"

export function ScrollHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const routes = [
    {
      href: "/",
      label: "Início",
      icon: Home,
      active: router.pathname === "/",
    },
    {
      href: "/clientes",
      label: "Clientes",
      icon: Users,
      active: router.pathname.startsWith("/clientes"),
    },
    {
      href: "/servicos",
      label: "Serviços & Sessões",
      icon: Package,
      active: router.pathname.startsWith("/servicos"),
    },
    {
      href: "/pagamentos",
      label: "Pagamentos & Faturas",
      icon: CreditCard,
      active: router.pathname.startsWith("/pagamentos"),
    },
    {
      href: "/relatorios",
      label: "Relatórios",
      icon: FileText,
      active: router.pathname.startsWith("/relatorios"),
    },
  ]

  return (
    <div
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 bg-background",
        isScrolled ? "border-b shadow-sm" : ""
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu de Navegação</SheetTitle>
                <SheetDescription>Acesse as funcionalidades do sistema</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      route.active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    )}
                  >
                    <route.icon className="h-4 w-4" />
                    {route.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2">
            <div className="font-bold text-xl text-foreground">CLOSER</div>
          </Link>
          <nav className="hidden lg:flex items-center space-x-6 ml-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  route.active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}
