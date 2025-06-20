import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button"
import { ScrollHeader } from "../components/scroll-header"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { BarChart, TrendingUp, DollarSign, Camera, Users, FileText, Download, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { formatCurrency } from "../utils/helpers"
import { ApiService } from "../services/api"

interface RevenueData {
  month: string;
  revenue: number;
  sessions: number;
}

interface ServiceTypeData {
  type: string;
  count: number;
  revenue: number;
}

interface ClientData {
  id: string;
  name: string;
  totalSpent: number;
  sessionsCount: number;
}

const RelatoriosPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState('month');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Dados para relatórios
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [serviceTypeData, setServiceTypeData] = useState<ServiceTypeData[]>([]);
  const [topClients, setTopClients] = useState<ClientData[]>([]);
  
  // Métricas gerais
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalSessions: 0,
    averageTicket: 0,
    completionRate: 0,
    overduePayments: 0,
    pendingDeliveries: 0
  });

  useEffect(() => {
    fetchReportsData();
  }, [periodFilter, dateFrom, dateTo]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados dos relatórios em paralelo
      const [
        revenueResponse,
        serviceStatsResponse,
        topClientsResponse,
        systemMetricsResponse
      ] = await Promise.all([
        ApiService.getRevenueByMonth(),
        ApiService.getServiceTypeStats(),
        ApiService.getTopClients(5),
        ApiService.getSystemMetrics()
      ]);

      // Garantir que sempre sejam arrays
      const revenueData = revenueResponse.data || revenueResponse;
      const serviceData = serviceStatsResponse.data || serviceStatsResponse;
      const clientsData = topClientsResponse.data || topClientsResponse;
      
      setRevenueData(Array.isArray(revenueData) ? revenueData : []);
      setServiceTypeData(Array.isArray(serviceData) ? serviceData : []);
      setTopClients(Array.isArray(clientsData) ? clientsData : []);
      
      const systemMetrics = systemMetricsResponse.data || systemMetricsResponse;
      setMetrics({
        totalRevenue: systemMetrics.totalRevenue || 0,
        totalSessions: systemMetrics.totalSessions || 0,
        averageTicket: systemMetrics.averageTicket || 0,
        completionRate: systemMetrics.completionRate || 0,
        overduePayments: systemMetrics.overduePayments || 0,
        pendingDeliveries: systemMetrics.pendingDeliveries || 0
      });

    } catch (error) {
      console.error('Erro ao carregar dados dos relatórios:', error);
      // Define valores padrão em caso de erro
      setRevenueData([]);
      setServiceTypeData([]);
      setTopClients([]);
      setMetrics({
        totalRevenue: 0,
        totalSessions: 0,
        averageTicket: 0,
        completionRate: 0,
        overduePayments: 0,
        pendingDeliveries: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const params = {
        period: periodFilter,
        dateFrom,
        dateTo
      };
      const pdfBlob = await ApiService.exportReportPDF('general', params);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
    }
  };

  const handleExportExcel = async () => {
    try {
      const params = {
        period: periodFilter,
        dateFrom,
        dateTo
      };
      const excelBlob = await ApiService.exportReportExcel('general', params);
      const url = window.URL.createObjectURL(excelBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
    }
  };

  const maxRevenue = revenueData.length > 0 ? Math.max(...revenueData.map(item => item.revenue)) : 1;
  const maxSessions = revenueData.length > 0 ? Math.max(...revenueData.map(item => item.sessions)) : 1;

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
            <p className="mt-4 text-muted-foreground">Carregando relatórios...</p>
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
            <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleExportExcel}>
                <FileText className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>

          {/* Filtros de Período */}
          <div className="flex items-center gap-4 mb-6">
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mês</SelectItem>
                <SelectItem value="quarter">Este Trimestre</SelectItem>
                <SelectItem value="year">Este Ano</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
            
            {periodFilter === 'custom' && (
              <>
                <Input 
                  type="date" 
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-[150px]"
                />
                <Input 
                  type="date" 
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-[150px]"
                />
              </>
            )}
          </div>

          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(metrics.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  No período selecionado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Sessões</CardTitle>
                <Camera className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {metrics.totalSessions}
                </div>
                <p className="text-xs text-muted-foreground">
                  Sessões realizadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(metrics.averageTicket)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Valor médio por sessão
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {metrics.completionRate}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Sessões concluídas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pagamentos Vencidos</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {metrics.overduePayments}
                </div>
                <p className="text-xs text-muted-foreground">
                  Precisam atenção
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Entregas Pendentes</CardTitle>
                <XCircle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {metrics.pendingDeliveries}
                </div>
                <p className="text-xs text-muted-foreground">
                  Fotos não entregues
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos e Análises */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Gráfico de Receita Mensal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Evolução da Receita
                </CardTitle>
                <CardDescription>
                  Receita e número de sessões por mês
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground font-medium">{item.month}</span>
                        <div className="flex gap-4">
                          <span className="text-green-600">{formatCurrency(item.revenue)}</span>
                          <span className="text-blue-600">{item.sessions} sessões</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {/* Barra de receita */}
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                          />
                        </div>
                        {/* Barra de sessões */}
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(item.sessions / maxSessions) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Serviços Mais Populares */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Serviços Mais Contratados
                </CardTitle>
                <CardDescription>
                  Ranking por quantidade e receita
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceTypeData.map((service, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground font-medium">{service.type}</span>
                        <div className="flex gap-4">
                          <span className="text-green-600">{formatCurrency(service.revenue)}</span>
                          <span className="text-blue-600">{service.count} sessões</span>
                        </div>
                      </div>
                                               <div className="bg-muted rounded-full h-2">
                           <div 
                             className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                             style={{ width: `${serviceTypeData.length > 0 ? (service.count / Math.max(...serviceTypeData.map(s => s.count))) * 100 : 0}%` }}
                           />
                         </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Clientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Clientes
              </CardTitle>
              <CardDescription>
                Clientes com maior valor gasto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topClients.map((client, index) => (
                  <div key={client.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{client.name}</div>
                        <div className="text-sm text-muted-foreground">{client.sessionsCount} sessões</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-foreground">{formatCurrency(client.totalSpent)}</div>
                      <div className="text-sm text-muted-foreground">Total gasto</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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

export default RelatoriosPage;
