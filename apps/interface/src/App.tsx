import { useState } from "react";
import "./App.css";
import { ConnectForm } from "./components/ConnectForm";
import { EventForm } from "./components/EventForm";
import { Debug } from "./components/Debug";
import { db } from "./store";

type Tab = "link" | "attendance" | "debug";

const App = () => {
  const [tab, setTab] = useState<Tab>("link");
  const address = db.data.address;

  return (
    <>
      <div className="flex flex-row gap-4 bg-slate-100 p-4 justify-between">
        <div className="flex flex-row gap-4 bg-slate-100">
          <div
            onClick={() => setTab("link")}
            className="text-xl font-bold text-center px-2 py-1 bg-slate-50 hover:bg-slate-200 border rounded-lg cursor-default"
          >
            Add links
          </div>
          <div
            onClick={() => setTab("attendance")}
            className="text-xl font-bold text-center px-2 py-1 bg-slate-50 hover:bg-slate-200 border rounded-lg cursor-default"
          >
            Attendance
          </div>
          <div
            onClick={() => setTab("debug")}
            className="text-xl font-bold text-center px-2 py-1 bg-slate-50 hover:bg-slate-200 border rounded-lg cursor-default"
          >
            Debug
          </div>
        </div>
        <div className="text-center px-2 py-1 bg-slate-50 hover:bg-slate-200 border rounded-lg cursor-default">
          {address.slice(0, 6) + "..." + address.slice(-4)}
        </div>
      </div>
      <main className="flex min-h-screen flex-col items-center gap-4 p-24">
        {tab === "link" && <ConnectForm />}
        {tab === "attendance" && <EventForm />}
        {tab === "debug" && <Debug />}
      </main>
    </>
  );
};

export default App;
