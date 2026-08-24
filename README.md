# 🚦 Radares e Câmeras do Recife - Mapa Interativo CTTU

> Aplicação web interativa para visualização georreferenciada e consulta técnica de radares de velocidade, lombadas eletrônicas e câmeras de monitoramento da CTTU / Prefeitura do Recife.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)](https://leafletjs.com/)
[![Redis](https://img.shields.io/badge/Redis-7.0-DC382D?logo=redis)](https://redis.io/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.0-FF4154?logo=react-query)](https://tanstack.com/query)
[![Biome](https://img.shields.io/badge/Biome-2.5-60A5FA?logo=biome)](https://biomejs.dev/)

<br />

<img src="https://i.imgur.com/NNYuq6A.png" alt="Prévia do Radares Recife" />

---

## 📋 Sobre o Projeto

O **Radares e Câmeras do Recife** é uma plataforma moderna desenvolvida para transformar dados abertos da **CTTU (Autarquia de Trânsito e Transporte Urbano)** em uma experiência visual ágil e acessível para motoristas, ciclistas e cidadãos do Recife.

A aplicação integra dados oficiais via API CKAN Datastore da Prefeitura, implementando arquitetura resiliente com cache em Redis (Cache-Aside), marcadores compostos atômicos com renderização por GPU, busca inteligente com delimitação geográfica via API Photon e popups técnicos com atalhos para Google Street View e rotas.

### 🎯 Destaques Técnicos

- **Marcadores Compostos Atômicos**: Renderização de etiquetas de velocidade integradas diretamente aos ícones via CSS/GPU, garantindo 0ms de latência e ausência de bugs no zoom.
- **Clusterização de Alta Performance**: Agrupamento dinâmico e inteligente com `Leaflet.markercluster` para manter 60 FPS mesmo com centenas de equipamentos no mapa.
- **Resiliência Tripla (Zero Downtime)**: Estratégia em camadas (Redis 24h ➔ API CKAN Oficial ➔ Fallback Local em JSON).
- **Busca de Vias Geocodificada**: Autocomplete delimitado exclusivamente para a Região Metropolitana do Recife (RMR) via API Photon (OpenStreetMap).
- **Popups Técnicos de Alto Nível**: Detalhes completos sobre limite de velocidade, faixas fiscalizadas, sentido da via, fluxo médio diário (VMD), registro INMETRO e cópia de coordenadas GPS com um clique.
- **Integração com Navegação**: Acesso direto ao Google Street View em 360° e traçado de rotas via Google Maps / Waze.

---

## 🌐 Demonstração & Dados Abertos

### Aplicações e Fontes Oficiais

| Recurso                  | URL / Fonte                                              | Descrição                                         |
| :----------------------- | :------------------------------------------------------- | :------------------------------------------------ |
| **Portal Dados Abertos** | [dados.recife.pe.gov.br](http://dados.recife.pe.gov.br/) | Fonte oficial dos dados de trânsito da CTTU / PCR |
| **API de Geocodificação**| [photon.komoot.io](https://photon.komoot.io/)            | Geocodificação OpenStreetMap delimitada para RMR  |

### 📍 Camadas Disponíveis no Mapa

- **Radares e Lombadas Eletrônicas**: Fiscalização fixa de velocidade com filtro dinâmico por velocidade (40, 50, 60 km/h).
- **Câmeras de Monitoramento**: Câmeras da CTTU georreferenciadas com identificação de logradouros e cruzamentos.
- **Geolocalização do Usuário**: Centralização instantânea na posição GPS atual.

---

## 🚀 Início Rápido

### 📋 Pré-requisitos

Certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) 18+
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) (opcional, para execução do Redis local)

### 💻 Instalação Local

1. **Clone o repositório**

   ```bash
   git clone https://github.com/GabrielFeijo/Radares-Recife.git
   cd Radares-Recife
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**

   ```bash
   cp .env.example .env
   ```

4. **(Opcional) Inicie o container do Redis**

   ```bash
   docker compose up -d
   ```

5. **Inicie o servidor de desenvolvimento**

   ```bash
   npm run dev
   ```

6. **Acesse a aplicação**
   - Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📜 Scripts Disponíveis

| Comando            | Descrição                                              |
| :----------------- | :----------------------------------------------------- |
| `npm run dev`      | Inicia o servidor de desenvolvimento com Next.js       |
| `npm run build`    | Gera o build de produção otimizado                     |
| `npm run start`    | Inicia a aplicação em modo de produção                 |
| `npm run lint`     | Executa a análise estática do código com Biome         |
| `npm run lint:fix` | Corrige problemas de lint e formatação automaticamente |
| `npm run format`   | Formata todos os arquivos do projeto com Biome         |

---

## 📦 Estrutura do Projeto

```text
radares-recife/
├── public/                     # Ativos estáticos e ícones
│
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── api/
│   │   │   ├── cache/route.ts  # Endpoint de diagnóstico do Redis
│   │   │   ├── cameras/route.ts# Endpoint de câmeras CTTU
│   │   │   └── radars/route.ts # Endpoint de radares
│   │   ├── globals.css         # Estilos globais e componentes do mapa
│   │   ├── layout.tsx          # Root Layout com Plus Jakarta Sans e QueryProvider
│   │   └── page.tsx            # Página inicial (Client-side dynamic map)
│   │
│   ├── components/
│   │   ├── map/                # Componentes do mapa interativo
│   │   │   ├── camera-marker.tsx         # Marcador e popup de câmeras
│   │   │   ├── map-component.tsx         # Orquestrador do mapa Leaflet
│   │   │   ├── map-controls.tsx          # Painel de controle flutuante
│   │   │   ├── map-icons.ts              # Gerador de ícones e pins SVG
│   │   │   ├── marker-cluster-group.tsx  # Agrupamento dinâmico em clusters
│   │   │   ├── popup-actions.tsx         # Botões de ação (Street View, Rotas)
│   │   │   ├── popup-gps-row.tsx         # Barra de cópia de coordenadas GPS
│   │   │   ├── popup-header.tsx          # Cabeçalho com indicador de status
│   │   │   ├── radar-marker.tsx          # Marcador e popup técnico do radar
│   │   │   └── speed-filter-panel.tsx    # Filtro rápido por velocidade
│   │   ├── search/
│   │   │   └── address-search.tsx        # Busca de vias com autocomplete
│   │   └── ui/
│   │       └── toast.tsx                 # Notificações toast
│   │
│   ├── constants/              # Bounding box, IDs CKAN e coordenadas padrão
│   ├── data/                   # Fallback local em JSON (radares e câmeras)
│   ├── hooks/                  # Custom Hooks (useRadars, useCameras, useGeolocation...)
│   ├── lib/                    # Clientes de integração (CKAN API e Redis)
│   ├── providers/              # Provedor TanStack Query
│   ├── services/               # Serviços de negócio (radar, câmera, geocodificação)
│   ├── types/                  # Tipagens estritas TypeScript
│   └── utils/                  # Formatadores e utilitários de mapa
│
├── docker-compose.yml          # Container Redis para cache local
├── biome.json                  # Configuração do linter e formatador Biome
├── tailwind.config.ts          # Configuração Tailwind CSS
├── tsconfig.json               # Configuração TypeScript
├── package.json
└── README.md
```

---

## 📊 Tecnologias Utilizadas

| Tecnologia               | Versão | Uso                                                   |
| :----------------------- | :----- | :---------------------------------------------------- |
| **Next.js**              | 14.2   | Framework full-stack React com App Router             |
| **React**                | 18.3   | Biblioteca de interface de usuário                    |
| **TypeScript**           | 5.x    | Tipagem estática e segurança de código                |
| **Leaflet**              | 1.9    | Motor cartográfico e renderização de mapas            |
| **React Leaflet**        | 4.2    | Integração do Leaflet com o ecossistema React         |
| **Leaflet MarkerCluster**| 1.5    | Agrupamento de marcadores por densidade geográfica    |
| **Tailwind CSS**         | 3.4    | Framework utilitário de estilização responsiva        |
| **Plus Jakarta Sans**    | Google | Tipografia moderna para interfaces de dados e mobilidade |
| **Redis**                | 7.0    | Cache em memória (Cache-Aside pattern)                |
| **TanStack Query**       | 5.102  | Gerenciamento de estado assíncrono e cache no cliente |
| **Biome**                | 2.5    | Linter e formatador de código ultrarrápido            |
