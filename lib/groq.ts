export const GROQ_MODELS = [
  { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B" },
  { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B (fast)" },
  { id: "gemma2-9b-it", label: "Gemma 2 9B" },
];

export type GroqRunResult = {
  output: string;
  latencyMs: number;
  tokens: number;
  error?: string;
};

export async function runGroqPrompt(
  apiKey: string,
  model: string,
  prompt: string
): Promise<GroqRunResult> {
  const started = performance.now();
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      }),
    });
    const latencyMs = Math.round(performance.now() - started);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        output: "",
        latencyMs,
        tokens: 0,
        error: err?.error?.message || `Request failed (${res.status})`,
      };
    }
    const data = await res.json();
    const output = data?.choices?.[0]?.message?.content ?? "";
    const tokens = data?.usage?.total_tokens ?? 0;
    return { output, latencyMs, tokens };
  } catch (e) {
    return {
      output: "",
      latencyMs: Math.round(performance.now() - started),
      tokens: 0,
      error: e instanceof Error ? e.message : "Network error",
    };
  }
}

export function fillTemplate(template: string, input: string): string {
  return template.replaceAll("{{input}}", input);
}
