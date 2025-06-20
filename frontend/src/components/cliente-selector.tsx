"use client"

import React, { useState, useEffect } from "react"
import { UserCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { ApiService } from "../services/api"

interface Cliente {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ClienteSelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

export function ClienteSelector({ value = "", onValueChange, placeholder = "Selecione um cliente..." }: ClienteSelectorProps) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await ApiService.getAllClients(1, 100);
        setClientes(response.clients || []);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        setClientes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Carregando clientes..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {clientes.map((cliente) => (
          <SelectItem key={cliente.id} value={cliente.id}>
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="bg-gray-100">
                  <UserCircle className="w-4 h-4 text-gray-600" />
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="text-sm font-medium">{cliente.firstName} {cliente.lastName}</div>
                <div className="text-xs text-muted-foreground">{cliente.email}</div>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
