// Conteúdo estático do plano: padrões, semanas, semáforo, protocolos, recaídas, terapia.

export type Padrao = {
  id: number;
  titulo: string;
  gatilho: string;
  pensamento: string;
  emocao: string;
  comportamento: string;
  alivio: string;
  consequencia: string;
};

export const PADROES: Padrao[] = [
  {
    id: 1,
    titulo: "Silêncio vira problema",
    gatilho: "Demora na resposta",
    pensamento: "“Algo está errado”",
    emocao: "Ansiedade",
    comportamento: "Checar / contatar",
    alivio: "Certeza momentânea",
    consequencia: "Aumenta a vigilância futura",
  },
  {
    id: 2,
    titulo: "Mensagens sucessivas",
    gatilho: "Ausência de resposta",
    pensamento: "“Preciso fazer algo”",
    emocao: "Urgência",
    comportamento: "Novas mensagens",
    alivio: "Queda breve da tensão",
    consequencia: "Pressão sobre o outro e arrependimento",
  },
  {
    id: 3,
    titulo: "Dificuldade com “não”",
    gatilho: "Limite recebido",
    pensamento: "“Preciso esclarecer”",
    emocao: "Frustração",
    comportamento: "Negociar / explicar",
    alivio: "Sensação de ter tentado",
    consequencia: "O limite deixa de ser respeitado",
  },
  {
    id: 4,
    titulo: "Descobrir o que o outro pensa",
    gatilho: "Ambiguidade",
    pensamento: "“Não posso ficar sem saber”",
    emocao: "Inquietação",
    comportamento: "Perguntas / investigação",
    alivio: "Sensação de controle",
    consequencia: "Dependência de certeza aumenta",
  },
  {
    id: 5,
    titulo: "Nomear sentimentos alheios",
    gatilho: "Comportamento ambíguo",
    pensamento: "“Sei o que ela sente”",
    emocao: "Urgência cognitiva",
    comportamento: "Afirmar o sentimento do outro",
    alivio: "Reduz incerteza",
    consequencia: "Invalidação e conflito",
  },
  {
    id: 6,
    titulo: "Psicologizar",
    gatilho: "Comportamento desagradável",
    pensamento: "“Há uma causa psicológica”",
    emocao: "Desconforto",
    comportamento: "Análise da pessoa",
    alivio: "Sensação de compreensão",
    consequencia: "Distanciamento e defensividade",
  },
  {
    id: 7,
    titulo: "Resolver sem pedido",
    gatilho: "Pessoa relata um problema",
    pensamento: "“Preciso ajudar”",
    emocao: "Tensão",
    comportamento: "Oferecer solução",
    alivio: "Sensação de utilidade",
    consequencia: "A pessoa pode sentir-se invadida",
  },
  {
    id: 8,
    titulo: "Ajuda vira controle",
    gatilho: "Dificuldade alheia",
    pensamento: "“Se eu assumir, melhora”",
    emocao: "Responsabilidade excessiva",
    comportamento: "Organizar pelo outro",
    alivio: "Controle momentâneo",
    consequencia: "Reduz autonomia e aumenta sobrecarga",
  },
  {
    id: 9,
    titulo: "Corrigir experiências pessoais",
    gatilho: "Discordância",
    pensamento: "“Preciso explicar direito”",
    emocao: "Irritação / urgência",
    comportamento: "Correção",
    alivio: "Sensação de coerência",
    consequencia: "O outro pode sentir sua experiência negada",
  },
  {
    id: 10,
    titulo: "Promessas após erro",
    gatilho: "Erro cometido",
    pensamento: "“Preciso provar que vou mudar”",
    emocao: "Culpa",
    comportamento: "Promessa grandiosa",
    alivio: "Esperança / alívio",
    consequencia: "Baixa credibilidade sem consistência",
  },
  {
    id: 11,
    titulo: "Precisar que vejam a evolução",
    gatilho: "Esforço realizado",
    pensamento: "“Será que perceberam?”",
    emocao: "Insegurança",
    comportamento: "Anunciar / perguntar",
    alivio: "Validação momentânea",
    consequencia: "Mudança fica dependente de reconhecimento",
  },
  {
    id: 12,
    titulo: "Culpa vira autodestruição",
    gatilho: "Erro cometido",
    pensamento: "“Sou péssimo”",
    emocao: "Vergonha",
    comportamento: "Ruminação / autopunição",
    alivio: "Sensação de pagar pelo erro",
    consequencia: "Menos energia para reparar",
  },
  {
    id: 13,
    titulo: "Invadir privacidade",
    gatilho: "Informação inacessível",
    pensamento: "“Preciso saber”",
    emocao: "Ansiedade",
    comportamento: "Perguntar / insistir / investigar",
    alivio: "Alívio",
    consequencia: "Quebra de confiança",
  },
  {
    id: 14,
    titulo: "Pequeno evento vira DR",
    gatilho: "Desconforto pequeno",
    pensamento: "“Isso significa algo maior”",
    emocao: "Medo",
    comportamento: "Conversa abrangente",
    alivio: "Sensação de tratar o problema",
    consequencia: "Desgaste",
  },
  {
    id: 15,
    titulo: "Carinho vira previsão",
    gatilho: "Proximidade",
    pensamento: "“Isso significa futuro”",
    emocao: "Esperança / ansiedade",
    comportamento: "Extrapolar",
    alivio: "Certeza momentânea",
    consequencia: "Frustração diante da ambiguidade real",
  },
  {
    id: 16,
    titulo: "Abandonar rotina",
    gatilho: "Ativação emocional",
    pensamento: "“Não consigo fazer outra coisa”",
    emocao: "Ansiedade",
    comportamento: "Parar trabalho / treino / sono",
    alivio: "Foco total no problema",
    consequencia: "Perda de autonomia",
  },
  {
    id: 17,
    titulo: "Irresponsabilidade prática",
    gatilho: "Tarefa / obrigação",
    pensamento: "“Depois resolvo”",
    emocao: "Desconforto / tédio",
    comportamento: "Adiar",
    alivio: "Alívio imediato",
    consequencia: "Atrasos, perdas e estresse",
  },
  {
    id: 18,
    titulo: "Usar contato para regular ansiedade",
    gatilho: "Ansiedade",
    pensamento: "“Preciso falar com a pessoa”",
    emocao: "Urgência",
    comportamento: "Buscar contato / reasseguramento",
    alivio: "Redução rápida",
    consequencia: "Dependência crescente",
  },
];

export const PRIORIDADES_30 = [
  "Interromper ação impulsiva quando emocionalmente ativado.",
  "Aceitar limites sem negociação posterior.",
  "Reduzir mensagens motivadas exclusivamente pela ausência de resposta.",
  "Preservar rotina básica mesmo durante ansiedade relacional.",
  "Parar de resolver, analisar ou investigar aquilo que não foi solicitado.",
];

export const PADRAO_ANTIGO = [
  "Incerteza / frustração",
  "Interpretação ameaçadora",
  "Ativação emocional",
  "Urgência",
  "Ação interpessoal",
  "Alívio breve",
  "Consequência",
  "Nova ansiedade",
];

export const PADRAO_NOVO = ["Ansiedade", "Pausa", "Regulação", "Análise", "Escolha"];

export type Semana = { n: number; foco: string; objetivo: string; checkin: string; reflexao: string; kpis: string[] };

export const SEMANAS: Semana[] = [
  {
    n: 1,
    foco: "Medir baseline",
    objetivo: "Descobrir o que realmente acontece, sem tentar corrigir nada ainda.",
    checkin: "Registrei episódios sem tentar torná-los melhores do que foram?",
    reflexao: "O que me surpreendeu nos dados desta semana?",
    kpis: ["Todos (baseline)"],
  },
  {
    n: 2,
    foco: "Identificar ativação antes de agir",
    objetivo: "Perceber o corpo e o impulso antes da ação interpessoal.",
    checkin: "Consegui nomear a ativação em quantos episódios?",
    reflexao: "Qual foi o primeiro sinal corporal mais confiável?",
    kpis: ["Pausa antes da ação", "Autonomia A/B/C"],
  },
  {
    n: 3,
    foco: "Respeitar “não” sem segunda rodada",
    objetivo: "Receber um limite e encerrar o assunto na primeira vez.",
    checkin: "Houve alguma segunda rodada de explicação?",
    reflexao: "O que senti logo depois de não negociar?",
    kpis: ["Limites respeitados"],
  },
  {
    n: 4,
    foco: "Mensagens: uma ação a menos",
    objetivo: "Em cada episódio, enviar uma mensagem a menos do que o impulso pedia.",
    checkin: "Quantas mensagens deixei de enviar conscientemente?",
    reflexao: "O que aconteceu com a ansiedade quando não enviei?",
    kpis: ["Mensagens impulsivas"],
  },
  {
    n: 5,
    foco: "Separar fato / interpretação / hipótese",
    objetivo: "Escrever a diferença antes de decidir qualquer coisa.",
    checkin: "Registrei o fato puro antes da interpretação?",
    reflexao: "Quantas hipóteses eu tratei como fato?",
    kpis: ["Psicologizações", "Pausa antes da ação"],
  },
  {
    n: 6,
    foco: "Pedir consentimento antes de aconselhar",
    objetivo: "Perguntar o que a pessoa precisa antes de oferecer qualquer coisa.",
    checkin: "Perguntei antes de ajudar?",
    reflexao: "Como foi ficar sem oferecer solução?",
    kpis: ["Ajuda com consentimento"],
  },
  {
    n: 7,
    foco: "Ouvir sem solucionar",
    objetivo: "Sustentar a escuta quando o pedido é apenas contar algo.",
    checkin: "Quantas vezes ouvi sem propor nada?",
    reflexao: "O que fica difícil quando eu não resolvo?",
    kpis: ["Ajuda com consentimento"],
  },
  {
    n: 8,
    foco: "Manter rotina durante ativação",
    objetivo: "Sustentar a rotina mínima mesmo nos dias mais ativados.",
    checkin: "A rotina mínima sobreviveu aos episódios?",
    reflexao: "Qual item da rotina cai primeiro quando estou ativado?",
    kpis: ["Compromissos pessoais"],
  },
  {
    n: 9,
    foco: "Reparação curta",
    objetivo: "Reconhecer, assumir e reparar — sem textão nem autopunição.",
    checkin: "Minhas reparações foram curtas?",
    reflexao: "O que a reparação longa tentava conseguir?",
    kpis: ["Reparação comportamental"],
  },
  {
    n: 10,
    foco: "Privacidade e tolerância a não saber",
    objetivo: "Aceitar não ter acesso a uma informação sem agir para obtê-la.",
    checkin: "Houve tentativa consciente de ultrapassar um limite?",
    reflexao: "Como é ficar sem saber por um dia inteiro?",
    kpis: ["Privacidade"],
  },
  {
    n: 11,
    foco: "Responsabilidade prática",
    objetivo: "Cumprir contas, horários, tarefas e compromissos independentemente da relação.",
    checkin: "O que ficou por fazer e por quê?",
    reflexao: "O adiamento estava ligado a alguma ativação?",
    kpis: ["Compromissos pessoais"],
  },
  {
    n: 12,
    foco: "Autonomia emocional A/B",
    objetivo: "Regular sozinho ou com apoio independente antes de procurar a pessoa envolvida.",
    checkin: "Qual foi a proporção A+B nesta semana?",
    reflexao: "Qual recurso de regulação funcionou melhor?",
    kpis: ["Autonomia A/B/C"],
  },
  {
    n: 13,
    foco: "Teste de consistência sob estresse",
    objetivo: "Observar o comportamento novo sob medo de perda, conflito, silêncio e culpa.",
    checkin: "O comportamento novo se manteve sob pressão?",
    reflexao: "O que faço quando meu sistema inteiro pede que eu volte ao comportamento antigo?",
    kpis: ["Todos"],
  },
];

export const SUBSTITUICOES = [
  { de: "“Preciso mandar mensagem”", para: "Registrar + regular + voltar à atividade" },
  { de: "“Preciso ajudar”", para: "“Você quer escuta, opinião ou ajuda prática?”" },
  { de: "“Preciso saber o que sente”", para: "“Não tenho informação suficiente.”" },
  { de: "“Preciso explicar mais uma coisa”", para: "Encerrar" },
  { de: "“Estraguei tudo”", para: "Identificar uma reparação específica" },
];

export const ESTRESSORES_90 = [
  "Medo de perda",
  "Conflito",
  "Frustração",
  "Silêncio",
  "Percepção de rejeição",
  "Culpa",
  "Ausência de reconhecimento",
];

export const METRICAS_PROIBIDAS = [
  "Quantas vezes a outra pessoa procura",
  "Velocidade de resposta",
  "Mensagens carinhosas",
  "“Eu te amo”",
  "Encontros",
  "Sexo",
  "Ciúme",
  "Proximidade física",
  "Possibilidade de reconciliação",
  "Elogios sobre a mudança",
  "Percepção externa da evolução",
  "Quanto a outra pessoa parece confiar",
];

export type SemaforoCat = {
  id: string;
  nome: string;
  verde: string;
  amarelo: string;
  vermelho: string;
};

export const SEMAFORO: SemaforoCat[] = [
  {
    id: "mensagens",
    nome: "Mensagens",
    verde: "Enviei e segui meu dia",
    amarelo: "Checando celular frequentemente",
    vermelho: "Escrevendo várias mensagens sem resposta",
  },
  {
    id: "limites",
    nome: "Limites",
    verde: "Aceitei o “não”",
    amarelo: "Procurando forma de explicar mais",
    vermelho: "Negociando limite já estabelecido",
  },
  {
    id: "silencio",
    nome: "Silêncio",
    verde: "Sigo minha rotina",
    amarelo: "Calculando tempo de resposta",
    vermelho: "Investigando redes / status",
  },
  {
    id: "ajuda",
    nome: "Ajuda",
    verde: "Perguntei o que precisava",
    amarelo: "Pensando em várias soluções",
    vermelho: "Assumindo problema que não é meu",
  },
  {
    id: "psicologizacao",
    nome: "Psicologização",
    verde: "Fiquei no observável",
    amarelo: "Criando teorias mentalmente",
    vermelho: "Dizendo ao outro por que ele age assim",
  },
  {
    id: "privacidade",
    nome: "Privacidade",
    verde: "Aceitei não saber",
    amarelo: "Forte curiosidade / inquietação",
    vermelho: "Insistindo ou investigando",
  },
  {
    id: "reparacao",
    nome: "Reparação",
    verde: "Reconheci e corrigi",
    amarelo: "Escrevendo justificativa longa",
    vermelho: "Pedindo repetidamente absolvição",
  },
  {
    id: "rotina",
    nome: "Rotina",
    verde: "Cumpri plano básico",
    amarelo: "Distração maior que habitual",
    vermelho: "Abandonei compromissos para monitorar relação",
  },
  {
    id: "culpa",
    nome: "Culpa",
    verde: "Identifiquei ação reparável",
    amarelo: "Ruminação",
    vermelho: "Autopunição ou catastrofização",
  },
  {
    id: "futuro",
    nome: "Futuro",
    verde: "Aceitei o momento presente",
    amarelo: "Criando expectativas",
    vermelho: "Tratando proximidade como garantia",
  },
];

export const RECAIDAS: { sinal: string; acao: string; vermelho?: boolean }[] = [
  { sinal: "Calculando tempo de resposta", acao: "Atividade de 20–30 min" },
  { sinal: "Reler a conversa repetidamente", acao: "Fechar a conversa e registrar a interpretação" },
  { sinal: "Começar um textão", acao: "Salvar como rascunho; não enviar durante ativação" },
  { sinal: "“Só preciso explicar mais uma coisa”", acao: "Sinal vermelho", vermelho: true },
  { sinal: "Buscar certeza sobre a relação", acao: "Voltar ao fato disponível hoje" },
  { sinal: "Monitorar redes", acao: "Interromper e mudar de atividade" },
  { sinal: "Abandonar a rotina", acao: "Executar a versão mínima" },
  { sinal: "Criar teorias", acao: "Escrever “Não tenho dados suficientes.”" },
  { sinal: "Precisar mostrar que mudou", acao: "Registrar a mudança privadamente" },
  { sinal: "Prometer nunca mais errar", acao: "Definir a próxima ação observável" },
  { sinal: "Precisar ser útil", acao: "Perguntar se houve pedido real" },
  { sinal: "Várias recaídas", acao: "Reduzir metas e voltar a uma prioridade" },
];

export const TEMAS_TERAPIA = [
  "Significado emocional de um “não”",
  "Medo de perda",
  "Necessidade de certeza",
  "Intolerância à ambiguidade",
  "Ansiedade e urgência",
  "Dificuldade de sentir desconforto",
  "Necessidade de ser útil",
  "Culpa e autopunição",
  "Necessidade de controle",
  "Silêncio e rejeição",
  "Vigilância",
  "Autorregulação",
  "Intimidade versus acesso irrestrito",
  "Apoio versus controle",
  "Crença “se eu não fizer algo, algo ruim acontecerá”",
  "Manutenção de identidade e rotina durante ativação",
];

export const CRITERIOS_EVOLUCAO = [
  "Sentir ansiedade e agir menos impulsivamente",
  "Receber “não” e não negociar",
  "Tolerar silêncio sem investigar",
  "Conseguir não saber",
  "Ouvir sem assumir responsabilidade",
  "Perguntar antes de aconselhar",
  "Errar sem espetáculo de culpa",
  "Reparar sem exigir tranquilização",
  "Manter rotina sob ativação",
  "Respeitar privacidade",
  "Mudar sem verificar se alguém percebeu",
  "Melhorar a organização prática independentemente da relação",
  "Episódios reduzirem frequência, intensidade e duração",
  "Recuperação mais rápida",
];

export const SCORECARD_AREAS = [
  "Respeito a limites",
  "Tolerância ao silêncio",
  "Mensagens impulsivas",
  "Privacidade",
  "Escuta",
  "Não solucionar automaticamente",
  "Autonomia emocional",
  "Responsabilidade prática",
  "Reparação",
  "Manutenção da rotina",
];

export const CATEGORIAS_INCIDENTE = [
  "Silêncio",
  "Limite",
  "Mensagem",
  "Privacidade",
  "Ajuda",
  "Conflito",
  "Culpa",
  "Rotina",
  "Outro",
];

export const FAIXAS_PAUSA = ["<5 min", "5–15 min", "15–30 min", "30–60 min", ">60 min"] as const;
export type FaixaPausa = (typeof FAIXAS_PAUSA)[number];

export const PERGUNTAS_REVISAO: { key: string; label: string }[] = [
  { key: "padrao", label: "Qual padrão apareceu mais?" },
  { key: "gatilho", label: "Qual gatilho apareceu mais?" },
  { key: "interrompi", label: "Onde interrompi o automático?" },
  { key: "ansiedade", label: "Onde ainda agi por ansiedade?" },
  { key: "melhorou", label: "O que melhorou objetivamente?" },
  { key: "piorou", label: "O que piorou?" },
  { key: "foco", label: "Qual será o único foco da próxima semana?" },
];

export const PERGUNTAS_FECHAMENTO = [
  "O que diminuiu?",
  "O que ainda aparece?",
  "O que ficou mais fácil interromper?",
  "Quais situações ainda são gatilhos fortes?",
  "Qual comportamento novo já acontece espontaneamente?",
  "Qual precisa continuar sendo treinado?",
  "O que vale levar para terapia?",
  "Qual será o foco dos próximos 90 dias?",
];

export const ONBOARDING = [
  {
    titulo: "O objetivo deste painel não é eliminar emoções.",
    texto:
      "Ansiedade, frustração e medo vão continuar aparecendo. O que muda é o que acontece depois deles.",
  },
  {
    titulo: "Nos próximos 90 dias, vamos observar o espaço entre impulso e ação.",
    texto: "Esse espaço é o comportamento que está sendo treinado. Tudo aqui aponta para ele.",
  },
  {
    titulo: "A primeira semana é baseline, não prova.",
    texto: "Não tente ter uma semana perfeita. A primeira semana serve para descobrir o que realmente acontece.",
  },
  {
    titulo: "Resultados de outras pessoas não são métricas.",
    texto:
      "Proximidade, elogio, reconciliação e confiança alheia dependem de outra pessoa e não medem sua mudança.",
  },
  {
    titulo: "Recaídas são dados. Tendências importam.",
    texto: "Um episódio isolado não define a tendência. O painel mede comportamentos, não valor pessoal.",
  },
];

export const ROTINA_SUGERIDA = ["Trabalho", "Treino", "Alimentação", "Casa", "Sono"];