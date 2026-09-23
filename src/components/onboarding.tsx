import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ONBOARDING } from "@/lib/content";
import { useActions } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Onboarding() {
  const [step, setStep] = useState(0);
  const { completeOnboarding } = useActions();
  const isLast = step === ONBOARDING.length - 1;
  const item = ONBOARDING[step]!;

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <div className="panel w-full max-w-xl p-7 sm:p-10">
        <p className="eyebrow">Plano de ação comportamental — 90 dias</p>
        <div key={step} className="rise-in mt-6">
          <h1 className="text-2xl font-semibold leading-snug text-foreground sm:text-3xl">{item.titulo}</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{item.texto}</p>
        </div>

        <div className="mt-9 flex items-center gap-2" aria-hidden>
          {ONBOARDING.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i <= step ? "bg-primary" : "bg-border",
              )}
            />
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-muted-foreground"
          >
            Voltar
          </Button>
          {isLast ? (
            <Button onClick={completeOnboarding} size="lg">
              INICIAR DIA 1
            </Button>
          ) : (
            <Button onClick={() => setStep((s) => s + 1)} size="lg">
              Continuar
            </Button>
          )}
        </div>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          O painel mede comportamentos, não valor pessoal. Os dados ficam apenas neste dispositivo.
        </p>
      </div>
    </div>
  );
}