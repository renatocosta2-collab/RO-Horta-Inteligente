# RO Horta Inteligente 🌱

**Versão 1.3** · Projeto do **Desafio 02 – KODIE Academy** · Painel interativo com API pública usando React + Vite

**Autor:** Renato Costa de Oliveira  
**Aplicação publicada:** adicionar o endereço após o deploy na Vercel  
**Repositório:** adicionar o endereço após criar o repositório no GitHub

---

## 📌 Problemática

Quem cuida de uma horta em casa costuma decidir quando regar ou plantar pelo “achismo”. Isso gera desperdício de água (regar antes de uma chuva) ou plantas ressecadas. Os dados de clima existem em APIs públicas, mas não chegam prontos para essa decisão.

## 🎯 Objetivo

Desenvolver um painel responsivo em React + Vite que transforma dados públicos de chuva, radiação UV e umidade do solo em uma orientação simples para os próximos 7 dias: **regar ou esperar, e se é um bom dia para plantar**.

**Público-alvo:** pessoas que cultivam hortas e jardins em casa, em condomínios ou em escolas.

## 🛠 Tecnologias utilizadas

- React e Vite
- JavaScript (ES6+), com a Fetch API
- CSS3 externo, com um arquivo por componente
- HTML semântico (sem `<div>`)
- Testes automatizados com o executor nativo do Node (`node:test`), sem dependências extras
- Git, GitHub e Vercel (publicação a concluir)

## 🌐 API utilizada

**Open-Meteo**, gratuita e sem chave de acesso:

| Uso | Endereço |
| --- | --- |
| Busca de cidade (geocodificação) | https://geocoding-api.open-meteo.com/v1/search |
| Previsão de 7 dias | https://api.open-meteo.com/v1/forecast |

**Dados usados:** chuva diária (`precipitation_sum`), UV máximo (`uv_index_max`) e umidade do solo de 0 a 1 cm (`soil_moisture_0_to_1cm`, por hora). O app calcula a média de cada dia agrupando as leituras pela data local retornada pela API, e mostra o valor em porcentagem (m³/m³ × 100).

**Atribuição:** dados da [Open-Meteo](https://open-meteo.com/), licença CC BY 4.0, uso gratuito para fins não comerciais.

### ⚠️ Limitação importante

A umidade do solo da Open-Meteo é um **dado de modelo meteorológico**, não a medição de um sensor instalado na horta, e representa só a camada superficial (0 a 1 cm). Por isso, as recomendações são **orientativas**. Em caso de dúvida, toque a terra com o dedo.

## 🧠 Regras de decisão

Os limites ficam em `src/utils/limits.js` e as regras em `src/utils/garden.js`. São estimativas didáticas, não uma norma agronômica.

**Regar** (avaliado nesta ordem):

| Situação do dia | Resultado |
| --- | --- |
| Chuva de 5 mm ou mais (mesmo sem dado de umidade) | **Aguarde a chuva** |
| Sem dado de chuva ou de umidade | **Confira o solo** |
| Umidade de 0,30 ou mais | **Solo superficial úmido** |
| Umidade abaixo de 0,22 e chuva abaixo de 2 mm | **Considere regar** |
| Umidade abaixo de 0,22 e chuva entre 2 e 5 mm | **Solo seco, com alguma chuva** (conferir) |
| Demais casos (umidade entre 0,22 e 0,30) | **Confira o solo** |

**Plantar:** favorável quando a chuva é menor que 10 mm, o UV é menor que 8 e a umidade está entre 0,22 e 0,38. Fora disso, o app informa o motivo (chuva forte, UV alto, solo seco ou solo encharcado). Se faltar qualquer dado, mostra “dados insuficientes”.

O limite mínimo de plantio é o mesmo do solo seco (0,22), por isso o app nunca recomenda regar e plantar no mesmo dia (há um teste automatizado para isso).

**Aviso de UV:** com UV de 8 ou mais, o card sugere atividades no início ou no fim do dia.

## 🚀 Funcionalidades

- Busca de cidade por nome, com aviso quando o texto é curto demais
- Escolha explícita entre cidades com o mesmo nome; com uma só cidade encontrada, a previsão carrega direto
- **Lista compacta de cidades**, com opções expansíveis e recolhimento automático após a seleção
- Identificação da localidade selecionada no controle compacto
- Previsão dos próximos 7 dias, com o dia de hoje em destaque
- Filtro “Mostrar só dias para regar”
- Cancelamento de requisições antigas, para evitar resultados fora de ordem
- Tratamento de carregamento, erro de conexão, cidade não encontrada e dado ausente (dado ausente nunca vira zero)
- Layout responsivo (celular, tablet e desktop)
- Acessibilidade: link “Pular para o conteúdo”, foco visível, rótulos nos campos, mensagens com `role` adequado e contraste revisado

## 🗂 Estrutura do projeto

```text
src/
├── components/   # Header, SearchForm, CityList, ForecastSection, DayList, DayCard, StatusMessage, Footer
├── hooks/        # useForecast (estado e chamadas à API)
├── services/     # openMeteo (acesso à API e média diária da umidade)
├── utils/        # garden (regras), limits, format, messages
├── styles/       # um arquivo CSS por componente, mais o base.css
├── App.jsx
└── main.jsx
tests/             # garden.test.js, openMeteo.test.js
```

## ▶️ Como executar o projeto

Requer Node.js 18 ou mais recente e npm.

```bash
cd horta-inteligente  # após extrair o ZIP ou clonar o repositório; ajuste ao nome real da pasta
npm install
npm run dev           # desenvolvimento
npm test              # testes das regras e do serviço
npm run build         # build de produção
```

Depois, abra o endereço mostrado no terminal (normalmente http://localhost:5173).

**Publicação planejada:** repositório no GitHub conectado à Vercel, com o comando `npm run build` e o diretório de saída `dist`.

## 📚 Decisões técnicas

- **React + Vite:** exigência do desafio; Vite oferece desenvolvimento e build rápidos.
- **Open-Meteo:** não exige chave nem configuração, funciona direto no navegador e tem busca de cidade.
- **Fetch API:** suficiente para duas chamadas simples, sem dependência extra.
- **Regras em funções puras:** `garden.js` não depende de React, o que facilita explicar e testar.
- **Escolha explícita da cidade:** nomes como “Santa Rita” existem em vários lugares; por isso o app não escolhe sozinho quando há mais de uma opção.
- **Lista compacta:** o usuário expande as opções quando necessário; depois de escolher, a lista é recolhida, liberando espaço para as previsões.
- **Arquivos pequenos e sem `<div>`:** cada arquivo tem uma responsabilidade, e o HTML usa tags semânticas.
- **Navegação mobile vertical:** não foi criada uma barra horizontal porque o layout foi projetado para se ajustar à largura disponível. A ausência de rolagem lateral não deve ser obtida simplesmente ocultando conteúdo transbordante.

## 🤖 Uso de Inteligência Artificial

### Prompt utilizado

Crie um projeto React + Vite chamado "Horta Inteligente" para o Desafio 02 da KODIE Academy. Objetivo: o usuário digita uma cidade e vê, para os próximos 7 dias, se é um bom dia para regar ou plantar. API pública (sem chave): Open-Meteo, geocodificação para buscar a cidade e previsão com chuva diária, UV máximo e umidade do solo (0 a 1 cm). Requisitos funcionais: busca de cidade, escolha entre cidades com o mesmo nome, filtro "só dias para regar", tratamento de carregamento, erro e dado ausente, responsividade e atribuição. Regras: HTML semântico sem div, arquivos pequenos, CSS e JS separados, componentes independentes, serviços e utilitários organizados e refatoração final.

### Objetivo

Gerar a estrutura inicial do projeto (componentes, serviço da API e regras de decisão) e entender a lógica de rega. Também usei a IA para revisar o código, apontar falhas e criar os testes. As decisões técnicas estão explicadas acima.

O desenvolvimento foi refinado com apoio de ferramentas de IA (Vibe Coding), seguido de revisão, testes e validação manual. O uso de IA não substitui a necessidade de compreender, verificar e manter o código.

## 🧪 Testes e validação

### Testes automatizados

Os testes foram executados com `npm test`, usando o executor nativo do Node.js (`node --test`).

| Indicador | Resultado |
| --- | ---: |
| Testes executados | 12 |
| Testes aprovados | 12 |
| Falhas | 0 |
| Testes ignorados ou cancelados | 0 |

Os testes abrangem regras de rega e plantio, tratamento de dados ausentes, cálculo da umidade superficial do solo, validação de dados meteorológicos e tratamento de erros da API.

### Testes manuais e responsividade

Testes realizados localmente no Microsoft Edge, com auxílio do DevTools, incluindo simulação de tela de **316 × 523 pixels**.

| Cenário observado | Resultado |
| --- | --- |
| Pesquisa de cidade válida | Funcionou no cenário testado |
| Pesquisa de cidade inexistente | Mensagem explicativa exibida |
| Previsão meteorológica de sete dias | Exibida visualmente |
| Filtro sem dias recomendados para regar | Mensagem de estado vazio exibida |
| Lista compacta no desktop e no mobile | Apresentação visual validada |
| Expansão da lista de cidades | Funcionou |
| Seleção de outra cidade | Funcionou |
| Recolhimento automático após a escolha | Funcionou |
| Atualização da localidade e da previsão | Observada após a seleção |
| Layout em 316 × 523 pixels | Sem cortes horizontais aparentes nos prints analisados |

**Por que não há barra de rolagem horizontal?** Em smartphones, a navegação vertical favorece a leitura contínua. Os cartões e controles foram organizados para se adaptar à largura da tela, evitando exigir deslocamento lateral. Na resolução testada, não foram observados cortes horizontais aparentes. Essa observação visual não equivale a uma auditoria de overflow em todos os dispositivos.

### Build de produção

O comando `npm run build` foi executado com sucesso. O Vite processou **53 módulos** e gerou os arquivos otimizados na pasta `dist/`, sem erro de compilação no resultado observado.

**Limites da validação:** testes manuais e automatizados não demonstram, por si só, precisão agronômica das recomendações nem funcionamento em todos os dispositivos. Após o deploy, ainda será necessário testar a aplicação no endereço público.

## 📄 Créditos

Projeto educacional desenvolvido para o Desafio 02 da KODIE Academy. Dados: [Open-Meteo](https://open-meteo.com/) (CC BY 4.0).

## Validação final

- [x] Testes automatizados: 12 aprovados, 0 falhas
- [x] Build de produção concluído
- [x] Testes manuais de busca, lista compacta e responsividade realizados
- [ ] Publicar o repositório no GitHub e inserir o link acima
- [ ] Publicar a aplicação na Vercel e inserir o link acima
- [ ] Testar o endereço público após o deploy
- [ ] Conferir os critérios de entrega e enviar o desafio no Moodle
