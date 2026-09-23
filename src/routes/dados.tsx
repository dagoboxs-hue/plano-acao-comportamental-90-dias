import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Note, PageHeader, Panel } from "@/components/ui-bits";
import { exportCSV, exportJSON, parseBackup } from "@/lib/backup";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/dados")({
  head: () => ({
    meta: [
      { title: "Meus dados — exportar, importar e apagar" },
      { name: "description", content: "Backup em JSON e CSV, restauração validada e exclusão local dos registros." },
      { property: "og:title", content: "Meus dados" },
      { property: "og:description", content: "Tudo fica apenas neste dispositivo." },
    ],
  }),
  component: Dados,
});

function Dados() {
  const { state, replaceAll, reset } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirma, setConfirma] = useState("");

  return (
    <div>
      <PageHeader
        eyebrow="Privacidade e backup"
        title="Meus dados"
        description="Os registros ficam somente neste dispositivo, no armazenamento local do navegador. Nada é enviado para fora."
      />

      <Panel className="mb-6" title="Exportar meus dados">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => exportJSON(state)}>Exportar JSON</Button>
          <Button variant="secondary" onClick={() => exportCSV(state)}>
            Exportar CSV
          </Button>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {state.incidents.length} episódios · {Object.keys(state.weeks).length} semanas ·{" "}
          {Object.keys(state.days).length} dias registrados.
        </p>
      </Panel>

      <Panel className="mb-6" title="Importar backup" subtitle="Aceita um arquivo JSON exportado por este painel.">
        <Input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const text = await file.text();
            const res = parseBackup(text);
            if (!res.ok) {
              toast.error(res.erro);
            } else {
              replaceAll(res.state);
              toast.success("Backup restaurado.");
            }
            if (fileRef.current) fileRef.current.value = "";
          }}
        />
      </Panel>

      <Panel className="border-stop/30" title="Apagar todos os dados">
        <p className="text-sm text-muted-foreground">
          Isso remove permanentemente episódios, semanas, baseline e configurações deste dispositivo. Exporte um backup
          antes.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="mt-4">
              Apagar tudo
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apagar todos os registros?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Digite APAGAR para confirmar.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Input value={confirma} onChange={(e) => setConfirma(e.target.value)} placeholder="APAGAR" />
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setConfirma("")}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                disabled={confirma !== "APAGAR"}
                onClick={() => {
                  reset();
                  setConfirma("");
                  toast.success("Dados apagados.");
                }}
              >
                Apagar definitivamente
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Panel>

      <div className="mt-6">
        <Note>
          O painel acompanha apenas o seu comportamento. Não registre nomes de outras pessoas nem informações sobre
          terceiros.
        </Note>
      </div>
    </div>
  );
}