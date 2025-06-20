import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button"
import { ScrollHeader } from "../components/scroll-header"
import { Input } from "../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Search, Plus, DollarSign, CreditCard, Edit, Check, X, TrendingUp, AlertCircle, FileText, Download, Mail, MessageSquare, Calendar, CheckCircle, XCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { ApiService } from "../services/api"
import { PaymentStatus, PaymentMethod } from "../types"
import { getPaymentStatusColor, getPaymentStatusLabel, getPaymentMethodLabel, formatCurrency, formatDate } from "../utils/helpers"

interface PaymentWithDetails {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  dueDate?: string;
  clientId: string;
  sessionId?: string;
  createdAt?: string;
  updatedAt?: string;
  client?: {
    id: string;
    name: {
      firstName: string;
      lastName: string;
    };
    email: string;
  };
  session?: {
    id: string;
    serviceType: string;
    date: string;
  };
}

interface Invoice {
  id: string;
  number: string;
  clientId: string;
  sessionId?: string;
  amount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  status: 'ISSUED' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  description: string;
  client?: {
    id: string;
    name: {
      firstName: string;
      lastName: string;
    };
    email: string;
    phone: string;
  };
  session?: {
    id: string;
    serviceType: string;
    date: string;
  };
  createdAt?: string;
  paidAt?: string;
}

const PagamentosPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('payments');

  // Filters for payments
  const [paymentSearchTerm, setPaymentSearchTerm] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  // Filters for invoices
  const [invoiceSearchTerm, setInvoiceSearchTerm] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('all');

  // Indicadores financeiros
  const [financialStats, setFinancialStats] = useState({
    totalReceived: 0,
    totalPending: 0,
    totalOverdue: 0,
    pendingPayments: 0
  });

  // Stats das faturas
  const [invoiceStats, setInvoiceStats] = useState({
    totalInvoices: 0,
    issuedAmount: 0,
    paidAmount: 0,
    overdueAmount: 0
  });

  useEffect(() => {
    fetchPayments();
    fetchInvoices();
  }, [paymentStatusFilter, methodFilter, invoiceStatusFilter]);

  useEffect(() => {
    calculateFinancialStats();
  }, [payments]);

  useEffect(() => {
    calculateInvoiceStats();
  }, [invoices]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getAllPayments(1, 100, paymentStatusFilter !== 'all' ? paymentStatusFilter : undefined);
      
      // Handle both response structures (API response and mock data)
      let paymentsData;
      if (response.payments) {
        // Real API response structure
        paymentsData = response.payments;
      } else if (response.data) {
        // Mock data structure
        paymentsData = response.data;
      } else if (Array.isArray(response)) {
        // Direct array response
        paymentsData = response;
      } else {
        paymentsData = [];
      }
      
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await ApiService.getAllInvoices(1, 100, invoiceStatusFilter !== 'all' ? invoiceStatusFilter : undefined);
      
      // Handle both response structures (API response and mock data)
      let invoicesData;
      if (response.invoices) {
        // Real API response structure
        invoicesData = response.invoices;
      } else if (response.data) {
        // Mock data structure
        invoicesData = response.data;
      } else if (Array.isArray(response)) {
        // Direct array response
        invoicesData = response;
      } else {
        invoicesData = [];
      }
      
      setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
    } catch (error) {
      console.error('Erro ao carregar faturas:', error);
      setInvoices([]);
    }
  };

  const calculateFinancialStats = () => {
    if (!Array.isArray(payments)) {
      setFinancialStats({
        totalReceived: 0,
        totalPending: 0,
        totalOverdue: 0,
        pendingPayments: 0
      });
      return;
    }

    const stats = payments.reduce((acc, payment) => {
      switch (payment.status) {
        case PaymentStatus.COMPLETED:
          acc.totalReceived += payment.amount;
          break;
        case PaymentStatus.PENDING:
          acc.totalPending += payment.amount;
          acc.pendingPayments += 1;
          if (payment.dueDate && new Date(payment.dueDate) < new Date()) {
            acc.totalOverdue += payment.amount;
          }
          break;
      }
      return acc;
    }, {
      totalReceived: 0,
      totalPending: 0,
      totalOverdue: 0,
      pendingPayments: 0
    });

    setFinancialStats(stats);
  };

  const calculateInvoiceStats = () => {
    if (!Array.isArray(invoices)) {
      setInvoiceStats({
        totalInvoices: 0,
        issuedAmount: 0,
        paidAmount: 0,
        overdueAmount: 0
      });
      return;
    }

    const stats = invoices.reduce((acc, invoice) => {
      acc.totalInvoices++;
      
      switch (invoice.status) {
        case 'ISSUED':
          acc.issuedAmount += invoice.amount;
          break;
        case 'PAID':
          acc.paidAmount += invoice.amount;
          break;
        case 'OVERDUE':
          acc.overdueAmount += invoice.amount;
          break;
      }

      return acc;
    }, {
      totalInvoices: 0,
      issuedAmount: 0,
      paidAmount: 0,
      overdueAmount: 0
    });

    setInvoiceStats(stats);
  };

  // Payment handlers
  const handleMarkAsPaid = async (paymentId: string) => {
    try {
      await ApiService.updatePaymentStatus(paymentId, PaymentStatus.COMPLETED);
      setPayments(prev => 
        prev.map(payment => 
          payment.id === paymentId 
            ? { ...payment, status: PaymentStatus.COMPLETED, updatedAt: new Date().toISOString() }
            : payment
        )
      );
    } catch (error) {
      console.error('Erro ao marcar como pago:', error);
    }
  };

  const handleCancelPayment = async (paymentId: string) => {
    try {
      await ApiService.updatePaymentStatus(paymentId, PaymentStatus.CANCELLED);
      setPayments(prev => 
        prev.map(payment => 
          payment.id === paymentId 
            ? { ...payment, status: PaymentStatus.CANCELLED, updatedAt: new Date().toISOString() }
            : payment
        )
      );
    } catch (error) {
      console.error('Erro ao cancelar pagamento:', error);
    }
  };

  // Invoice handlers
  const getInvoiceStatusColor = (status: string): string => {
    switch (status) {
      case 'ISSUED':
        return 'bg-blue-500/15 text-blue-800 dark:bg-blue-500/40 dark:text-blue-100';
      case 'PAID':
        return 'bg-green-500/15 text-green-800 dark:bg-green-500/40 dark:text-green-100';
      case 'OVERDUE':
        return 'bg-red-500/15 text-red-800 dark:bg-red-500/40 dark:text-red-100';
      case 'CANCELLED':
        return 'bg-gray-500/15 text-gray-800 dark:bg-gray-500/40 dark:text-gray-100';
      default:
        return 'bg-gray-500/15 text-gray-800 dark:bg-gray-500/40 dark:text-gray-100';
    }
  };

  const getInvoiceStatusLabel = (status: string): string => {
    switch (status) {
      case 'ISSUED':
        return 'Emitida';
      case 'PAID':
        return 'Paga';
      case 'OVERDUE':
        return 'Vencida';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const handleDownloadPDF = async (invoiceId: string) => {
    try {
      const pdfBlob = await ApiService.downloadInvoicePDF(invoiceId);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fatura-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
    }
  };

  const handleSendEmail = async (invoiceId: string) => {
    try {
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (invoice?.client?.email) {
        await ApiService.sendInvoiceByEmail(invoiceId, invoice.client.email);
        console.log('Fatura enviada por email com sucesso');
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    }
  };

  const handleSendWhatsApp = async (invoiceId: string) => {
    try {
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (invoice?.client?.phone) {
        await ApiService.sendInvoiceByWhatsApp(invoiceId, invoice.client.phone);
        console.log('Fatura enviada por WhatsApp com sucesso');
      }
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
    }
  };

  const handleMarkInvoiceAsPaid = async (invoiceId: string) => {
    try {
      await ApiService.updateInvoiceStatus(invoiceId, 'PAID');
      setInvoices(prev => 
        prev.map(invoice => 
          invoice.id === invoiceId 
            ? { ...invoice, status: 'PAID' as const, paidAt: new Date().toISOString() }
            : invoice
        )
      );
    } catch (error) {
      console.error('Erro ao marcar fatura como paga:', error);
    }
  };

  const handleCancelInvoice = async (invoiceId: string) => {
    try {
      await ApiService.updateInvoiceStatus(invoiceId, 'CANCELLED');
      setInvoices(prev => 
        prev.map(invoice => 
          invoice.id === invoiceId 
            ? { ...invoice, status: 'CANCELLED' as const }
            : invoice
        )
      );
    } catch (error) {
      console.error('Erro ao cancelar fatura:', error);
    }
  };

  const filteredPayments = Array.isArray(payments) ? payments.filter(payment => {
    const clientName = payment.client?.name ? `${payment.client.name.firstName} ${payment.client.name.lastName}`.toLowerCase() : '';
    const clientEmail = payment.client?.email?.toLowerCase() || '';
    const searchMatch = clientName.includes(paymentSearchTerm.toLowerCase()) || 
                       clientEmail.includes(paymentSearchTerm.toLowerCase());
    
    const statusMatch = paymentStatusFilter === 'all' || payment.status === paymentStatusFilter;
    const methodMatch = methodFilter === 'all' || payment.method === methodFilter;
    
    return searchMatch && statusMatch && methodMatch;
  }) : [];

  const filteredInvoices = Array.isArray(invoices) ? invoices.filter(invoice => {
    const clientName = invoice.client?.name ? `${invoice.client.name.firstName} ${invoice.client.name.lastName}`.toLowerCase() : '';
    const invoiceNumber = invoice.number?.toLowerCase() || '';
    const description = invoice.description?.toLowerCase() || '';
    const searchMatch = clientName.includes(invoiceSearchTerm.toLowerCase()) || 
                       invoiceNumber.includes(invoiceSearchTerm.toLowerCase()) ||
                       description.includes(invoiceSearchTerm.toLowerCase());
    
    const invoiceStatusMatch = invoiceStatusFilter === 'all' || invoice.status === invoiceStatusFilter;
    
    return searchMatch && invoiceStatusMatch;
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
            <p className="mt-4 text-muted-foreground">Carregando...</p>
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
            <h1 className="text-3xl font-bold text-foreground">Pagamentos & Faturas</h1>
            <div className="flex items-center gap-2">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Fatura
              </Button>
              <Link to="/clientes/registrar-pagamento">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Pagamento
                </Button>
              </Link>
            </div>
          </div>

          {/* Indicadores Combinados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(financialStats.totalReceived + invoiceStats.paidAmount)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Pagamentos + Faturas pagas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
                <TrendingUp className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(financialStats.totalPending + invoiceStats.issuedAmount)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Pagamentos + Faturas pendentes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(financialStats.totalOverdue + invoiceStats.overdueAmount)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Valores vencidos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
                <CreditCard className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(
                    financialStats.totalReceived + financialStats.totalPending + 
                    invoiceStats.paidAmount + invoiceStats.issuedAmount
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Receita total
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="payments">Pagamentos</TabsTrigger>
              <TabsTrigger value="invoices">Faturas</TabsTrigger>
            </TabsList>

            <TabsContent value="payments" className="space-y-6">
              {/* Filtros de Pagamentos */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Buscar por cliente..." 
                    className="pl-8" 
                    value={paymentSearchTerm}
                    onChange={(e) => setPaymentSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={paymentStatusFilter} onValueChange={(value) => setPaymentStatusFilter(value === 'all' ? 'all' : value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value={PaymentStatus.PENDING}>A receber</SelectItem>
                    <SelectItem value={PaymentStatus.COMPLETED}>Recebido</SelectItem>
                    <SelectItem value={PaymentStatus.CANCELLED}>Cancelado</SelectItem>
                    <SelectItem value={PaymentStatus.REFUNDED}>Reembolsado</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={methodFilter} onValueChange={(value) => setMethodFilter(value === 'all' ? 'all' : value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Forma de Pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as formas</SelectItem>
                    <SelectItem value={PaymentMethod.PIX}>PIX</SelectItem>
                    <SelectItem value={PaymentMethod.CREDIT_CARD}>Cartão de Crédito</SelectItem>
                    <SelectItem value={PaymentMethod.DEBIT_CARD}>Cartão de Débito</SelectItem>
                    <SelectItem value={PaymentMethod.CASH}>Dinheiro</SelectItem>
                    <SelectItem value={PaymentMethod.BANK_TRANSFER}>Transferência</SelectItem>
                    <SelectItem value={PaymentMethod.BOLETO}>Boleto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tabela de Pagamentos */}
              <div className="rounded-md border border-border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border hover:bg-muted/50">
                      <TableHead className="text-foreground font-semibold">Cliente</TableHead>
                      <TableHead className="text-foreground font-semibold">Serviço</TableHead>
                      <TableHead className="text-foreground font-semibold">Valor</TableHead>
                      <TableHead className="text-foreground font-semibold">Vencimento</TableHead>
                      <TableHead className="text-foreground font-semibold">Forma de Pagamento</TableHead>
                      <TableHead className="text-foreground font-semibold">Status</TableHead>
                      <TableHead className="text-right text-foreground font-semibold">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Nenhum pagamento encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => {
                        const isOverdue = payment.dueDate && new Date(payment.dueDate) < new Date() && payment.status === PaymentStatus.PENDING;
                        
                        return (
                          <TableRow key={payment.id} className={`cursor-pointer hover:bg-muted/50 border-b border-border ${isOverdue ? 'bg-red-50 dark:bg-red-950/20' : ''}`}>
                            <TableCell>
                              <div>
                                <div className="font-medium text-foreground">
                                  {payment.client?.name ? `${payment.client.name.firstName} ${payment.client.name.lastName}` : 'Cliente não encontrado'}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {payment.client?.email || '-'}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-foreground">
                              {payment.session ? (
                                <div>
                                  <div className="font-medium">{payment.session.serviceType}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {formatDate(payment.session.date)}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">Sem serviço vinculado</span>
                              )}
                            </TableCell>
                            <TableCell className="text-foreground font-medium">
                              {formatCurrency(payment.amount)}
                            </TableCell>
                            <TableCell className="text-foreground">
                              {payment.dueDate ? (
                                <div className={isOverdue ? 'text-red-600 font-medium' : ''}>
                                  {formatDate(payment.dueDate)}
                                  {isOverdue && (
                                    <div className="text-xs text-red-600">Vencido</div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">Sem vencimento</span>
                              )}
                            </TableCell>
                            <TableCell className="text-foreground">
                              {getPaymentMethodLabel(payment.method)}
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                                {getPaymentStatusLabel(payment.status)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                {payment.status === PaymentStatus.PENDING && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                                      onClick={() => handleMarkAsPaid(payment.id)}
                                    >
                                      <Check className="h-3 w-3 mr-1" />
                                      Marcar como Pago
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                      onClick={() => handleCancelPayment(payment.id)}
                                    >
                                      <X className="h-3 w-3 mr-1" />
                                      Cancelar
                                    </Button>
                                  </>
                                )}
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
            </TabsContent>

            <TabsContent value="invoices" className="space-y-6">
              {/* Filtros de Faturas */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Buscar por cliente, número ou descrição..." 
                    className="pl-8" 
                    value={invoiceSearchTerm}
                    onChange={(e) => setInvoiceSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={invoiceStatusFilter} onValueChange={(value) => setInvoiceStatusFilter(value === 'all' ? 'all' : value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="ISSUED">Emitida</SelectItem>
                    <SelectItem value="PAID">Paga</SelectItem>
                    <SelectItem value="OVERDUE">Vencida</SelectItem>
                    <SelectItem value="CANCELLED">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tabela de Faturas */}
              <div className="rounded-md border border-border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border hover:bg-muted/50">
                      <TableHead className="text-foreground font-semibold">Nº da Fatura</TableHead>
                      <TableHead className="text-foreground font-semibold">Cliente</TableHead>
                      <TableHead className="text-foreground font-semibold">Serviço</TableHead>
                      <TableHead className="text-foreground font-semibold">Valor</TableHead>
                      <TableHead className="text-foreground font-semibold">Emissão</TableHead>
                      <TableHead className="text-foreground font-semibold">Vencimento</TableHead>
                      <TableHead className="text-foreground font-semibold">Status</TableHead>
                      <TableHead className="text-right text-foreground font-semibold">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          Nenhuma fatura encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvoices.map((invoice) => {
                        const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status === 'ISSUED';
                        
                        return (
                          <TableRow key={invoice.id} className={`cursor-pointer hover:bg-muted/50 border-b border-border ${isOverdue ? 'bg-red-50 dark:bg-red-950/20' : ''}`}>
                            <TableCell>
                              <div>
                                <div className="font-medium text-foreground">{invoice.number}</div>
                                <div className="text-sm text-muted-foreground">{invoice.description}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium text-foreground">
                                  {invoice.client?.name ? `${invoice.client.name.firstName} ${invoice.client.name.lastName}` : 'Cliente não encontrado'}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {invoice.client?.email || '-'}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-foreground">
                              {invoice.session ? (
                                <div>
                                  <div className="font-medium">{invoice.session.serviceType}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {formatDate(invoice.session.date)}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">Serviço avulso</span>
                              )}
                            </TableCell>
                            <TableCell className="text-foreground font-medium">
                              {formatCurrency(invoice.amount)}
                            </TableCell>
                            <TableCell className="text-foreground">
                              {formatDate(invoice.issueDate)}
                            </TableCell>
                            <TableCell className="text-foreground">
                              <div className={isOverdue ? 'text-red-600 font-medium' : ''}>
                                {formatDate(invoice.dueDate)}
                                {isOverdue && (
                                  <div className="text-xs text-red-600">Vencida</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getInvoiceStatusColor(invoice.status)}`}>
                                {getInvoiceStatusLabel(invoice.status)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-1 justify-end flex-wrap">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleDownloadPDF(invoice.id)}
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  PDF
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleSendEmail(invoice.id)}
                                >
                                  <Mail className="h-3 w-3 mr-1" />
                                  Email
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleSendWhatsApp(invoice.id)}
                                >
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  WhatsApp
                                </Button>
                                {invoice.status === 'ISSUED' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                                    onClick={() => handleMarkInvoiceAsPaid(invoice.id)}
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Marcar Pago
                                  </Button>
                                )}
                                {(invoice.status === 'ISSUED' || invoice.status === 'OVERDUE') && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                    onClick={() => handleCancelInvoice(invoice.id)}
                                  >
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Cancelar
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
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

export default PagamentosPage;
