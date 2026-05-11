import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';

const CV_PROFILE = `
Nome: Aparecido Gomes da Silva Júnior
Cargo: QA Pleno | Analista de Sistemas
Experiência: 6 anos
Habilidades: Testes Funcionais, Regressão, End-to-End, SQL Server, Linux, Azure, Git, JavaScript, C#, Python, Scrum
Formação: Análise e Desenvolvimento de Sistemas
PCD: Sim (paralisia cerebral)
Localização: Curitiba - PR (aceita remoto e todo o Brasil)
`;

const COVER_LETTER_BASE = `
Prezado(a) recrutador(a),

Meu nome é Aparecido Gomes da Silva Junior e tenho interesse na vaga de {VAGA} em {EMPRESA}.

Sou QA Pleno com mais de 6 anos de experiência em ambientes de produção e times ágeis, com foco em testes funcionais, regressivos e end-to-end. Tenho vivência com SQL Server, Linux, Azure e metodologias ágeis (Scrum), além de conhecimentos em JavaScript, C# e Python.

Atualmente atuo em e-commerce com validação de fluxos críticos, análise de requisitos e colaboração direta com times de desenvolvimento para prevenção de bugs em produção.

Sou PCD (paralisia cerebral), e essa trajetória me forjou com resiliência, disciplina e foco em soluções — qualidades que levo para cada projeto em que atuo.

Acredito que meu perfil tem muito a contribuir com a {EMPRESA} e fico à disposição para uma conversa.

Atenciosamente,
Aparecido Gomes da Silva Junior
aparecidogomes1003@gmail.com | +55 41 99531-8466
`;

@Injectable()
export class JobsService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  async searchJobs(keyword: string) {
    const message = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Gere uma lista de 6 vagas REALISTAS e VARIADAS de "${keyword}" no Brasil para este profissional:
${CV_PROFILE}

Responda APENAS com JSON válido, sem markdown, sem explicações:
[
  {
    "id": "1",
    "title": "título da vaga",
    "company": "nome da empresa real brasileira",
    "location": "cidade ou Remoto",
    "type": "CLT ou PJ",
    "url": "https://linkedin.com/jobs/view/123456789",
    "match": número de 70 a 98,
    "tags": ["tag1","tag2","tag3"],
    "posted": "há X dias"
  }
]`
      }]
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '[]';
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  }

  async generateCoverLetter(jobTitle: string, company: string) {
    const prompt = COVER_LETTER_BASE
      .replace('{VAGA}', jobTitle)
      .replace(/\{EMPRESA\}/g, company);

    const message = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Escreva uma carta de apresentação profissional em português brasileiro para:
Candidato: Aparecido Gomes da Silva Junior
Vaga: ${jobTitle}
Empresa: ${company}
Perfil: ${CV_PROFILE}
Carta base: ${prompt}

Melhore e personalize para a vaga e empresa. Responda apenas com o texto da carta, sem explicações.`
      }]
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    return { letter: text };
  }
}