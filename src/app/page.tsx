"use client"
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import App from "./components/CdPage";
import Login from "./components/login";

export default function Home() {
 // O hook será executado uma vez após o carregamento da página

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <main className="flex flex-col gap-8 items-center sm:items-start">
      <div>
        <Login />
      </div>
      </main>
    </div>
  );
}
