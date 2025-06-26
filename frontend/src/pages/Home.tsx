import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button"
import { ScrollHeader } from "../components/scroll-header"
import Link from 'next/link'
import { Users, DollarSign, Camera, CheckCircle, AlertCircle, TrendingUp, Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ApiService } from "../services/api"
import { DashboardStats } from "../services/interfaces"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { StatsCard } from "../components/StatsCard"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { PageFooter } from "../components/PageFooter"

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
    return <LoadingSpinner message="Carregando estatísticas..." />;
  }

  if (error && !stats) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <ScrollHeader />
        <main className="flex-1 pt-16">
          <div className="container px-4 md:px-6 py-8">
            <Alert variant="destructive">
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
              <StatsCard
                title="Total de Clientes"
                value={stats?.totalClients || 0}
                description={`${stats?.newClientsThisMonth || 0} novo${stats?.newClientsThisMonth !== 1 ? 's' : ''} este mês`}
                icon={Users}
              />
              <StatsCard
                title="Valores a Receber"
                value={formatCurrency(stats?.pendingAmount || 0)}
                description={`${stats?.pendingSessions || 0} serviço${stats?.pendingSessions !== 1 ? 's' : ''} pendente${stats?.pendingSessions !== 1 ? 's' : ''}`}
                icon={DollarSign}
              />
              <StatsCard
                title="Sessões Este Mês"
                value={stats?.sessionsThisMonth || 0}
                description={`Total de ${stats?.totalSessions || 0} sessões`}
                icon={Camera}
                iconColor="text-blue-600"
              />
              <StatsCard
                title="Fotos Entregues"
                value={stats?.deliveredPhotos || 0}
                description={`${stats?.pendingPhotos || 0} pendente${stats?.pendingPhotos !== 1 ? 's' : ''} de entrega`}
                icon={CheckCircle}
                iconColor="text-green-600"
              />
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatsCard
                title="Receita Total"
                value={formatCurrency(stats?.totalRevenue || 0)}
                description="Total recebido"
                icon={TrendingUp}
                iconColor="text-green-600"
                valueColor="text-green-600"
              />
              <StatsCard
                title="Clientes com Fotos Pendentes"
                value={stats?.pendingPhotos || 0}
                description="Precisam receber fotos"
                icon={Camera}
                iconColor="text-yellow-600"
                valueColor="text-yellow-600"
              />
              <StatsCard
                title="Clientes com Pagamentos Pendentes"
                value={stats?.pendingSessions || 0}
                description="Precisam efetuar pagamento"
                icon={Calendar}
                iconColor="text-red-600"
                valueColor="text-red-600"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                  <CardDescription>Acesse as funcionalidades principais do sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/clientes/cadastro" className="block">
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Cadastrar Novo Cliente
                    </Button>
                  </Link>
                  <Link href="/clientes/adicionar-servico" className="block">
                    <Button className="w-full justify-start" variant="outline">
                      <Camera className="mr-2 h-4 w-4" />
                      Registrar Novo Serviço
                    </Button>
                  </Link>
                  <Link href="/servicos" className="block">
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      Gerenciar Serviços
                    </Button>
                  </Link>
                  <Link href="/pagamentos" className="block">
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

      <PageFooter />
    </div>
  )
}

export default Home; 