import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles"
import { ThemeProvider } from "./components/theme-provider"
import CssBaseline from "@mui/material/CssBaseline"
import muiTheme from "./theme"

// Páginas
import Home from "./pages/Home"
import ClientesPage from "./pages/Clientes"
import ServicosPage from "./pages/Servicos"
import CadastroClientePage from "./pages/CadastroCliente"
import AdicionarServicoPage from "./pages/AdicionarServico"

import PagamentosPage from "./pages/Pagamentos"
import RelatoriosPage from "./pages/Relatorios"
import RegistrarPagamentoPage from "./pages/RegistrarPagamento"

const App: React.FC = () => {
  return (
    <MuiThemeProvider theme={muiTheme}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/servicos" element={<ServicosPage />} />
            <Route path="/clientes/cadastro" element={<CadastroClientePage />} />
            <Route path="/clientes/adicionar-servico" element={<AdicionarServicoPage />} />
            <Route path="/pagamentos" element={<PagamentosPage />} />
            <Route path="/relatorios" element={<RelatoriosPage />} />
            <Route path="/clientes/registrar-pagamento" element={<RegistrarPagamentoPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </MuiThemeProvider>
  )
}

export default App
