# 🚦 Radares e Câmeras do Recife

Aplicação web interativa para visualização e consulta de **radares de velocidade, lombadas eletrônicas e câmeras de monitoramento da CTTU / Prefeitura da Cidade do Recife**.

O projeto integra dados abertos oficiais via API CKAN, com camada de cache inteligente em Redis, busca de endereços com geocodificação geográfica e visualização em mapas interativos com Leaflet.

<img src="https://i.imgur.com/NNYuq6A.png" alt="Prévia do Radares Recife" />

---

## 📱 Funcionalidades

- **Mapeamento Completo:** Visualização georreferenciada de todos os radares e câmeras de trânsito ativos do Recife.
- **Detalhes Técnicos:** Informações sobre velocidade permitida, tipo de equipamento, faixas fiscalizadas, sentido e VMD (Volume Médio Diário).
- **Filtro por Velocidade:** Filtragem dinâmica rápida de radares por limite de velocidade (ex: 40 km/h, 50 km/h, 60 km/h).
- **Busca de Endereços:** Autocomplete com delimitação geográfica exclusiva para a Região Metropolitana do Recife via API Photon.
- **Geolocalização do Usuário:** Botão "Minha Localização" para centralizar o mapa na posição atual.
- **Google Street View:** Atalho direto para abrir a visualização panorâmica da via no ponto exato do equipamento.
- **Resiliência e Fallback Offline:** Cache de 24h via Redis e contingência automática para dados locais em caso de indisponibilidade da API da Prefeitura.

---

## 🛠️ Tecnologias Utilizadas

- **[Next.js 14 (App Router)](https://nextjs.org/)** + **[React 18](https://react.dev/)** + **[TypeScript](https://www.typescriptlang.org/)**
- **[Leaflet](https://leafletjs.com/)** & **[React-Leaflet](https://react-leaflet.js.org/)** (com camada de trânsito)
- **[Tailwind CSS](https://tailwindcss.com/)** + **[React Icons](https://react-icons.github.io/react-icons/)**
- **[Redis](https://redis.io/)** (Cache-aside pattern com Docker)
- **[Biome](https://biomejs.dev/)** (Linter e formatador de código ultrarrápido)

---

## 🚀 Como Executar Localmente

### 📋 Pré-requisitos
- [Node.js 18+](https://nodejs.org/en)
- [Git](https://git-scm.com)
- [Docker](https://www.docker.com/) (opcional, para rodar o Redis)

### 🎲 Passo a passo:

```bash
# 1. Clone o repositório
$ git clone https://github.com/GabrielFeijo/Radares-Recife.git
$ cd Radares-Recife

# 2. Instale as dependências
$ npm install

# 3. Configure o arquivo de ambiente (.env)
$ cp .env.example .env

# 4. (Opcional) Inicie o Redis via Docker Compose
$ docker compose up -d

# 5. Inicie o servidor de desenvolvimento
$ npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📜 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção otimizada
- `npm run start` - Inicia o servidor em modo de produção
- `npm run lint` - Executa a verificação estática com Biome
- `npm run lint:fix` - Corrige problemas de lint e formatação automaticamente com Biome
- `npm run format` - Formata o código com Biome

---

## 🌐 Dados Abertos

Fonte oficial: [Portal de Dados Abertos da Cidade do Recife](http://dados.recife.pe.gov.br/) (CTTU - Autarquia de Trânsito e Transporte Urbano).

