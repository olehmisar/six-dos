import { ConnectForm } from "@/components/ConnectForm";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center gap-4 p-24">
        <ConnectForm />
      </main>
    </>
  );
}
