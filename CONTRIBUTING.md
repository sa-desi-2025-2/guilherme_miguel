# Guia de Contribuição para o OtimizeTour

Agradecemos o seu interesse em contribuir para o desenvolvimento do OtimizeTour, o software de viagem inteligente que gera roteiros personalizados! Seu esforço é fundamental para otimizar o tempo e o orçamento de futuros viajantes.

Este guia detalha o processo para submeter sugestões, reportar bugs e enviar código.

## Como Reportar um Bug

Antes de abrir um novo bug report, por favor, verifique a lista de Issues existentes para garantir que o problema ainda não foi reportado.

Para reportar um bug de forma eficaz, siga o modelo abaixo e preencha o máximo de detalhes possível, especialmente se for relacionado a um **Requisito Funcional (R.F)** ou **Requisito Não Funcional (R.N.F)**.

**Título:** Breve descrição do problema (Ex: [BUG] R.F 002: Cálculo do custo médio não converte a moeda corretamente.)

**Descrição:** Detalhe o que está acontecendo e em qual parte do sistema.

**Passos para Reproduzir:**

1. O que você fez.

2. O que o sistema fez.

3. O que você esperava que o sistema fizesse.

**Comportamento Esperado:** Descreva a saída correta, de acordo com o requisito (se aplicável).

**Ambiente:** (Ex: Chrome 100, Desktop/Mobile, Sistema Operacional).

## Como Sugerir um Novo Recurso (Feature)

Todas as novas funcionalidades devem ser analisadas à luz dos **Objetivos do Projeto** e da arquitetura atual (Frontend, Backend, DB).

1. **Verificação:** Verifique a lista de Issues para ver se a sugestão já existe.

2. **Descrição:** Crie um novo Issue com o título [FEATURE] Breve Descrição e detalhe a sua ideia.

3. **Justificativa:** Explique como essa nova funcionalidade agrega valor ao viajante e como ela se encaixa nos objetivos de personalização e eficiência do OtimizeTour.

## Diretrizes para Contribuições de Código

Toda contribuição de código deve ser feita via **Pull Request (PR)** e se basear em uma Issue previamente aberta e acordada.

1. **Preparação**
    - **Fork** o repositório.

    - **Clone** o seu fork para o ambiente local.

    - Crie um novo branch com um nome descritivo (Ex: feature/adicionar-rf010-conversor ou fix/rf001-login-mfa).
  
2. **Padrões de Código**

  É crucial manter a coerência com a arquitetura do projeto.

-  **Requisitos Funcionais (R.F):** O seu código deve resolver exatamente o R.F ou parte dele, seguindo as Restrições e o Fluxo Principal definidos na documentação.

-  **Requisitos Não Funcionais (R.N.F):** Priorize a implementação dos R.N.F, especialmente:

   - R.N.F 003: Autenticação Segura e Multifator (Auth0, conforme R.F 001).

   - R.N.F 004: Conformidade WCAG 2.1 Nível AA (Acessibilidade).

   - R.N.F 007: Design Responsivo (Para telas Mobile/Desktop).

- **Estrutura de Código:** Use nomes de variáveis e funções claros, preferencialmente em Inglês, seguindo o padrão camelCase para JavaScript/Backend e PascalCase para Componentes React/Frontend.


3. **Commit**
   Use mensagens de commit claras e concisas, seguindo este formato:
   
| Tipo | Descrição | Exemplo |
| -------- | ----- | ----------- |
| ``feat``       |  Uma nova feature (maior).   | feat: implementa R.F 001 Módulo de Autenticação     |
| ``fix``       |  Correção de um bug.   | fix: corrige falha na recuperação de senha    |
| ``refactor``       | Refatoração de código sem mudar o comportamento.   | refactor: otimiza lógica de cálculo de custo médio    |
| ``docs``       |  Mudanças na documentação.   | docs: atualiza documentação do R.F 002    |


4. **Submissão do Pull Request (PR)**

   - Garanta que o código está funcionando e todos os testes (se houver) foram executados com sucesso.

   - Abra um Pull Request para o branch main do repositório principal.

   - Vincule a Issue que o seu PR está resolvendo (Ex: Closes #123).

   - Descreva detalhadamente o que foi mudado e por que.

   - Aguarde a revisão dos mantenedores do projeto.
