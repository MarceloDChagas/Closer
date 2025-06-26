import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "../components/ui/button"
import { ScrollHeader } from "../components/scroll-header"
import { Input } from "../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Search, Camera, MapPin, Edit, Eye, Plus, DollarSign, Package } from "lucide-react"
import { SessionStatus, PhotoDeliveryStatus, ServiceType, Session, PaymentStatus } from "../types"
import { getSessionStatusColor, getSessionStatusLabel, getPhotoDeliveryStatusColor, getPhotoDeliveryStatusLabel, getServiceTypeLabel, formatCurrency, formatDate, formatDateTime } from "../utils/helpers"
import { ApiService } from "../services/api"
import { Link } from "react-router-dom"

interface SessionWithDetails extends Session {
  client?: {
  id: string;
    name: {
    firstName: string;
    lastName: string;
    };
    email: string;
    phone: string;
  };
  payment?: {
    id: string;
    amount: number;
    status: PaymentStatus;
    method: string;
  };
}

const ServicosPage: React.FC = () => {
  const [sessions, setSessions] = useState<SessionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [photoStatusFilter, setPhotoStatusFilter] = useState('all');

  // Stats das sessões
  const [sessionStats, setSessionStats] = useState({
    totalSessions: 0,
    pendingDeliveries: 0,
    pendingPayments: 0
  });

  const fetchSessions = useCallback(async () => {
      try {
      setLoading(true);
      const filters = {
        status: statusFilter !== 'all' ? statusFilter as SessionStatus : undefined,
        serviceType: serviceFilter !== 'all' ? serviceFilter as ServiceType : undefined,
        photoDeliveryStatus: photoStatusFilter !== 'all' ? photoStatusFilter as PhotoDeliveryStatus : undefined,
        page: 1,
        limit: 100
      };
      const response = await ApiService.getAllSessions(filters);
      
      // Handle both response structures (API response and mock data)
      let sessionsData;
      if (response.sessions) {
        // Real API response structure
        sessionsData = response.sessions;
      } else if (response.data) {
        // Mock data structure
        sessionsData = response.data;
      } else if (Array.isArray(response)) {
        // Direct array response
        sessionsData = response;
      } else {
        sessionsData = [];
      }
      
      setSessions(Array.isArray(sessionsData) ? sessionsData : []);
      } catch (error) {
        console.error('Erro ao carregar sessões:', error);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    }, [statusFilter, serviceFilter, photoStatusFilter]);

  const calculateSessionStats = useCallback(() => {
    if (!Array.isArray(sessions)) {
      setSessionStats({
        totalSessions: 0,
        pendingDeliveries: 0,
        pendingPayments: 0
      });
      return;
    }

    const stats = sessions.reduce((acc, session) => {
      acc.totalSessions++;

      if (session.photoDeliveryStatus === PhotoDeliveryStatus.NOT_DELIVERED || 
          session.photoDeliveryStatus === PhotoDeliveryStatus.PARTIAL_DELIVERED) {
        acc.pendingDeliveries++;
      }

      // Assumindo que se não há payment ou status é PENDING, então está pendente
      // Esta lógica pode precisar ser ajustada baseada na estrutura real dos dados
      if (!session.payment || session.payment?.status === PaymentStatus.PENDING) {
        acc.pendingPayments++;
      }

      return acc;
    }, {
      totalSessions: 0,
      pendingDeliveries: 0,
      pendingPayments: 0
    });

    setSessionStats(stats);
  }, [sessions]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    calculateSessionStats();
  }, [calculateSessionStats]);

  const handleMarkPhotoAsDelivered = async (sessionId: string) => {
    try {
      await ApiService.updateSessionPhotoDeliveryStatus(sessionId, PhotoDeliveryStatus.DELIVERED);
      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, photoDeliveryStatus: PhotoDeliveryStatus.DELIVERED, updatedAt: new Date().toISOString() }
            : session
        )
      );
    } catch (error) {
      console.error('Erro ao marcar foto como entregue:', error);
    }
  };

  const handleMarkPaymentAsCompleted = async (sessionId: string) => {
    try {
      // Assumindo que existe um método para atualizar o status do pagamento da sessão
      // Esta implementação pode precisar ser ajustada baseada na API real
      const session = sessions.find(s => s.id === sessionId);
      if (session?.payment?.id) {
        await ApiService.updatePaymentStatus(session.payment.id, PaymentStatus.COMPLETED);
        setSessions(prev => 
          prev.map(s => 
            s.id === sessionId && s.payment
              ? { ...s, payment: { ...s.payment, status: PaymentStatus.COMPLETED }, updatedAt: new Date().toISOString() }
              : s
          )
        );
      }
    } catch (error) {
      console.error('Erro ao marcar pagamento como pago:', error);
    }
  };

  const filteredSessions = Array.isArray(sessions) ? sessions.filter(session => {
    const clientName = session.client?.name ? `${session.client.name.firstName} ${session.client.name.lastName}`.toLowerCase() : '';
    const serviceType = getServiceTypeLabel(session.serviceType).toLowerCase();
    const location = session.location?.toLowerCase() || '';
    const searchMatch = clientName.includes(searchTerm.toLowerCase()) || 
                       serviceType.includes(searchTerm.toLowerCase()) ||
                       location.includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === 'all' || session.status === statusFilter;
    const serviceMatch = serviceFilter === 'all' || session.serviceType === serviceFilter;
    const photoStatusMatch = photoStatusFilter === 'all' || session.photoDeliveryStatus === photoStatusFilter;
    
    return searchMatch && statusMatch && serviceMatch && photoStatusMatch;
  }) : [];

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
            <p className="mt-4 text-muted-foreground">Carregando serviços...</p>
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
            <h1 className="text-3xl font-bold text-foreground">Serviços & Sessões</h1>
            <div className="flex items-center gap-2">
              <Link to="/clientes/adicionar-servico">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Sessão
                </Button>
              </Link>
            </div>
          </div>

          {/* Indicadores de Sessões */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Sessões</CardTitle>
                <Camera className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {sessionStats.totalSessions}
                </div>
                <p className="text-xs text-muted-foreground">
                  Sessões registradas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes com Fotos Pendentes</CardTitle>
                <Package className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {sessionStats.pendingDeliveries}
                </div>
                <p className="text-xs text-muted-foreground">
                  Fotos não entregues
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes com Pagamentos Pendentes</CardTitle>
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {sessionStats.pendingPayments}
                </div>
                <p className="text-xs text-muted-foreground">
                  Pagamentos não recebidos
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Buscar por cliente, serviço ou local..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value === 'all' ? 'all' : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status da Sessão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value={SessionStatus.COMPLETED}>Completada</SelectItem>
                <SelectItem value={SessionStatus.CANCELLED}>Cancelada</SelectItem>
                <SelectItem value={SessionStatus.REFUNDED}>Reembolsada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={serviceFilter} onValueChange={(value) => setServiceFilter(value === 'all' ? 'all' : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de Serviço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os serviços</SelectItem>
                <SelectItem value={ServiceType.BOOK}>Book Fotográfico</SelectItem>
                <SelectItem value={ServiceType.CASAMENTO}>Casamento</SelectItem>
                <SelectItem value={ServiceType.EVENTO}>Evento</SelectItem>
                <SelectItem value={ServiceType.NEWBORN}>Newborn</SelectItem>
                <SelectItem value={ServiceType.ENSAIO_FAMILIA}>Ensaio Família</SelectItem>
                <SelectItem value={ServiceType.ENSAIO_GESTANTE}>Ensaio Gestante</SelectItem>
                <SelectItem value={ServiceType.ENSAIO_INFANTIL}>Ensaio Infantil</SelectItem>
                <SelectItem value={ServiceType.CASAL}>Ensaio Casal</SelectItem>
              </SelectContent>
            </Select>
            <Select value={photoStatusFilter} onValueChange={(value) => setPhotoStatusFilter(value === 'all' ? 'all' : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status das Fotos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value={PhotoDeliveryStatus.NOT_DELIVERED}>Não Entregues</SelectItem>
                <SelectItem value={PhotoDeliveryStatus.PARTIAL_DELIVERED}>Parcialmente Entregues</SelectItem>
                <SelectItem value={PhotoDeliveryStatus.DELIVERED}>Entregues</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabela de Sessões */}
          <div className="rounded-md border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-muted/50">
                  <TableHead className="text-foreground font-semibold">Cliente</TableHead>
                  <TableHead className="text-foreground font-semibold">Tipo de Serviço</TableHead>
                  <TableHead className="text-foreground font-semibold">Data & Hora</TableHead>
                  <TableHead className="text-foreground font-semibold">Local</TableHead>
                  <TableHead className="text-foreground font-semibold">Status</TableHead>
                  <TableHead className="text-foreground font-semibold">Fotos</TableHead>
                  <TableHead className="text-foreground font-semibold">Valor</TableHead>
                  <TableHead className="text-right text-foreground font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
            {filteredSessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {loading ? 'Carregando...' : 'Nenhuma sessão encontrada'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSessions.map((session) => {
                    return (
                      <TableRow key={session.id} className="cursor-pointer hover:bg-muted/50 border-b border-border">
                        <TableCell>
                          <div>
                            <div className="font-medium text-foreground">
                              {session.client?.name ? `${session.client.name.firstName} ${session.client.name.lastName}` : 'Cliente não encontrado'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {session.client?.phone || '-'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-foreground">{getServiceTypeLabel(session.serviceType)}</div>
                            <div className="text-sm text-muted-foreground">
                              {session.duration}min
                            </div>
              </div>
                        </TableCell>
                        <TableCell className="text-foreground">
                          <div>
                            <div className="font-medium">{formatDate(session.date)}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatDateTime(session.date).split(' ')[1]}
                    </div>
                      </div>
                        </TableCell>
                        <TableCell className="text-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{session.location || 'Não informado'}</span>
                      </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSessionStatusColor(session.status)}`}>
                            {getSessionStatusLabel(session.status)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPhotoDeliveryStatusColor(session.photoDeliveryStatus)}`}>
                              {getPhotoDeliveryStatusLabel(session.photoDeliveryStatus)}
                            </span>
                            {session.totalPhotos && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {session.deliveredPhotos || 0}/{session.totalPhotos} fotos
                        </div>
                      )}
                      </div>
                        </TableCell>
                        <TableCell className="text-foreground font-medium">
                          {session.price ? formatCurrency(session.price) : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            {session.photoDeliveryStatus !== PhotoDeliveryStatus.DELIVERED && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                                onClick={() => handleMarkPhotoAsDelivered(session.id)}
                              >
                                <Package className="h-3 w-3 mr-1" />
                                Entregar Foto
                              </Button>
                            )}
                            {session.payment && session.payment.status !== PaymentStatus.COMPLETED && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                                onClick={() => handleMarkPaymentAsCompleted(session.id)}
                              >
                                <DollarSign className="h-3 w-3 mr-1" />
                                Marcar Pago
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              Detalhes
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
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

export default ServicosPage; 