# Orienta Mais - Frontend Web

<p align="center">
  <img src="public/logoMentored.png" alt="Orienta Mais Logo" width="120" />
</p>

<p align="center">
  <strong>Plataforma de Mentoria Educacional</strong><br>
  Conectando mentores e mentorados para um aprendizado transformador
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-20.1.7-DD0031?logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/PrimeNG-20.0.1-3498DB?logo=primeng&logoColor=white" alt="PrimeNG" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.1.12-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
</p>

---

## Índice

- [Descrição Resumida](#-descrição-resumida)
- [Descrição Completa](#-descrição-completa)
- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Como Instalar e Configurar](#-como-instalar-e-configurar)
- [Como Rodar o Projeto](#-como-rodar-o-projeto)
- [Como Rodar os Testes](#-como-rodar-os-testes)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Principais Endpoints da API](#-principais-endpoints-da-api)
- [Entidades e Modelos Principais](#-entidades-e-modelos-principais)
- [Configurações Importantes](#-configurações-importantes)
- [Fluxos Internos do Sistema](#-fluxos-internos-do-sistema)
- [Guia para Desenvolvedores](#-guia-para-desenvolvedores)
- [Guia para Usuários Finais](#-guia-para-usuários-finais)
- [Erros Comuns e Soluções](#-erros-comuns-e-soluções)
- [Roadmap](#-roadmap)
- [Licença](#-licença)
- [Autores](#-autores)

---

## Descrição Resumida

O **Orienta Mais** é uma plataforma web de mentoria educacional que conecta **mentores** (profissionais experientes) com **mentorados** (estudantes ou pessoas em desenvolvimento profissional). O sistema permite a criação, gerenciamento e participação em aulas/mentorias online, com sistema de avaliações e feedback.

### Para quem é?

- **Mentores**: Profissionais que desejam compartilhar conhecimento através de aulas e mentorias
- **Mentorados**: Estudantes ou profissionais em busca de orientação e aprendizado
- **Administradores**: Gestores da plataforma que monitoram métricas e gerenciam políticas

### Problema que resolve

- Dificuldade em encontrar mentores qualificados
- Falta de uma plataforma centralizada para agendamento de mentorias
- Ausência de sistema de avaliação e feedback entre mentores e mentorados
- Gestão descentralizada de aulas e encontros online

---

## Descrição Completa

O **Orienta Mais** é uma aplicação frontend construída em **Angular 20** que oferece uma interface moderna e responsiva para uma plataforma de mentoria. O sistema implementa:


### Diferenciais

- **Autenticação JWT** com refresh token automático
- **Controle de acesso baseado em roles** (MENTOR, MENTORED, ADMIN)
- **Aceite obrigatório de termos de uso** antes de acessar a plataforma
- **Conversão automática de timezone** (Backend UTC → Frontend Brasília)
- **Interface responsiva** com TailwindCSS e PrimeNG
- **Validação de formulários** em tempo real

---

## Tecnologias Utilizadas

### Core

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Angular** | 20.1.7 | Framework principal |
| **TypeScript** | 5.8.3 | Linguagem de programação |
| **RxJS** | 7.8.0 | Programação reativa |
| **Zone.js** | 0.15.1 | Detecção de mudanças |

### UI/UX

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **PrimeNG** | 20.0.1 | Biblioteca de componentes UI |
| **PrimeIcons** | 7.0.0 | Ícones do PrimeNG |
| **TailwindCSS** | 4.1.12 | Framework CSS utilitário |
| **Toastify-JS** | 1.12.0 | Notificações toast |
| **Chart.js** | 4.5.1 | Gráficos para dashboard |

### Autenticação

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **jwt-decode** | 4.0.0 | Decodificação de tokens JWT |

### Desenvolvimento

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **ESLint** | 8.57.1 | Linter para código |
| **Prettier** | 3.6.2 | Formatador de código |
| **Karma** | 6.4.0 | Test runner |
| **Jasmine** | 5.6.0 | Framework de testes |

---

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

| Requisito | Versão Mínima | Verificar |
|-----------|---------------|-----------|
| **Node.js** | 18.x ou superior | `node --version` |
| **npm** | 9.x ou superior | `npm --version` |
| **Angular CLI** | 20.x | `ng version` |
| **Git** | 2.x | `git --version` |

### Backend Necessário

O frontend depende de uma API backend rodando em `http://localhost:8080/api`. Certifique-se de que o backend do Orienta Mais está em execução antes de iniciar o frontend.

---

## Como Instalar e Configurar

### 1. Clonar o Repositório

```bash
git clone https://github.com/orienta-mais/web.git
cd web
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

O arquivo de ambiente está localizado em `src/environments/environment.ts`:

```typescript
export const environment = {
  BASE_API: 'http://localhost:8080/api',
};
```

Para produção, crie um arquivo `environment.prod.ts` com a URL do servidor de produção:

```typescript
export const environment = {
  BASE_API: 'https://api.orientamais.com.br/api',
};
```

### 4. Verificar Configuração

```bash
# Verificar se o Angular CLI está funcionando
ng version

# Verificar se as dependências foram instaladas
npm list --depth=0
```

---

## Como Rodar o Projeto

### Via Terminal (Desenvolvimento)

```bash
# Inicia com lint e formatação automática
npm start

# Ou diretamente sem verificações
ng serve
```

A aplicação estará disponível em: **http://localhost:4200**

### Via Terminal (Build de Produção)

```bash
# Gera build otimizado para produção
npm run build

# Os arquivos serão gerados em: dist/orienta-mais/
```

### Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor de desenvolvimento (com lint e format) |
| `npm run build` | Gera build de produção |
| `npm run lint:fix` | Executa ESLint com correção automática |
| `npm run format` | Formata código com Prettier |

---

## Como Rodar os Testes

### Testes Unitários

```bash
# Executa testes uma vez
ng test --watch=false

# Executa testes em modo watch
ng test

# Com cobertura de código
ng test --code-coverage
```

### Estrutura de Testes

Os arquivos de teste seguem o padrão `*.spec.ts` e estão localizados junto aos componentes:

```
component/
├── component.component.ts
├── component.component.html
├── component.component.css
└── component.component.spec.ts  ← Arquivo de teste
```

---

## Estrutura de Pastas

```
src/
├── app/
│   ├── @core/                    # Núcleo da aplicação
│   │   ├── enums/                # Enumerações
│   │   │   ├── policy.enum.ts    # Tipos de política (PRIVACY, TERMS)
│   │   │   ├── role.enum.ts      # Roles de usuário (MENTOR, MENTORED, ADMIN)
│   │   │   └── year-user.enum.ts # Idade mínima por tipo de usuário
│   │   │
│   │   ├── guards/               # Guards de rota
│   │   │   └── auth/
│   │   │       ├── auth.guard.ts           # Proteção de rotas autenticadas
│   │   │       ├── registerUser.guard.ts   # Validação de registro
│   │   │       ├── terms.guard.ts          # Verificação de aceite de termos
│   │   │       └── verificationSendEmail.guard.ts
│   │   │
│   │   ├── interceptors/         # Interceptadores HTTP
│   │   │   └── token.interceptor.ts  # Adiciona JWT e gerencia refresh
│   │   │
│   │   ├── interfaces/           # Tipos TypeScript
│   │   │   ├── api.interface.ts
│   │   │   ├── auth.interface.ts      # Login, tokens, senhas
│   │   │   ├── dashboard.interface.ts # Estatísticas admin
│   │   │   ├── lesson.interface.ts    # Filtros de aulas
│   │   │   ├── mentor.interface.ts    # Mentor e aulas
│   │   │   └── mentored.interface.ts  # Mentorado
│   │   │
│   │   ├── services/             # Serviços de comunicação
│   │   │   ├── admin/            # Estatísticas e políticas
│   │   │   ├── auth/             # Autenticação
│   │   │   ├── datetime/         # Conversão de timezone
│   │   │   ├── lesson/           # CRUD de aulas
│   │   │   ├── mentor/           # Operações de mentor
│   │   │   ├── mentored/         # Operações de mentorado
│   │   │   ├── policy/           # Termos e políticas
│   │   │   ├── token/            # Gerenciamento de tokens
│   │   │   └── user/             # Dados do usuário logado
│   │   │
│   │   ├── utils/                # Utilitários
│   │   │   └── removeMaskPhone.utils.ts
│   │   │
│   │   └── validators/           # Validadores customizados
│   │       ├── email/            # Validação de email
│   │       ├── fieldEmpty/       # Validação de campos vazios
│   │       ├── urls/             # Validação de URLs (LinkedIn)
│   │       └── uuid/             # Validação de UUID
│   │
│   ├── modules/                  # Módulos de funcionalidades
│   │   ├── auth/                 # Autenticação
│   │   │   ├── forgot-password/  # Esqueci minha senha
│   │   │   ├── login/            # Tela de login
│   │   │   ├── register-user/    # Registro de usuários
│   │   │   │   ├── register-mentor/
│   │   │   │   └── register-mentored/
│   │   │   ├── reset-password/   # Redefinir senha
│   │   │   ├── send-validate-email/
│   │   │   └── update-password/  # Atualizar senha
│   │   │
│   │   ├── main/                 # Layout principal
│   │   │   ├── header/           # Cabeçalho com navegação
│   │   │   └── home/             # Página inicial
│   │   │
│   │   ├── pages/                # Páginas por role
│   │   │   ├── accept-of-terms/  # Aceite de termos
│   │   │   ├── admin/            # Páginas de administrador
│   │   │   │   ├── admin-policys/
│   │   │   │   └── dashboard/
│   │   │   ├── meeting/          # Reuniões (futuro)
│   │   │   ├── mentor/           # Páginas de mentor
│   │   │   │   ├── lesson/       # CRUD de aulas
│   │   │   │   ├── mentor-review/# Avaliações recebidas
│   │   │   │   └── profile/      # Perfil do mentor
│   │   │   └── mentored/         # Páginas de mentorado
│   │   │       ├── mentored-lesson/
│   │   │       ├── mentored-profile/
│   │   │       └── mentored-review-of-mentor/
│   │   │
│   │   └── policys/              # Visualização de políticas
│   │
│   ├── shared/                   # Componentes compartilhados
│   │   ├── components/
│   │   │   └── toast/            # Serviço de notificações
│   │   ├── constants/            # Constantes (estados, países)
│   │   └── terms-checkbox/       # Checkbox de aceite de termos
│   │
│   ├── app.component.ts          # Componente raiz
│   ├── app.config.ts             # Configuração da aplicação
│   └── app.routes.ts             # Definição de rotas
│
├── assets/                       # Arquivos estáticos
├── environments/                 # Configurações de ambiente
│   └── environment.ts
├── index.html                    # HTML principal
├── main.ts                       # Bootstrap da aplicação
└── styles.css                    # Estilos globais
```

---

## Guia para Desenvolvedores

### Padrões de Código

1. **Nomenclatura de Arquivos**
   - Componentes: `nome.component.ts`
   - Serviços: `nome.service.ts`
   - Guards: `nome.guard.ts`
   - Interfaces: `nome.interface.ts`

2. **Estrutura de Componentes**
   ```typescript
   @Component({
     selector: 'app-nome',
     standalone: true,
     imports: [/* dependências */],
     templateUrl: './nome.component.html',
     styleUrls: ['./nome.component.css'],
   })
   export class NomeComponent implements OnInit {
     // Propriedades
     // Constructor com DI
     // ngOnInit
     // Métodos públicos
     // Métodos privados
     // Getters
   }
   ```

3. **Commits**
   - Use mensagens descritivas em português
   - Prefixos sugeridos: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`

### Como Adicionar Novas Funcionalidades

1. **Novo Componente**
   ```bash
   ng generate component modules/pages/[role]/[nome-feature]
   ```

2. **Novo Serviço**
   ```bash
   ng generate service @core/services/[nome]/[nome]
   ```

3. **Nova Rota**
   - Adicionar em `app.routes.ts`
   - Configurar guards e roles necessários

### Comandos Úteis

```bash
# Lint com correção
npm run lint:fix

# Formatação
npm run format

# Gerar componente standalone
ng g c modules/pages/mentor/nova-feature --standalone

# Gerar serviço
ng g s @core/services/novo/novo
```

---

## Guia para Usuários Finais

### Como se Cadastrar

1. Acesse a tela de login
2. Clique em **"Cadastrar"**
3. Informe seu email e selecione se é **Mentor** ou **Mentorado**
4. Verifique seu email e clique no link de confirmação
5. Preencha o formulário de cadastro completo
6. Clique em **"Enviar"**
7. Faça login com suas credenciais

### Como Criar uma Aula (Mentor)

1. Faça login como mentor
2. Acesse **"Minhas Aulas"** no menu
3. Clique em **"Criar Aula"**
4. Preencha os campos:
   - Título da aula
   - Descrição detalhada
   - Data e horários (início e fim)
   - Máximo de participantes
   - Código de presença
   - Links adicionais (opcional)
5. Clique em **"Criar"**

### Como se Inscrever em uma Aula (Mentorado)

1. Faça login como mentorado
2. Acesse **"Aulas Disponíveis"** no menu
3. Use os filtros para encontrar aulas de interesse
4. Clique na aula desejada para ver detalhes
5. Clique em **"Inscrever-se"**

### Como Avaliar um Mentor

1. Participe de uma aula
2. Após a aula (data passada), acesse seus registros
3. Clique na aula finalizada
4. Clique em **"Realizar Feedback"**
5. Avalie de 1 a 5 estrelas em cada critério
6. Escreva um comentário (opcional)
7. Clique em **"Enviar"**

---

## Erros Comuns e Soluções

| Erro | Causa | Solução |
|------|-------|---------|
| `CORS Error` | Backend não configurado para aceitar requisições do frontend | Verificar configuração CORS no backend |
| `401 Unauthorized` | Token expirado ou inválido | Fazer logout e login novamente |
| `403 Forbidden` | Tentativa de acessar recurso sem permissão | Verificar se o role do usuário tem acesso |
| `Formulário não envia` | Validação falhando | Verificar campos obrigatórios e formatos |
| `Página em branco` | Erro de JavaScript | Abrir DevTools (F12) e verificar console |
| `Data/hora incorreta` | Problema de timezone | Verificar se backend está enviando UTC |

---

## Licença

Este projeto é proprietário e de uso exclusivo do **Orienta Mais**.

---

## Autores

Desenvolvido pela equipe **Orienta Mais**.

Para contribuir ou reportar problemas, entre em contato através do repositório oficial.

---

<p align="center">
  <strong>Orienta Mais</strong> - Conectando conhecimento e oportunidades 🎓
</p>
