export const CYCLES = [
  { id:'C1', label:'Ciclo 1', start:'2026-02-02', end:'2026-03-08', status:'completed', questionsDeadline:'2026-04-05' },
  { id:'C2', label:'Ciclo 2', start:'2026-03-09', end:'2026-04-05', status:'active',    questionsDeadline:'2026-05-03' },
  { id:'C3', label:'Ciclo 3', start:'2026-04-06', end:'2026-05-03', status:'upcoming',  questionsDeadline:'2026-05-31' },
  { id:'C4', label:'Ciclo 4', start:'2026-05-04', end:'2026-05-31', status:'upcoming',  questionsDeadline:'2026-06-30' },
  { id:'C5', label:'Ciclo 5', start:'2026-06-01', end:'2026-06-30', status:'upcoming',  questionsDeadline:null },
]

export const TOPICS = {
  C1:{ SO:['Introdução a Sistemas Operacionais','Tipos de SO: mono/multi/multiusuário','Kernel e espaço de usuário','Chamadas de sistema','Estrutura em camadas'], DPE:['Perfil empreendedor','Autoconhecimento profissional','Mercado de trabalho em TI','Gestão do tempo'], AMT:['TDIC na educação','Autonomia e aprendizagem','Hipertexto e cibercultura','Aprendizagem colaborativa'], ANT:['Conceitos de cultura','Diversidade cultural','Ética profissional','Antropologia digital'] },
  C2:{ SO:['Processos: criação e estados','Threads e concorrência','Escalonamento de CPU','Comunicação entre processos','Deadlock: detecção e prevenção'], DPE:['Ideação de negócios','Modelo Canvas','Validação de ideias','Pitch e apresentação'], AMT:['IA para o bem — contexto Brasil','NotebookLM: documentos como diálogos','Integridade acadêmica e IA','IA como apoio ao professor','IA para criação de soluções digitais'], ANT:['Antropologia digital','Tecnologia e cultura','Identidade na era digital','Globalização e sociedade em rede'] },
  C3:{ SO:['Gerência de memória','Paginação','Segmentação','Memória virtual','Algoritmos de substituição'], DPE:['Plano de negócio completo','Análise de mercado','Estratégia e finanças','Pitch final'], AMT:['Simulação imersiva','Realidade aumentada e virtual','Laboratório virtual','Experiência digital no aprendizado'], ANT:['Trabalho e transformação digital','Futuro das profissões','Pós-humanismo','Ética em IA'] },
  C4:{ SO:['Sistema de arquivos','Estruturas de diretórios','Gerência de I/O','Dispositivos de armazenamento'], DPE:['Liderança e gestão de equipes','Comunicação profissional','Gestão de conflitos','Cultura organizacional'], AMT:['Autonomia digital','Gestão do tempo digital','Estudo autorregulado','Metacognição'], ANT:['Ética nas organizações','Responsabilidade social','Cidadania digital','Direitos humanos e tecnologia'] },
  C5:{ SO:['Segurança em SO','Virtualização','Containers e Docker','Cloud computing'], DPE:['Inovação e startups','Ecossistema empreendedor','Captação e investimento','Pitch para investidores'], AMT:['Síntese do semestre','Competências digitais','Portfólio profissional','Tendências em educação digital'], ANT:['Síntese semestral','Projeto de vida','Ética e futuro','Legado profissional'] },
}

export const PORTFOLIOS = [
  { id:'PORT-ANT',  discipline:'ANT', title:'Portfólio Antropologia',       cycles:['C2','C3'],      periodStart:'2026-03-16', deadline:'2026-04-26',
    milestones:[ {date:'2026-03-16',label:'Rascunho e estrutura'},{date:'2026-03-24',label:'Desenvolvimento'},{date:'2026-04-07',label:'Revisão'},{date:'2026-04-14',label:'Finalização'},{date:'2026-04-26',label:'Entrega final'} ] },
  { id:'PORT-AMT',  discipline:'AMT', title:'Portfólio AMT',                cycles:['C2','C3','C4'], periodStart:'2026-04-27', deadline:'2026-05-11',
    milestones:[ {date:'2026-04-05',label:'Rascunho Ciclo 2 (antecipado)'},{date:'2026-04-27',label:'Início oficial C3'},{date:'2026-05-04',label:'Parte Ciclo 4'},{date:'2026-05-11',label:'Entrega final'} ] },
  { id:'PORT-DPE1', discipline:'DPE', title:'DPE — Plano de Negócio',        cycles:['C2','C3'],      periodStart:'2026-04-05', deadline:'2026-05-03',
    milestones:[ {date:'2026-04-06',label:'Estrutura do Canvas'},{date:'2026-04-13',label:'Desenvolvimento'},{date:'2026-04-20',label:'Revisão'},{date:'2026-05-03',label:'Entrega final'} ] },
  { id:'PORT-DPE2', discipline:'DPE', title:'DPE — Trabalho de Liderança',   cycles:['C4','C5'],      periodStart:'2026-05-03', deadline:'2026-06-01',
    milestones:[ {date:'2026-05-04',label:'Conceitos de liderança'},{date:'2026-05-11',label:'Desenvolvimento'},{date:'2026-05-25',label:'Revisão'},{date:'2026-06-01',label:'Entrega final'} ] },
  { id:'PORT-SO',   discipline:'SO',  title:'SO — Instalação Linux VM',      cycles:['C3','C4'],      periodStart:'2026-04-05', deadline:'2026-05-17',
    milestones:[ {date:'2026-04-06',label:'VirtualBox + ISO Linux'},{date:'2026-04-13',label:'Instalação e configuração'},{date:'2026-04-20',label:'Documentação'},{date:'2026-05-04',label:'Revisão e finalização'},{date:'2026-05-17',label:'Entrega final'} ] },
]

export const EXAMS = [
  { id:'PROVA1',    title:'Prova Específica 1',      type:'online',     date:'2026-05-16', deadline:'2026-05-24', cycles:['C1','C2','C3','C4'] },
  { id:'PROVA2',    title:'Prova Específica 2 + ASI', type:'presencial', date:'2026-06-13', time:'08:00', location:'Polo presencial', cycles:['C1','C2','C3','C4','C5'] },
  { id:'PROVA-INT', title:'Prova Integrada',          type:'online',     date:'2026-06-13', deadline:'2026-06-15', cycles:['C1','C2','C3','C4','C5'] },
]
