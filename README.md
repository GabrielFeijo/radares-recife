# Radares-Recife

Este é um projeto que utiliza a API do Google Maps e dados fornecidos pela Prefeitura do Recife e CTTU para mostrar todas as localizações de radares presentes na cidade do Recife. O projeto visa fornecer informações úteis sobre os radares, como tipo de equipamento, registro no INMETRO, local de instalação, sentido de fiscalização, velocidade fiscalizada, entre outros.

<img src="https://i.imgur.com/NNYuq6A.png" />

## 📱 Funcionalidades

- Visualização de Localizações de Radares: Os usuários podem visualizar todas as localizações de radares na cidade do Recife em um mapa interativo.
- Detalhes sobre os Radares: Os usuários podem clicar em cada marcador de radar para visualizar detalhes específicos, como tipo de equipamento, número de série, local de instalação, sentido de fiscalização, velocidade fiscalizada, entre outros.
- Integração com API do Google Maps: Utilização da API do Google Maps para renderizar o mapa e adicionar marcadores de radar.

## 👾 Experimente

Para acessar o projeto, clique no link: [Radares-Recife](https://radaresrecife.vercel.app/).

## 🚀 Começo

Estas instruções permitirão que você obtenha uma cópia de trabalho do projeto em sua máquina local para fins de desenvolvimento e teste.

### 📋 Pré-requisitos

Antes de começar, você precisará ter as seguintes ferramentas instaladas em sua máquina:
[Git](https://git-scm.com),
[NodeJS](https://nodejs.org/en).

Também é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

---

### 🎲 Colocando o projeto para funcionar localmente:

```bash
# Clone o repositório
$ git clone https://github.com/GabrielFeijo/Radares-Recife
```

```bash
# Acesse a pasta do projeto em terminal/cmd
$ cd Radares-Recife

# Instale as dependências
npm install

# Configure as variáveis de ambiente no arquivo .env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=""
NEXT_PUBLIC_API_URL="http://dados.recife.pe.gov.br/api/3/action/datastore_search?resource_id=e4c5acc3-c0b9-4127-ad08-472c5b9b003f"

# Inicie a aplicação em DEV:
$ npm run dev
```

---

## 🛠️ Feito utilizando

<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="40" height="45" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" width="40" height="45" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" width="40" height="45" /> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="45" height="45"/>
