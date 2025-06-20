import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { ScrollHeader } from "../components/scroll-header";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, DollarSign, Calendar, User, Package, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Alert, AlertDescription } from "../components/ui/alert";
import { ApiService } from "../services/api";
import { PaymentStatus, PaymentMethod, Client, Session } from "../types";
import { formatDate } from "../utils/helpers";

const RegistrarPagamento: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    clientId: '',
    sessionId: '',
    amount: '',
    currency: 'BRL',
    status: PaymentStatus.PENDING,
    method: '',
    dueDate: ''
  });

  useEffect(() => {
    fetchClients();
    fetchSessions();
  }, []);

  useEffect(() => {
    if (formData.clientId) {
      const clientSessions = sessions.filter(session => session.clientId === formData.clientId);
      setFilteredSessions(clientSessions);
    } else {
      setFilteredSessions([]);
    }
  }, [formData.clientId, sessions]);

  const fetchClients = async () => {
    try {
      const response = await ApiService.getAllClients(1, 100);
      
      // Handle both response structures (API response and mock data)
      let clientsData;
      if (response.clients) {
        // Real API response structure
        clientsData = response.clients;
      } else if (response.data) {
        // Mock data structure
        clientsData = response.data;
      } else if (Array.isArray(response)) {
        // Direct array response
        clientsData = response;
      } else {
        clientsData = [];
      }
      
      setClients(Array.isArray(clientsData) ? clientsData : []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setError('Não foi possível carregar os clientes.');
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await ApiService.getAllSessions({ page: 1, limit: 100 });
      
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
      setError('Não foi possível carregar as sessões.');
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'clientId') {
      setFormData(prev => ({
        ...prev,
        sessionId: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!formData.clientId || !formData.amount || !formData.method) {
        throw new Error('Por favor, preencha todos os campos obrigatórios.');
      }

      const paymentData = {
        clientId: formData.clientId,
        sessionId: formData.sessionId || undefined,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        status: formData.status,
        method: formData.method,
        dueDate: formData.dueDate || undefined
      };

      await ApiService.createPayment(paymentData);
      setSuccess('Pagamento registrado com sucesso!');
      
      setFormData({
        clientId: '',
        sessionId: '',
        amount: '',
        currency: 'BRL',
        status: PaymentStatus.PENDING,
        method: '',
        dueDate: ''
      });

      setTimeout(() => {
        navigate('/pagamentos');
      }, 2000);

    } catch (error: any) {
      console.error('Erro ao registrar pagamento:', error);
      setError(error.message || 'Erro ao registrar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Deseja cancelar o registro? Todos os dados serão perdidos.")) {
      navigate('/pagamentos');
    }
  };

  const getClientName = (client: Client) => {
    return client.name ? `${client.name.firstName} ${client.name.lastName}` : 'Cliente sem nome';
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
      <ScrollHeader />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate('/pagamentos')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
                  </Button>
            <h1 className="text-3xl font-bold">Registrar Novo Pagamento</h1>
          </div>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
            <Alert className="mb-6 border-green-500/20 bg-green-500/10">
              <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
                </Alert>
              )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informações do Cliente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Cliente
                  </CardTitle>
                  <CardDescription>
                    Selecione o cliente para este pagamento.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientId">Cliente *</Label>
                      <Select value={formData.clientId} onValueChange={(value) => handleInputChange('clientId', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {getClientName(client)} - {client.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sessionId">Sessão (Opcional)</Label>
                      <Select value={formData.sessionId} onValueChange={(value) => handleInputChange('sessionId', value)} disabled={!formData.clientId}>
                        <SelectTrigger>
                          <SelectValue placeholder={formData.clientId ? "Selecione uma sessão" : "Primeiro selecione um cliente"} />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredSessions.map((session) => (
                            <SelectItem key={session.id} value={session.id}>
                              {session.serviceType} - {formatDate(session.date)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informações do Pagamento */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Dados do Pagamento
                  </CardTitle>
                  <CardDescription>
                    Informações detalhadas sobre o pagamento a ser registrado.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Valor *</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="method">Método de Pagamento *</Label>
                      <Select value={formData.method} onValueChange={(value) => handleInputChange('method', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o método" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={PaymentMethod.PIX}>PIX</SelectItem>
                          <SelectItem value={PaymentMethod.CREDIT_CARD}>Cartão de Crédito</SelectItem>
                          <SelectItem value={PaymentMethod.DEBIT_CARD}>Cartão de Débito</SelectItem>
                          <SelectItem value={PaymentMethod.BANK_TRANSFER}>Transferência Bancária</SelectItem>
                          <SelectItem value={PaymentMethod.CASH}>Dinheiro</SelectItem>
                          <SelectItem value={PaymentMethod.BOLETO}>Boleto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={PaymentStatus.PENDING}>Pendente</SelectItem>
                          <SelectItem value={PaymentStatus.COMPLETED}>Completo</SelectItem>
                          <SelectItem value={PaymentStatus.CANCELLED}>Cancelado</SelectItem>
                          <SelectItem value={PaymentStatus.REFUNDED}>Reembolsado</SelectItem>
                          <SelectItem value={PaymentStatus.FAILED}>Falhou</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dueDate" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Data de Vencimento (Opcional)
                      </Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      />
                    </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                      onClick={handleCancel}
                        className="flex-1"
                        disabled={loading}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                      className="flex-1"
                        disabled={loading}
                      >
                        {loading ? 'Registrando...' : 'Registrar Pagamento'}
                      </Button>
                    </div>
                </CardContent>
              </Card>
            </div>

            {/* Próximos Passos */}
            <Card className="mt-6 bg-blue-500/10 border-blue-500/20">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Próximos Passos</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Após registrar o pagamento, ele aparecerá na lista de pagamentos onde você poderá
                      acompanhar o status, marcar como pago ou gerar faturas se necessário.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
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
  );
};

export default RegistrarPagamento; 