import React, { useState } from "react"
import { Button } from "../components/ui/button"
import { ScrollHeader } from "../components/scroll-header"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { ArrowLeft, Upload, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { useNavigate } from "react-router-dom"
import { ApiService } from "../services/api"

const CadastroClientePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nomeCliente: "",
    nomeBebe: "",
    email: "",
    celular: "",
    telefone: "",
    dataNascimento: "",
    endereco: "",
    instagram: "",
    indicacao: "",
    observacoes: "",
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tamanho do arquivo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Arquivo muito grande. Tamanho máximo: 5MB")
        return
      }

      // Validar tipo do arquivo
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione apenas arquivos de imagem")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações básicas
    if (!formData.nomeCliente.trim()) {
      alert("Nome do cliente é obrigatório")
      return
    }

    if (!formData.email.trim()) {
      alert("Email é obrigatório")
      return
    }

    if (!formData.celular.trim()) {
      alert("Celular é obrigatório")
      return
    }

    setIsLoading(true)

    try {
      const nameParts = formData.nomeCliente.trim().split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ') || firstName

      const addressParts = formData.endereco.split(',').map(part => part.trim())
      const street = addressParts[0] || 'Não informado'
      const city = addressParts[1] || 'Não informado'
      const state = addressParts[2] || 'Não informado'
      const zipCode = addressParts[3] || '00000-000'

      const clientData = {
        name: {
          firstName,
          lastName
        },
        email: formData.email,
        phone: formData.celular,
        address: {
          street,
          city,
          state,
          zipCode
        }
      }

      // Salvar no banco de dados via API
      const response = await ApiService.createClient(clientData)
      
      alert("Cliente cadastrado com sucesso!")
      console.log("Cliente criado:", response)

      // Reset do formulário
      setFormData({
        nomeCliente: "",
        nomeBebe: "",
        email: "",
        celular: "",
        telefone: "",
        dataNascimento: "",
        endereco: "",
        instagram: "",
        indicacao: "",
        observacoes: "",
      })
      setSelectedImage(null)

      // Redirecionar para a lista de clientes
      navigate('/clientes')

    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error)
      alert("Erro ao cadastrar cliente. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (window.confirm("Deseja cancelar o cadastro? Todos os dados serão perdidos.")) {
      navigate(-1)
    }
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
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold">Cadastrar Novo Cliente</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Foto do Cliente */}
              <Card>
                <CardHeader>
                  <CardTitle>Foto do Cliente *</CardTitle>
                  <CardDescription>Adicione uma foto para identificação do cliente.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 border-2 border-dashed border-border rounded-full flex items-center justify-center bg-muted overflow-hidden">
                    {selectedImage ? (
                      <img
                        src={selectedImage || "/placeholder.svg"}
                        alt="Preview do cliente"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="w-full">
                    <Label htmlFor="foto" className="cursor-pointer">
                      <div className="flex items-center justify-center w-full p-3 border border-border rounded-md hover:bg-muted transition-colors">
                        <Upload className="w-4 h-4 mr-2" />
                        {selectedImage ? "Alterar Foto" : "Adicionar Foto"}
                      </div>
                      <Input id="foto" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Formatos aceitos: JPG, PNG, GIF
                    <br />
                    Tamanho máximo: 5MB
                  </p>
                </CardContent>
              </Card>

              {/* Informações Pessoais */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Dados pessoais e de contato do cliente.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nomeCliente">Nome do Cliente *</Label>
                      <Input
                        id="nomeCliente"
                        name="nomeCliente"
                        placeholder="Nome completo do cliente"
                        value={formData.nomeCliente}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nomeBebe">Nome do Bebê</Label>
                      <Input
                        id="nomeBebe"
                        name="nomeBebe"
                        placeholder="Nome do bebê (se aplicável)"
                        value={formData.nomeBebe}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="email@exemplo.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="celular">Celular *</Label>
                      <Input
                        id="celular"
                        name="celular"
                        placeholder="(00) 00000-0000"
                        value={formData.celular}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone Fixo</Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        placeholder="(00) 0000-0000"
                        value={formData.telefone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                      <Input
                        id="dataNascimento"
                        name="dataNascimento"
                        type="date"
                        value={formData.dataNascimento}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="endereco">Endereço Completo</Label>
                      <Input
                        id="endereco"
                        name="endereco"
                        placeholder="Rua, número, bairro, cidade, CEP"
                        value={formData.endereco}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        name="instagram"
                        placeholder="@usuario"
                        value={formData.instagram}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="indicacao">Como nos conheceu?</Label>
                      <Input
                        id="indicacao"
                        name="indicacao"
                        placeholder="Instagram, indicação, etc."
                        value={formData.indicacao}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      name="observacoes"
                      placeholder="Informações adicionais sobre o cliente, preferências, alergias, etc."
                      rows={4}
                      value={formData.observacoes}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Cadastrando..." : "Cadastrar Cliente"}
                  </Button>
                </CardFooter>
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
                      Após cadastrar o cliente, você poderá adicionar serviços na aba "Adicionar Serviço". Lá você
                      poderá selecionar este cliente e registrar todos os serviços contratados.
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
  )
}

export default CadastroClientePage; 