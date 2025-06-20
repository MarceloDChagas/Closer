import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button"
import { ScrollHeader } from "../components/scroll-header"
import { Link } from "react-router-dom"
import { Users, DollarSign, Camera, CheckCircle, AlertCircle, TrendingUp, Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ApiService } from "../services/api"
import { DashboardStats } from "../services/interfaces"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"

const Home: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const dashboardStats = await ApiService.getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        setError('Não foi possível carregar as estatísticas. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <ScrollHeader />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando estatísticas...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <ScrollHeader />
        <main className="flex-1 pt-16">
          <div className="container px-4 md:px-6 py-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollHeader />
      <main className="flex-1 pt-16">
        {/* Header Section */}
        <section className="bg-primary py-12">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img src="/images/logo-closer.png" alt="Estudio Closer" width={80} height={80} />
                <div>
                  <h1 className="text-3xl font-bold text-primary-foreground">Sistema de Gerenciamento</h1>
                  <p className="text-primary-foreground/80">Estudio Closer - Controle de Clientes e Serviços</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Cards */}
        <section className="py-8">
          <div className="container px-4 md:px-6">
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.newClientsThisMonth || 0} novo{stats?.newClientsThisMonth !== 1 ? 's' : ''} este mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Valores a Receber</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(stats?.pendingAmount || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.pendingSessions || 0} serviço{stats?.pendingSessions !== 1 ? 's' : ''} pendente{stats?.pendingSessions !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sessões Este Mês</CardTitle>
                  <Camera className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.sessionsThisMonth || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Total de {stats?.totalSessions || 0} sessões
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fotos Entregues</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.deliveredPhotos || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.pendingPhotos || 0} pendente{stats?.pendingPhotos !== 1 ? 's' : ''} de entrega
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats?.totalRevenue || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total recebido
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sessões Completadas</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.completedSessions || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.cancelledSessions || 0} cancelada{stats?.cancelledSessions !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats && stats.totalSessions > 0 
                      ? Math.round((stats.completedSessions / stats.totalSessions) * 100)
                      : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    De sessões finalizadas
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                  <CardDescription>Acesse as funcionalidades principais do sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link to="/clientes/cadastro" className="block">
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Cadastrar Novo Cliente
                    </Button>
                  </Link>
                  <Link to="/clientes/adicionar-servico" className="block">
                    <Button className="w-full justify-start" variant="outline">
                      <Camera className="mr-2 h-4 w-4" />
                      Registrar Novo Serviço
                    </Button>
                  </Link>
                  <Link to="/servicos" className="block">
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      Gerenciar Serviços
                    </Button>
                  </Link>
                  <Link to="/pagamentos" className="block">
                    <Button className="w-full justify-start" variant="outline">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Controlar Recebimentos
                    </Button>
                  </Link> 
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/50 mt-auto">
        <div className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo-closer.png" alt="Estudio Closer" width={24} height={24} />
            <div className="font-medium text-foreground">ESTUDIO CLOSER</div>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 Estudio Closer. Sistema de Gerenciamento.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home; 