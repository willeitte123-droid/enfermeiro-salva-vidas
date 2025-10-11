import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle } from "lucide-react";

interface Question {
  id: number;
  category: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    category: "Farmacologia",
    question: "Qual o antídoto específico para intoxicação por paracetamol?",
    options: [
      { id: "A", text: "Flumazenil" },
      { id: "B", text: "N-acetilcisteína" },
      { id: "C", text: "Naloxona" },
      { id: "D", text: "Protamina" },
      { id: "E", text: "Vitamina K" }
    ],
    correctAnswer: "B",
    explanation: "A N-acetilcisteína é o antídoto específico para intoxicação por paracetamol, pois repõe os estoques de glutationa hepática e previne a hepatotoxicidade. Deve ser administrada preferencialmente nas primeiras 8 horas após a ingestão."
  },
  {
    id: 2,
    category: "Urgência e Emergência",
    question: "Em uma parada cardiorrespiratória (PCR), qual a sequência correta do suporte básico de vida segundo a AHA?",
    options: [
      { id: "A", text: "A-B-C (Vias aéreas, Respiração, Circulação)" },
      { id: "B", text: "C-A-B (Circulação, Vias aéreas, Respiração)" },
      { id: "C", text: "A-C-B (Vias aéreas, Circulação, Respiração)" },
      { id: "D", text: "B-C-A (Respiração, Circulação, Vias aéreas)" },
      { id: "E", text: "C-B-A (Circulação, Respiração, Vias aéreas)" }
    ],
    correctAnswer: "B",
    explanation: "A sequência C-A-B (Circulação, Vias aéreas, Respiração) é a recomendada pela American Heart Association desde 2010. Prioriza-se iniciar compressões torácicas imediatamente, seguidas de abertura de vias aéreas e ventilação."
  },
  {
    id: 3,
    category: "Administração de Medicamentos",
    question: "Qual via de administração apresenta absorção mais rápida em situações de emergência?",
    options: [
      { id: "A", text: "Via oral" },
      { id: "B", text: "Via subcutânea" },
      { id: "C", text: "Via intramuscular" },
      { id: "D", text: "Via intravenosa" },
      { id: "E", text: "Via retal" }
    ],
    correctAnswer: "D",
    explanation: "A via intravenosa (IV) proporciona absorção imediata do medicamento, pois o fármaco é administrado diretamente na corrente sanguínea, sendo a via de escolha em situações de emergência."
  },
  {
    id: 4,
    category: "Sinais Vitais",
    question: "Qual a frequência respiratória normal em um adulto em repouso?",
    options: [
      { id: "A", text: "8 a 10 irpm" },
      { id: "B", text: "12 a 20 irpm" },
      { id: "C", text: "25 a 30 irpm" },
      { id: "D", text: "30 a 40 irpm" },
      { id: "E", text: "40 a 50 irpm" }
    ],
    correctAnswer: "B",
    explanation: "A frequência respiratória normal em adultos em repouso é de 12 a 20 incursões respiratórias por minuto (irpm). Valores abaixo caracterizam bradipneia e acima, taquipneia."
  },
  {
    id: 5,
    category: "Curativos",
    question: "Para feridas com grande quantidade de exsudato, qual cobertura é mais indicada?",
    options: [
      { id: "A", text: "Hidrocolóide" },
      { id: "B", text: "Alginato de cálcio" },
      { id: "C", text: "Filme transparente" },
      { id: "D", text: "Hidrogel" },
      { id: "E", text: "Carvão ativado" }
    ],
    correctAnswer: "B",
    explanation: "O alginato de cálcio tem alta capacidade de absorção de exsudato, formando um gel que mantém o meio úmido ideal para cicatrização. É indicado para feridas com moderado a grande volume de exsudato."
  },
  {
    id: 6,
    category: "Infecção Hospitalar",
    question: "Qual o tempo mínimo recomendado para higienização das mãos com álcool gel 70%?",
    options: [
      { id: "A", text: "5 a 10 segundos" },
      { id: "B", text: "20 a 30 segundos" },
      { id: "C", text: "40 a 60 segundos" },
      { id: "D", text: "1 a 2 minutos" },
      { id: "E", text: "2 a 3 minutos" }
    ],
    correctAnswer: "B",
    explanation: "A higienização das mãos com álcool gel 70% deve durar de 20 a 30 segundos, friccionando todas as superfícies das mãos até completa evaporação do produto, conforme recomendação da ANVISA."
  },
  {
    id: 7,
    category: "Cálculo de Medicamentos",
    question: "Prescrito Dipirona 2g EV. Disponível ampola de 2ml com 500mg/ml. Quantos ml devem ser administrados?",
    options: [
      { id: "A", text: "2 ml" },
      { id: "B", text: "4 ml" },
      { id: "C", text: "6 ml" },
      { id: "D", text: "8 ml" },
      { id: "E", text: "10 ml" }
    ],
    correctAnswer: "B",
    explanation: "2g = 2000mg. Se cada ml contém 500mg, então: 2000mg ÷ 500mg/ml = 4ml. Devem ser administrados 4ml de Dipirona."
  },
  {
    id: 8,
    category: "Oxigenoterapia",
    question: "Qual dispositivo de oxigenoterapia permite a administração de FiO2 (fração inspirada de oxigênio) mais precisa?",
    options: [
      { id: "A", text: "Cateter nasal" },
      { id: "B", text: "Máscara de Venturi" },
      { id: "C", text: "Máscara simples" },
      { id: "D", text: "Máscara com reservatório" },
      { id: "E", text: "Tenda facial" }
    ],
    correctAnswer: "B",
    explanation: "A máscara de Venturi permite administração precisa de FiO2 através de adaptadores coloridos que fornecem concentrações específicas (24%, 28%, 31%, 35%, 40% e 50%), sendo ideal quando se necessita controle rigoroso da oxigenação."
  },
  {
    id: 9,
    category: "Sondagem",
    question: "Qual o volume máximo recomendado para insuflar o balonete (cuff) de uma sonda vesical de demora em adultos?",
    options: [
      { id: "A", text: "3 a 5 ml" },
      { id: "B", text: "5 a 10 ml" },
      { id: "C", text: "10 a 20 ml" },
      { id: "D", text: "20 a 30 ml" },
      { id: "E", text: "30 a 40 ml" }
    ],
    correctAnswer: "C",
    explanation: "O volume recomendado para insuflar o balonete de uma sonda vesical em adultos é de 10 a 20ml de água destilada, conforme especificação do fabricante. Volume excessivo pode causar lesão uretral."
  },
  {
    id: 10,
    category: "Ética e Legislação",
    question: "Segundo o Código de Ética dos Profissionais de Enfermagem, qual conduta é considerada infração ética?",
    options: [
      { id: "A", text: "Recusar-se a executar atividades que não sejam de enfermagem" },
      { id: "B", text: "Registrar no prontuário as informações inerentes ao processo de cuidar" },
      { id: "C", text: "Divulgar informação confidencial do paciente sem autorização" },
      { id: "D", text: "Prestar assistência de enfermagem livre de danos" },
      { id: "E", text: "Respeitar o direito do paciente de decidir sobre sua saúde" }
    ],
    correctAnswer: "C",
    explanation: "Divulgar informação confidencial do paciente sem autorização expressa configura quebra do sigilo profissional e é considerada infração ética grave, podendo resultar em penalidades pelo COFEN."
  },
  {
    id: 11,
    category: "Hemodinâmica",
    question: "Qual a pressão arterial sistólica considerada como hipotensão em adultos?",
    options: [
      { id: "A", text: "Menor que 120 mmHg" },
      { id: "B", text: "Menor que 110 mmHg" },
      { id: "C", text: "Menor que 100 mmHg" },
      { id: "D", text: "Menor que 90 mmHg" },
      { id: "E", text: "Menor que 80 mmHg" }
    ],
    correctAnswer: "D",
    explanation: "Pressão arterial sistólica menor que 90 mmHg ou diastólica menor que 60 mmHg é considerada hipotensão arterial em adultos, podendo indicar choque ou outras condições clínicas graves."
  },
  {
    id: 12,
    category: "Nutrição Parenteral",
    question: "Qual via de acesso é preferencialmente utilizada para administração de nutrição parenteral total (NPT)?",
    options: [
      { id: "A", text: "Via periférica" },
      { id: "B", text: "Via intramuscular" },
      { id: "C", text: "Via central" },
      { id: "D", text: "Via subcutânea" },
      { id: "E", text: "Via enteral" }
    ],
    correctAnswer: "C",
    explanation: "A NPT deve ser administrada preferencialmente por via central (cateter venoso central) devido à alta osmolaridade da solução, que pode causar flebite em veias periféricas."
  },
  {
    id: 13,
    category: "Glicemia",
    question: "Qual valor de glicemia capilar caracteriza hipoglicemia em adultos?",
    options: [
      { id: "A", text: "Menor que 100 mg/dL" },
      { id: "B", text: "Menor que 90 mg/dL" },
      { id: "C", text: "Menor que 80 mg/dL" },
      { id: "D", text: "Menor que 70 mg/dL" },
      { id: "E", text: "Menor que 60 mg/dL" }
    ],
    correctAnswer: "D",
    explanation: "Glicemia capilar menor que 70 mg/dL caracteriza hipoglicemia em adultos. Valores abaixo de 50 mg/dL indicam hipoglicemia grave, requerendo intervenção imediata."
  },
  {
    id: 14,
    category: "Imunização",
    question: "Qual vacina é contraindicada para gestantes?",
    options: [
      { id: "A", text: "Hepatite B" },
      { id: "B", text: "Tríplice viral (sarampo, caxumba, rubéola)" },
      { id: "C", text: "Influenza" },
      { id: "D", text: "dTpa (tríplice bacteriana acelular)" },
      { id: "E", text: "Hepatite A" }
    ],
    correctAnswer: "B",
    explanation: "A vacina tríplice viral é contraindicada na gestação por conter vírus vivos atenuados, com risco teórico de transmissão vertical. Deve-se evitar gravidez até 1 mês após a vacinação."
  },
  {
    id: 15,
    category: "Queimaduras",
    question: "Segundo a regra dos nove de Wallace, qual a porcentagem de área corporal queimada em um adulto com queimadura em todo membro inferior direito?",
    options: [
      { id: "A", text: "9%" },
      { id: "B", text: "18%" },
      { id: "C", text: "27%" },
      { id: "D", text: "36%" },
      { id: "E", text: "45%" }
    ],
    correctAnswer: "B",
    explanation: "Pela regra dos nove de Wallace, cada membro inferior corresponde a 18% da superfície corporal total (9% face anterior + 9% face posterior)."
  },
  {
    id: 16,
    category: "Transfusão Sanguínea",
    question: "Qual o tempo máximo recomendado para infusão de uma unidade de concentrado de hemácias?",
    options: [
      { id: "A", text: "1 hora" },
      { id: "B", text: "2 horas" },
      { id: "C", text: "4 horas" },
      { id: "D", text: "6 horas" },
      { id: "E", text: "8 horas" }
    ],
    correctAnswer: "C",
    explanation: "O tempo máximo para infusão de concentrado de hemácias é de 4 horas, para minimizar o risco de proliferação bacteriana e manter a qualidade do hemocomponente."
  },
  {
    id: 17,
    category: "Precauções e Isolamento",
    question: "Qual tipo de precaução deve ser implementada para paciente com tuberculose pulmonar bacilífera?",
    options: [
      { id: "A", text: "Precaução de contato" },
      { id: "B", text: "Precaução de gotículas" },
      { id: "C", text: "Precaução aerossol/aérea" },
      { id: "D", text: "Precaução padrão apenas" },
      { id: "E", text: "Precaução reversa" }
    ],
    correctAnswer: "C",
    explanation: "Tuberculose pulmonar bacilífera requer precaução aerossol/aérea, com quarto privativo de pressão negativa e uso de máscara N95/PFF2 por profissionais e visitantes."
  },
  {
    id: 18,
    category: "Dor",
    question: "Qual escala de avaliação da dor é mais adequada para pacientes com dificuldade de comunicação verbal?",
    options: [
      { id: "A", text: "Escala Visual Analógica (EVA)" },
      { id: "B", text: "Escala Numérica" },
      { id: "C", text: "Escala de Faces" },
      { id: "D", text: "Escala Verbal" },
      { id: "E", text: "Questionário McGill" }
    ],
    correctAnswer: "C",
    explanation: "A Escala de Faces é mais adequada para pacientes com dificuldade de comunicação verbal, crianças e idosos, pois permite avaliação através da identificação de expressões faciais correspondentes à intensidade da dor."
  },
  {
    id: 19,
    category: "Eletrocardiograma",
    question: "Qual derivação eletrocardiográfica é mais sensível para detectar isquemia em parede inferior do miocárdio?",
    options: [
      { id: "A", text: "V1, V2, V3" },
      { id: "B", text: "DI e aVL" },
      { id: "C", text: "DII, DIII e aVF" },
      { id: "D", text: "V5 e V6" },
      { id: "E", text: "V3 e V4" }
    ],
    correctAnswer: "C",
    explanation: "As derivações DII, DIII e aVF são as mais sensíveis para detectar alterações isquêmicas em parede inferior do miocárdio, refletindo a atividade elétrica dessa região cardíaca."
  },
  {
    id: 20,
    category: "Pediatria",
    question: "Qual o local mais adequado para verificar o pulso em lactentes durante uma PCR?",
    options: [
      { id: "A", text: "Pulso radial" },
      { id: "B", text: "Pulso carotídeo" },
      { id: "C", text: "Pulso braquial" },
      { id: "D", text: "Pulso femoral" },
      { id: "E", text: "Pulso pedioso" }
    ],
    correctAnswer: "C",
    explanation: "Em lactentes (menores de 1 ano), o pulso braquial é o mais adequado para verificação durante PCR, pois é mais facilmente palpável devido ao pescoço curto e gordura subcutânea da região cervical."
  },
  {
    id: 21,
    category: "Segurança do Paciente",
    question: "Qual é o método mais confiável para identificação do paciente antes de administrar um medicamento?",
    options: [
      { id: "A", text: "Perguntar o nome do paciente" },
      { id: "B", text: "Verificar o número do leito" },
      { id: "C", text: "Conferir nome completo e data de nascimento na pulseira de identificação" },
      { id: "D", text: "Confirmar com o acompanhante" },
      { id: "E", text: "Verificar a foto no prontuário" }
    ],
    correctAnswer: "C",
    explanation: "A dupla checagem (nome completo e data de nascimento) na pulseira de identificação é o padrão-ouro para garantir a identificação correta do paciente, minimizando o risco de erros."
  },
  {
    id: 22,
    category: "Sinais Vitais",
    question: "De acordo com as diretrizes mais recentes, qual é a faixa de pressão arterial considerada normal para um adulto saudável?",
    options: [
      { id: "A", text: "Sistólica < 140 e Diastólica < 90 mmHg" },
      { id: "B", text: "Sistólica < 120 e Diastólica < 80 mmHg" },
      { id: "C", text: "Sistólica < 130 e Diastólica < 85 mmHg" },
      { id: "D", text: "Sistólica < 160 e Diastólica < 100 mmHg" },
      { id: "E", text: "Sistólica < 110 e Diastólica < 70 mmHg" }
    ],
    correctAnswer: "B",
    explanation: "Uma pressão arterial com sistólica inferior a 120 mmHg e diastólica inferior a 80 mmHg é considerada ótima/normal para adultos, segundo a maioria das diretrizes cardiológicas atuais."
  },
  {
    id: 23,
    category: "Administração de Medicamentos",
    question: "Os '5 Certos' da administração de medicamentos são: Paciente Certo, Medicamento Certo, Via Certa, Hora Certa e...?",
    options: [
      { id: "A", text: "Registro Certo" },
      { id: "B", text: "Médico Certo" },
      { id: "C", text: "Dose Certa" },
      { id: "D", text: "Farmacêutico Certo" },
      { id: "E", text: "Validade Certa" }
    ],
    correctAnswer: "C",
    explanation: "Os 5 Certos fundamentais são: Paciente Certo, Medicamento Certo, Via Certa, Hora Certa e Dose Certa. Atualmente, a recomendação se expandiu para 9 ou mais certos, incluindo registro e validade, mas a Dose Certa completa os 5 originais."
  },
  {
    id: 24,
    category: "Procedimentos de Enfermagem",
    question: "Qual é o ângulo de inserção da agulha para uma injeção intramuscular no músculo deltoide em um adulto?",
    options: [
      { id: "A", text: "15 graus" },
      { id: "B", text: "30 graus" },
      { id: "C", text: "45 graus" },
      { id: "D", text: "90 graus" },
      { id: "E", text: "120 graus" }
    ],
    correctAnswer: "D",
    explanation: "A injeção intramuscular deve ser administrada em um ângulo de 90 graus para garantir que a medicação seja depositada profundamente no tecido muscular, otimizando a absorção."
  },
  {
    id: 25,
    category: "Urgência e Emergência",
    question: "Na Escala de Coma de Glasgow, qual pontuação indica o estado de coma (grave)?",
    options: [
      { id: "A", text: "15" },
      { id: "B", text: "12 a 14" },
      { id: "C", text: "9 a 11" },
      { id: "D", text: "Igual ou inferior a 8" },
      { id: "E", text: "Igual ou inferior a 3" }
    ],
    correctAnswer: "D",
    explanation: "Uma pontuação na Escala de Coma de Glasgow igual ou inferior a 8 é classificada como traumatismo cranioencefálico (TCE) grave e geralmente indica a necessidade de intubação para proteção das vias aéreas."
  },
  {
    id: 26,
    category: "Curativos",
    question: "Quais são os sinais clássicos de infecção em uma ferida?",
    options: [
      { id: "A", text: "Dor, calor, rubor e edema" },
      { id: "B", text: "Prurido e descamação" },
      { id: "C", text: "Tecido de granulação e bordas epitelizadas" },
      { id: "D", text: "Exsudato seroso e ausência de odor" },
      { id: "E", text: "Cicatriz hipertrófica" }
    ],
    correctAnswer: "A",
    explanation: "Os sinais flogísticos clássicos de infecção em uma ferida são: dor, calor, rubor (vermelhidão) e edema (inchaço). A presença de exsudato purulento e odor fétido também são fortes indicativos."
  },
  {
    id: 27,
    category: "Ética e Legislação",
    question: "A recusa de um paciente consciente e orientado em aceitar um tratamento proposto deve ser:",
    options: [
      { id: "A", text: "Ignorada, pois o profissional sabe o que é melhor" },
      { id: "B", text: "Respeitada e documentada no prontuário" },
      { id: "C", text: "Comunicada à família para que eles decidam" },
      { id: "D", text: "Forçada, para garantir a saúde do paciente" },
      { id: "E", text: "Discutida apenas com a equipe médica" }
    ],
    correctAnswer: "B",
    explanation: "O princípio da autonomia garante ao paciente o direito de decidir sobre seu próprio tratamento. A recusa deve ser respeitada, e a decisão, juntamente com as orientações fornecidas, deve ser minuciosamente registrada no prontuário."
  },
  {
    id: 28,
    category: "Cuidados Fundamentais",
    question: "Qual é a principal medida para prevenção de lesão por pressão em pacientes acamados?",
    options: [
      { id: "A", text: "Administração de analgésicos" },
      { id: "B", text: "Uso de colchão de água" },
      { id: "C", text: "Mudança de decúbito a cada 2 horas" },
      { id: "D", text: "Manter o paciente sempre em decúbito dorsal" },
      { id: "E", text: "Hidratação da pele com vaselina" }
    ],
    correctAnswer: "C",
    explanation: "A mudança de decúbito programada (geralmente a cada 2 horas) é a intervenção mais eficaz para aliviar a pressão sobre as proeminências ósseas, prevenindo a isquemia tecidual e o desenvolvimento de lesões por pressão."
  },
  {
    id: 29,
    category: "Controle de Infecção",
    question: "Qual dos seguintes é considerado um Equipamento de Proteção Individual (EPI)?",
    options: [
      { id: "A", text: "Bisturi" },
      { id: "B", text: "Seringa" },
      { id: "C", text: "Luvas de procedimento" },
      { id: "D", text: "Termômetro" },
      { id: "E", text: "Estetoscópio" }
    ],
    correctAnswer: "C",
    explanation: "Luvas de procedimento são um EPI essencial, utilizado para proteger o profissional do contato com sangue, fluidos corporais, secreções e itens contaminados, além de proteger o paciente."
  },
  {
    id: 30,
    category: "Eletrocardiograma",
    question: "No ECG, a onda P representa qual evento elétrico do coração?",
    options: [
      { id: "A", text: "Repolarização ventricular" },
      { id: "B", text: "Despolarização ventricular" },
      { id: "C", text: "Despolarização atrial" },
      { id: "D", text: "Repolarização atrial" },
      { id: "E", text: "Atraso no nó atrioventricular" }
    ],
    correctAnswer: "C",
    explanation: "A onda P no eletrocardiograma corresponde à despolarização dos átrios, que é o impulso elétrico que precede a contração atrial. É a primeira deflexão do ciclo cardíaco normal."
  }
];

const Questions = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;
    
    setShowExplanation(true);
    
    if (!answeredQuestions.includes(currentQuestion)) {
      if (selectedAnswer === questions[currentQuestion].correctAnswer) {
        setScore(score + 1);
      }
      setAnsweredQuestions([...answeredQuestions, currentQuestion]);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer("");
    setShowExplanation(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    setSelectedAnswer("");
    setShowExplanation(false);
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions([]);
  };

  const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Banca de Questões</h1>
        <p className="text-muted-foreground">
          Teste seus conhecimentos em enfermagem com questões comentadas
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardDescription>
              Questão {currentQuestion + 1} de {questions.length}
            </CardDescription>
            <CardDescription>
              Pontuação: {score} / {answeredQuestions.length}
            </CardDescription>
          </div>
          <CardTitle className="text-sm font-medium text-primary">
            {questions[currentQuestion].category}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {questions[currentQuestion].question}
            </h3>
            
            <RadioGroup
              value={selectedAnswer}
              onValueChange={setSelectedAnswer}
              disabled={showExplanation}
              className="space-y-3"
            >
              {questions[currentQuestion].options.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                    showExplanation
                      ? option.id === questions[currentQuestion].correctAnswer
                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                        : option.id === selectedAnswer
                        ? "border-red-500 bg-red-50 dark:bg-red-950"
                        : "border-border"
                      : "border-border hover:border-primary"
                  }`}
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label
                    htmlFor={option.id}
                    className="flex-1 cursor-pointer text-foreground"
                  >
                    <span className="font-medium">{option.id}.</span> {option.text}
                  </Label>
                  {showExplanation && option.id === questions[currentQuestion].correctAnswer && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                  {showExplanation && option.id === selectedAnswer && option.id !== questions[currentQuestion].correctAnswer && (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>

          {showExplanation && (
            <div className={`p-4 rounded-lg border ${
              isCorrect
                ? "border-green-500 bg-green-50 dark:bg-green-950"
                : "border-red-500 bg-red-50 dark:bg-red-950"
            }`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {isCorrect ? "Resposta Correta!" : "Resposta Incorreta"}
                  </h4>
                  <p className="text-sm text-foreground">
                    <strong>Gabarito: {questions[currentQuestion].correctAnswer}</strong>
                  </p>
                  <p className="text-sm text-foreground mt-2">
                    {questions[currentQuestion].explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              Anterior
            </Button>
            
            <div className="flex gap-3">
              {!showExplanation ? (
                <Button
                  onClick={handleAnswerSubmit}
                  disabled={!selectedAnswer}
                >
                  Responder
                </Button>
              ) : (
                <>
                  {currentQuestion < questions.length - 1 ? (
                    <Button onClick={handleNextQuestion}>
                      Próxima Questão
                    </Button>
                  ) : (
                    <Button onClick={resetQuiz}>
                      Reiniciar Questionário
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Questions;