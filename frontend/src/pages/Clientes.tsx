import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button"
import { ScrollHeader } from "../components/scroll-header"
import { Input } from "../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { UserCircle, Search, Plus, Edit } from "lucide-react"
import { Link } from "react-router-dom"
import { ApiService } from "../services/api"
import { PaymentStatus, PhotoDeliveryStatus } from "../types"
import { getPaymentStatusColor, getPhotoDeliveryStatusColor, getPaymentStatusLabel, getPhotoDeliveryStatusLabel } from "../utils/helpers"

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  sessions?: Array<{
    id: string;
    date: string;
    status: string;
    serviceType: string;
    photoDeliveryStatus: string;
    payment?: {
      amount: number;
      status: string;
      method: string;
    };
  }>;
  payments?: Array<{
    id: string;
    amount: number;
    status: string;
    method: string;
  }>;
}

const ClientesPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await ApiService.getAllClients(1, 50); // Buscar mais clientes
        setClients(response.clients || []);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const filteredClients = clients.filter(client => {
    const nameMatch = `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return nameMatch || emailMatch;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background">
          <div className="container flex h-16 items-center">
            <ScrollHeader />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando clientes...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <ScrollHeader />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground">Controle de Clientes</h1>
            <div className="flex items-center gap-2">
              <Link to="/clientes/adicionar-servico">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Serviço
                </Button>
              </Link>
              <Link to="/clientes/cadastro">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Buscar cliente..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={serviceFilter} onValueChange={(value) => setServiceFilter(value === 'all' ? '' : value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Todos os serviços" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os serviços</SelectItem>
                <SelectItem value="ACOMPANHAMENTO">Acompanhamento</SelectItem>
                <SelectItem value="ANIVERSARIO">Aniversário</SelectItem>
                <SelectItem value="BOOK">Book</SelectItem>
                <SelectItem value="CASAL">Casal</SelectItem>
                <SelectItem value="CASAMENTO">Casamento</SelectItem>
                <SelectItem value="DIA_DAS_MAES">Dia das Mães</SelectItem>
                <SelectItem value="ENSAIO_FAMILIA">Ensaio Família</SelectItem>
                <SelectItem value="ENSAIO_FEMININO">Ensaio Feminino</SelectItem>
                <SelectItem value="ENSAIO_GESTANTE">Ensaio Gestante</SelectItem>
                <SelectItem value="ENSAIO_INFANTIL">Ensaio Infantil</SelectItem>
                <SelectItem value="EVENTO">Evento</SelectItem>
                <SelectItem value="FORMATURA">Formatura</SelectItem>
                <SelectItem value="INSTITUCIONAL">Institucional</SelectItem>
                <SelectItem value="MEMORIAS_POLAROID">Memórias Polaroid</SelectItem>
                <SelectItem value="NEWBORN">Newborn</SelectItem>
                <SelectItem value="PARTO">Parto</SelectItem>
                <SelectItem value="SMASH_THE_CAKE">Smash the Cake</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="PENDING">A receber</SelectItem>
                <SelectItem value="COMPLETED">Recebido</SelectItem>
                <SelectItem value="OVERDUE">Em atraso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-muted/50">
                  <TableHead className="text-foreground font-semibold">Cliente</TableHead>
                  <TableHead className="text-foreground font-semibold">Último Serviço</TableHead>
                  <TableHead className="text-foreground font-semibold">Data</TableHead>
                  <TableHead className="text-foreground font-semibold">Valor</TableHead>
                  <TableHead className="text-foreground font-semibold">Status Pagamento</TableHead>
                  <TableHead className="text-foreground font-semibold">Fotos</TableHead>
                  <TableHead className="text-right text-foreground font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {loading ? 'Carregando...' : 'Nenhum cliente encontrado'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => {
                    const lastSession = client.sessions?.[0];
                    const lastPayment = client.payments?.[0] || lastSession?.payment;
                    const hasPendingPayment = lastPayment?.status === PaymentStatus.PENDING;
                    
                    return (
                      <TableRow 
                        key={client.id} 
                        className={`cursor-pointer hover:bg-muted/50 border-b border-border ${
                          hasPendingPayment ? 'bg-red-50 dark:bg-red-950/20' : ''
                        }`}
                      >
                        <TableCell>
                          <div className="flex items-center">
                            <UserCircle className="h-8 w-8 mr-2 text-muted-foreground" />
                            <div className={`p-2 rounded-md ${hasPendingPayment ? 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800' : ''}`}>
                              <div className={`font-medium ${hasPendingPayment ? 'text-red-800 dark:text-red-200' : 'text-foreground'}`}>
                                {client.firstName} {client.lastName}
                              </div>
                              <div className={`text-sm ${hasPendingPayment ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
                                {client.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground">
                          {lastSession?.serviceType ? (
                            <span className="capitalize">{lastSession.serviceType}</span>
                          ) : (
                            <span className="text-muted-foreground italic">Nenhum serviço</span>
                          )}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {lastSession?.date ? (
                            formatDate(lastSession.date)
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-foreground font-medium">
                          {lastPayment?.amount ? (
                            `R$ ${lastPayment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {lastPayment?.status ? (
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusColor(lastPayment.status as PaymentStatus)}`}>
                              {getPaymentStatusLabel(lastPayment.status as PaymentStatus)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border">
                              Sem pagamento
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {lastSession?.photoDeliveryStatus ? (
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPhotoDeliveryStatusColor(lastSession.photoDeliveryStatus as PhotoDeliveryStatus)}`}>
                              {getPhotoDeliveryStatusLabel(lastSession.photoDeliveryStatus as PhotoDeliveryStatus)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border">
                              Sem fotos
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
                            <Link to={`/clientes/${client.id}`}>
                              <Button variant="ghost" size="sm">
                                Ver detalhes
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
      <footer className="border-t bg-muted/50">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="font-bold text-xl text-foreground">ESTUDIO CLOSER</div>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 Estudio Closer. Sistema de Gerenciamento.</p>
        </div>
      </footer>
    </div>
  )
}

export default ClientesPage; 