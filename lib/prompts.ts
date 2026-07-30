export type PromptVariant = {
  id: string;
  label: string; // e.g. "Zero-shot"
  content: string;
};

export type Prompt = {
  id: string;
  title: string;
  folder: string;
  content: string;
  variants: PromptVariant[];
  createdAt: string;
  updatedAt: string;
};

export type RunResult = {
  id: string;
  promptId: string;
  variantLabel: string;
  model: string;
  input: string;
  output: string;
  latencyMs: number;
  tokens: number;
  error?: string;
  createdAt: string;
};

const STORAGE_KEY = "promptbench:prompts:v1";
const RUNS_KEY = "promptbench:runs:v1";

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

export const SAMPLE_PROMPTS: Prompt[] = [
  {
    id: "sample-sentiment",
    title: "sentiment-classifier",
    folder: "classification",
    content:
      "Classify the sentiment of the following text as positive, negative, or neutral. Respond with one word only.\n\nText: {{input}}",
    variants: [
      {
        id: "v1",
        label: "Zero-shot",
        content:
          "Classify the sentiment of the following text as positive, negative, or neutral. Respond with one word only.\n\nText: {{input}}",
      },
      {
        id: "v2",
        label: "Few-shot",
        content:
          'Classify sentiment as positive, negative, or neutral.\n\nText: "I love this." -> positive\nText: "This is terrible." -> negative\nText: "It arrived on Tuesday." -> neutral\n\nText: {{input}} ->',
      },
      {
        id: "v3",
        label: "Chain-of-thought",
        content:
          "Read the text, briefly reason about its tone in one sentence, then on a new line output only the final label (positive, negative, or neutral).\n\nText: {{input}}",
      },
    ],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "sample-summarizer",
    title: "tight-summarizer",
    folder: "summarization",
    content:
      "Summarize the following text in exactly two sentences, no more, no less.\n\n{{input}}",
    variants: [
      {
        id: "v1",
        label: "Zero-shot",
        content:
          "Summarize the following text in exactly two sentences, no more, no less.\n\n{{input}}",
      },
      {
        id: "v2",
        label: "Constrained",
        content:
          "You are a wire-service editor. Summarize the following text in exactly two sentences, using no adjectives.\n\n{{input}}",
      },
    ],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "sample-rewrite",
    title: "weak-prompt-rewriter",
    folder: "meta",
    content:
      "You improve prompts. Given a weak prompt, rewrite it to be specific, scoped, and unambiguous. Then list the concrete changes you made as short bullets.\n\nWeak prompt: {{input}}",
    variants: [
      {
        id: "v1",
        label: "Zero-shot",
        content:
          "You improve prompts. Given a weak prompt, rewrite it to be specific, scoped, and unambiguous. Then list the concrete changes you made as short bullets.\n\nWeak prompt: {{input}}",
      },
    ],
    createdAt: now(),
    updatedAt: now(),
  },
];

export function loadPrompts(): Prompt[] {
  if (typeof window === "undefined") return SAMPLE_PROMPTS;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_PROMPTS));
    return SAMPLE_PROMPTS;
  }
  try {
    return JSON.parse(raw) as Prompt[];
  } catch {
    return SAMPLE_PROMPTS;
  }
}

export function savePrompts(prompts: Prompt[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
}

export function loadRuns(): RunResult[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(RUNS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as RunResult[];
  } catch {
    return [];
  }
}

export function appendRun(run: RunResult) {
  if (typeof window === "undefined") return;
  const runs = loadRuns();
  runs.unshift(run);
  window.localStorage.setItem(RUNS_KEY, JSON.stringify(runs.slice(0, 200)));
}

export function newPrompt(title: string, folder: string): Prompt {
  return {
    id: uid(),
    title,
    folder,
    content: "Write your prompt here. Use {{input}} as a variable.",
    variants: [
      {
        id: uid(),
        label: "Zero-shot",
        content: "Write your prompt here. Use {{input}} as a variable.",
      },
    ],
    createdAt: now(),
    updatedAt: now(),
  };
}

export { uid, now };
