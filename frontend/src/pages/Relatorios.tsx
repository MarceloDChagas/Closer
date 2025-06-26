import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button"
import { ScrollHeader } from "../components/scroll-header"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { BarChart, TrendingUp, DollarSign, Camera, Users, FileText, Download, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { formatCurrency } from "../utils/helpers"
import { ApiService } from "../services/api"
import { StatsCard } from "../components/StatsCard"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { PageHeader } from "../components/PageHeader"
import { PageFooter } from "../components/PageFooter"
import { FilterBar } from "../components/FilterBar"

interface RevenueData {
  month: number;
  monthName: string;
  revenue: number;
  count: number;
}

interface ServiceTypeData {
  serviceType: string;
  count: number;
  revenue: number;
  averageValue: number;
}

interface ClientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSessions: number;
  completedSessions: number;
  totalRevenue: number;
  averageSessionValue: number;
}

interface SystemMetrics {
  totalClients: number;
  totalSessions: number;
  totalRevenue: number;
  pendingPayments: number;
  overduePayments: number;
  recentSessions: number;
  monthlyGrowth: number;
  averageSessionValue: number;
}

const RelatoriosPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState('year');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Dados para relatórios
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [serviceTypeData, setServiceTypeData] = useState<ServiceTypeData[]>([]);
  const [topClients, setTopClients] = useState<ClientData[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalClients: 0,
    totalSessions: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    overduePayments: 0,
    recentSessions: 0,
    monthlyGrowth: 0,
    averageSessionValue: 0
  });

  useEffect(() => {
    fetchReportsData();
  }, [periodFilter, dateFrom, dateTo]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      
      // Preparar parâmetros de data
      let yearParam: string | undefined;
      let startDateParam: string | undefined;
      let endDateParam: string | undefined;

      if (periodFilter === 'custom' && dateFrom && dateTo) {
        startDateParam = dateFrom;
        endDateParam = dateTo;
      } else {
        yearParam = new Date().getFullYear().toString();
      }

      // Carregar dados dos relatórios em paralelo
      const [
        revenueResponse,
        serviceStatsResponse,
        topClientsResponse,
        systemMetricsResponse
      ] = await Promise.all([
        ApiService.getRevenueByMonth(yearParam ? parseInt(yearParam) : undefined),
        ApiService.getServiceTypeStats(),
        ApiService.getTopClients(10),
        ApiService.getSystemMetrics()
      ]);

      console.log('Revenue data:', revenueResponse);
      console.log('Service stats:', serviceStatsResponse);
      console.log('Top clients:', topClientsResponse);
      console.log('System metrics:', systemMetricsResponse);

      setRevenueData(Array.isArray(revenueResponse) ? revenueResponse : []);
      setServiceTypeData(Array.isArray(serviceStatsResponse) ? serviceStatsResponse : []);
      setTopClients(Array.isArray(topClientsResponse) ? topClientsResponse : []);
      setMetrics(systemMetricsResponse || {
        totalClients: 0,
        totalSessions: 0,
        totalRevenue: 0,
        pendingPayments: 0,
        overduePayments: 0,
        recentSessions: 0,
        monthlyGrowth: 0,
        averageSessionValue: 0
      });

    } catch (error) {
      console.error('Erro ao carregar dados dos relatórios:', error);
      // Valores padrão em caso de erro
      setRevenueData([]);
      setServiceTypeData([]);
      setTopClients([]);
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
  const maxSessions = revenueData.length > 0 ? Math.max(...revenueData.map(item => item.count)) : 1;

  const periodOptions = [
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mês' },
    { value: 'quarter', label: 'Este Trimestre' },
    { value: 'year', label: 'Este Ano' },
    { value: 'custom', label: 'Personalizado' }
  ];

  if (loading) {
    return <LoadingSpinner message="Carregando relatórios..." />;
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
          <PageHeader title="Relatórios">
            <Button variant="outline" onClick={handleExportExcel}>
              <FileText className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </PageHeader>

          {/* Filtros de Período */}
          <FilterBar
            filters={[
              {
                value: periodFilter,
                onChange: setPeriodFilter,
                placeholder: "Período",
                options: periodOptions
              }
            ]}
          >
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
          </FilterBar>

          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-6">
            <StatsCard
              title="Receita Total"
              value={formatCurrency(metrics.totalRevenue)}
              description="No período selecionado"
              icon={DollarSign}
              iconColor="text-green-600"
              valueColor="text-green-600"
            />
            <StatsCard
              title="Total de Sessões"
              value={metrics.totalSessions}
              description="Sessões realizadas"
              icon={Camera}
              iconColor="text-blue-600"
            />
            <StatsCard
              title="Ticket Médio"
              value={formatCurrency(metrics.averageSessionValue)}
              description="Valor médio por sessão"
              icon={TrendingUp}
              iconColor="text-purple-600"
            />
            <StatsCard
              title="Sessões Recentes"
              value={metrics.recentSessions}
              description="Últimos 30 dias"
              icon={CheckCircle}
              iconColor="text-green-600"
              valueColor="text-green-600"
            />
            <StatsCard
              title="Pagamentos Vencidos"
              value={metrics.overduePayments}
              description="Precisam atenção"
              icon={AlertTriangle}
              iconColor="text-red-600"
              valueColor="text-red-600"
            />
            <StatsCard
              title="Pagamentos Pendentes"
              value={metrics.pendingPayments}
              description="Aguardando pagamento"
              icon={XCircle}
              iconColor="text-yellow-600"
              valueColor="text-yellow-600"
            />
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
                        <span className="text-foreground font-medium">{item.monthName}</span>
                        <div className="flex gap-4">
                          <span className="text-green-600">{formatCurrency(item.revenue)}</span>
                          <span className="text-blue-600">{item.count} sessões</span>
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
                            style={{ width: `${(item.count / maxSessions) * 100}%` }}
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
                        <span className="text-foreground font-medium">{service.serviceType}</span>
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
                        <div className="text-sm text-muted-foreground">{client.totalSessions} sessões</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-foreground">{formatCurrency(client.totalRevenue)}</div>
                      <div className="text-sm text-muted-foreground">Total gasto</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <PageFooter />
    </div>
  );
};

export default RelatoriosPage;
