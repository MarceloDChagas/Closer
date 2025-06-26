import React from "react"
import type { AppProps } from "next/app"
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles"
import { ThemeProvider } from "../src/components/theme-provider"
import CssBaseline from "@mui/material/CssBaseline"
import muiTheme from "../src/theme"
import "../src/output.css"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MuiThemeProvider theme={muiTheme}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </MuiThemeProvider>
  )
} 