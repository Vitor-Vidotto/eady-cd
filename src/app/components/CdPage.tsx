'use client'
import React, { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { db } from "../firebase/firebaseConfig";
import { ref, set, update, onValue } from "firebase/database";

export default function CdPage() {
  const [cooldowns, setCooldowns] = useState({
    bota: false,
    peito: false,
    pocao: false,
    ultimate: false,
  });
  const [users, setUsers] = useState<{ [key: string]: { cooldown: { [key: string]: boolean } } }>( {});
  const [orderedUsers, setOrderedUsers] = useState<string[]>([]);
  const [cooldownTimes, setCooldownTimes] = useState({
    bota: 60,
    peito: 60,
    pocao: 60,
    ultimate: 60,
  });

  const partyId = typeof window !== "undefined" ? localStorage.getItem("partyId") : null;

  // Função para atualizar o cooldown específico no Firebase sem sobrescrever os outros cooldowns
  const updateCooldown = (nickname: string, cooldownName: string, cooldownStatus: boolean) => {
    if (!partyId) {
      console.error("Party ID não encontrado");
      return;
    }

    const userRef = ref(db, `parties/${partyId}/users/${nickname}/cooldown`);
    update(userRef, {
      [cooldownName]: cooldownStatus,
    })
      .then(() => console.log(`${nickname} cooldown de ${cooldownName} atualizado com sucesso`))
      .catch((error) => console.error("Erro ao atualizar cooldown:", error));
  };

  // Função para iniciar o timer do cooldown
  const startCooldownTimer = (cooldownName: keyof typeof cooldownTimes, nickname: string) => {
    const cooldownTime = cooldownTimes[cooldownName] * 1000; // Tempo do cooldown em milissegundos

    setCooldowns((prevCooldowns) => ({
      ...prevCooldowns,
      [cooldownName]: true,
    }));

    // Atualizar o Firebase para indicar que o cooldown foi ativado
    updateCooldown(nickname, cooldownName, true);

    // Iniciar o timer independente para cada cooldown
    setTimeout(() => {
      setCooldowns((prevCooldowns) => ({
        ...prevCooldowns,
        [cooldownName]: false,
      }));
      updateCooldown(nickname, cooldownName, false);
    }, cooldownTime); // Usa o tempo configurado no login
  };

  // Efeito para pegar a lista de usuários e suas informações de cooldown do Firebase
  useEffect(() => {
    if (!partyId) {
      console.error("Party ID não encontrado");
      return;
    }

    const usersRef = ref(db, `parties/${partyId}/users`);
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUsers(data);

        const savedOrder = typeof window !== "undefined" ? localStorage.getItem("orderedUsers") : null;
        const savedOrderArray = savedOrder ? JSON.parse(savedOrder) : [];

        const newOrderedUsers = [
          ...savedOrderArray.filter((user: string) => data[user]),
          ...Object.keys(data).filter((user) => !savedOrderArray.includes(user)),
        ];

        setOrderedUsers(newOrderedUsers);
        if (typeof window !== "undefined") {
          localStorage.setItem("orderedUsers", JSON.stringify(newOrderedUsers));
        }
      }
    });
  }, [partyId]);

  // Puxar o tempo de cooldown do login
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUltimateCooldown = localStorage.getItem('ultimateCooldown');
      const storedPeitoCooldown = localStorage.getItem('peitoCooldown');
      const storedBotaCooldown = localStorage.getItem('botaCooldown');
      const storedPocaoCooldown = localStorage.getItem('pocaoCooldown');

      if (storedUltimateCooldown) {
        setCooldownTimes((prev) => ({
          ...prev,
          ultimate: parseInt(storedUltimateCooldown),
        }));
      }
      if (storedPeitoCooldown) {
        setCooldownTimes((prev) => ({
          ...prev,
          peito: parseInt(storedPeitoCooldown),
        }));
      }
      if (storedBotaCooldown) {
        setCooldownTimes((prev) => ({
          ...prev,
          bota: parseInt(storedBotaCooldown),
        }));
      }
      if (storedPocaoCooldown) {
        setCooldownTimes((prev) => ({
          ...prev,
          pocao: parseInt(storedPocaoCooldown),
        }));
      }
    }
  }, []);

  // Escutando os eventos de cooldown emitidos do backend
  useEffect(() => {
    const handleCooldownEvent = (event: { event: string }) => {
      const nickname = typeof window !== "undefined" ? localStorage.getItem("nickname") : null;
      if (!nickname) return;

      switch (event.event) {
        case "bota":
          startCooldownTimer("bota", nickname);
          break;
        case "peito":
          startCooldownTimer("peito", nickname);
          break;
        case "pocao":
          startCooldownTimer("pocao", nickname);
          break;
        case "ultimate":
          startCooldownTimer("ultimate", nickname);
          break;
        default:
          break;
      }
    };

    // Registrando os ouvintes de eventos
    listen("bota", handleCooldownEvent);
    listen("peito", handleCooldownEvent);
    listen("pocao", handleCooldownEvent);
    listen("ultimate", handleCooldownEvent);

    return () => {
      // Removendo os ouvintes de eventos ao desmontar o componente
      listen("bota", handleCooldownEvent).then((unlisten) => unlisten());
      listen("peito", handleCooldownEvent).then((unlisten) => unlisten());
      listen("pocao", handleCooldownEvent).then((unlisten) => unlisten());
      listen("ultimate", handleCooldownEvent).then((unlisten) => unlisten());
    };
  }, [partyId, cooldownTimes]);

  // Função para mover os usuários para cima ou para baixo
  const moveUser = (index: number, direction: "up" | "down") => {
    const newOrderedUsers = [...orderedUsers];

    if (direction === "up" && index > 0) {
      const [movedUser] = newOrderedUsers.splice(index, 1);
      newOrderedUsers.splice(index - 1, 0, movedUser);
    } else if (direction === "down" && index < newOrderedUsers.length - 1) {
      const [movedUser] = newOrderedUsers.splice(index, 1);
      newOrderedUsers.splice(index + 1, 0, movedUser);
    }

    setOrderedUsers(newOrderedUsers);
    if (typeof window !== "undefined") {
      localStorage.setItem("orderedUsers", JSON.stringify(newOrderedUsers));
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-center text-2xl mb-4">Sistema de Cooldown</h2>

      <div className="mt-6 w-full">
        <h3 className="text-xl mb-2">Usuários:</h3>
        <div>
          {orderedUsers.map((nickname, index) => {
            const userCooldowns = users[nickname]?.cooldown || {};
            return (
              <div
                key={nickname}
                className="flex items-center mb-2 p-2 bg-gray-800 text-white rounded"
              >
                <span className="flex-1">
                  {nickname}:{" "}
                  {Object.keys(cooldowns).map((cooldownName) => {
                    const isCooldownActive = userCooldowns[cooldownName];
                    return (
                      <span
                        key={cooldownName}
                        className={`mr-2 ${
                          isCooldownActive ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {cooldownName.charAt(0).toUpperCase() + cooldownName.slice(1)}{" "}
                        {isCooldownActive ? "Ativo" : "Inativo"}
                      </span>
                    );
                  })}
                </span>
                <button
                  onClick={() => moveUser(index, "up")}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveUser(index, "down")}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  ↓
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
