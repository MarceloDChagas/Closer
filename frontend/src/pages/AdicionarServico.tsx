import React, { useState } from 'react';
import { Button } from "../components/ui/button"
import { ScrollHeader } from "../components/scroll-header"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { ArrowLeft, Plus } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Checkbox } from "../components/ui/checkbox"
import { ClienteSelector } from "../components/cliente-selector"
import { ApiService } from "../services/api"
import serviceTypeDefaults from '../utils/service.type.defaults';

const AdicionarServicoPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientId: '',
    serviceType: '',
    packageName: '',
    date: '',
    qtdFotos: '',
    valor: '',
    desconto: '',
    observacoes: '',
    fotosEntregues: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [availablePackages, setAvailablePackages] = useState<Array<{ nome: string; valor: string; qtdFotos: string }>>([])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceTypeChange = (serviceType: string) => {
    const serviceDefaults = serviceTypeDefaults.find(s => s.type === serviceType);
    
    if (serviceDefaults && serviceDefaults.pacotes.length > 0) {
      setAvailablePackages(serviceDefaults.pacotes);
      // Seleciona o primeiro pacote por padrão
      const firstPackage = serviceDefaults.pacotes[0];
      setFormData(prev => ({
        ...prev,
        serviceType,
        packageName: firstPackage.nome,
        valor: firstPackage.valor,
        qtdFotos: firstPackage.qtdFotos === 'ILIMITADAS' ? '999' : firstPackage.qtdFotos
      }));
    } else {
      setAvailablePackages([]);
      setFormData(prev => ({
        ...prev,
        serviceType,
        packageName: '',
        valor: '',
        qtdFotos: ''
      }));
    }
  };

  const handlePackageChange = (packageName: string) => {
    const selectedPackage = availablePackages.find(p => p.nome === packageName);
    
    if (selectedPackage) {
      setFormData(prev => ({
        ...prev,
        packageName,
        valor: selectedPackage.valor,
        qtdFotos: selectedPackage.qtdFotos === 'ILIMITADAS' ? '999' : selectedPackage.qtdFotos
      }));
    }
  };

  // Função para calcular o total
  const calculateTotal = () => {
    const valor = parseFloat(formData.valor) || 0;
    const desconto = parseFloat(formData.desconto) || 0;
    return (valor - desconto).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientId) {
      alert('Por favor, selecione um cliente');
      return;
    }

    if (!formData.serviceType) {
      alert('Por favor, selecione um tipo de serviço');
      return;
    }

    if (!formData.date) {
      alert('Por favor, informe a data da sessão');
      return;
    }

    if (!formData.valor) {
      alert('Por favor, informe o valor da sessão');
      return;
    }

    setIsLoading(true);

    try {
      const valor = parseFloat(formData.valor) || 0;
      const desconto = parseFloat(formData.desconto) || 0;
      const total = valor - desconto;

      // Criar sessão
      const sessionData = {
        date: formData.date,
        duration: 120, // Duração padrão de 2 horas
        status: 'COMPLETED',
        serviceType: formData.serviceType,
        photoDeliveryStatus: formData.fotosEntregues ? 'DELIVERED' : 'NOT_DELIVERED',
        clientId: formData.clientId
      };

      const session = await ApiService.createSession(sessionData);

      // Criar pagamento
      const paymentData = {
        amount: total,
        currency: 'BRL',
        status: 'PENDING',
        method: 'PIX',
        clientId: formData.clientId,
        sessionId: session.id
      };

      await ApiService.createPayment(paymentData);

      alert('Sessão registrada com sucesso!');
      navigate('/servicos');

    } catch (error) {
      console.error('Erro ao registrar sessão:', error);
      alert('Erro ao registrar sessão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate('/servicos')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-3xl font-bold">Registrar Sessão/Serviço</h1>
            </div>
            <Link to="/clientes/cadastro">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Sessão/Serviço</CardTitle>
              <CardDescription>Preencha as informações da nova sessão ou serviço</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="cliente">Cliente</Label>
                  <ClienteSelector 
                    onValueChange={(value) => handleInputChange('clientId', value)}
                    value={formData.clientId}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipoServico">Tipo de Serviço</Label>
                      <Select value={formData.serviceType} onValueChange={handleServiceTypeChange}>
                        <SelectTrigger id="tipoServico">
                          <SelectValue placeholder="Selecione o tipo de serviço" />
                        </SelectTrigger>
                        <SelectContent>
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
                    </div>

                    {availablePackages.length > 0 && (
                      <div className="space-y-2">
                        <Label htmlFor="pacote">Pacote</Label>
                        <Select value={formData.packageName} onValueChange={handlePackageChange}>
                          <SelectTrigger id="pacote">
                            <SelectValue placeholder="Selecione o pacote" />
                          </SelectTrigger>
                          <SelectContent>
                            {availablePackages.map((pkg, index) => (
                              <SelectItem key={index} value={pkg.nome}>
                                {pkg.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="dataServico">Data da Sessão</Label>
                      <Input 
                        id="dataServico" 
                        type="date" 
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Data em que a sessão foi realizada</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="qtdFotos">Quantidade de Fotos</Label>
                      <Input 
                        id="qtdFotos" 
                        type="number" 
                        placeholder="0"
                        value={formData.qtdFotos}
                        onChange={(e) => handleInputChange('qtdFotos', e.target.value)}
                      />
                    </div>

                    <div className="flex items-center space-x-2 mt-4">
                      <Checkbox 
                        id="fotosEntregues"
                        checked={formData.fotosEntregues}
                        onCheckedChange={(checked) => handleInputChange('fotosEntregues', !!checked)}
                      />
                      <Label
                        htmlFor="fotosEntregues"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Fotos já entregues
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="valor">Valor (R$)</Label>
                      <Input 
                        id="valor" 
                        type="number" 
                        placeholder="0,00"
                        value={formData.valor}
                        onChange={(e) => handleInputChange('valor', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="desconto">Desconto (R$)</Label>
                      <Input 
                        id="desconto" 
                        type="number" 
                        placeholder="0,00"
                        value={formData.desconto}
                        onChange={(e) => handleInputChange('desconto', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="total">Total (R$)</Label>
                      <Input 
                        id="total" 
                        type="number" 
                        placeholder="0,00"
                        className="font-bold"
                        value={calculateTotal()}
                        readOnly
                      />
                    </div>

                  </div>
                </div>

                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea 
                    id="observacoes" 
                    placeholder="Observações adicionais sobre o serviço" 
                    rows={3}
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={() => navigate('/servicos')} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Registrar Sessão'}
              </Button>
            </CardFooter>
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
  )
}

export default AdicionarServicoPage; 