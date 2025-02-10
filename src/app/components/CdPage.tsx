import React, { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { db } from "../firebase/firebaseConfig";
import { ref, set, onValue } from "firebase/database";

export default function CdPage() {
  const [countdown, setCountdown] = useState(60);
  const [isCooldownActive, setIsCooldownActive] = useState(false);
  const [users, setUsers] = useState<{ [key: string]: { cooldown: boolean } }>(
    {}
  );
  const [orderedUsers, setOrderedUsers] = useState<string[]>([]);

  // Obter o ID da party do localStorage
  const partyId = localStorage.getItem("partyId");

  const updateCooldown = (nickname: string, cooldownStatus: boolean) => {
    if (!partyId) {
      console.error("Party ID não encontrado");
      return;
    }

    const userRef = ref(db, `parties/${partyId}/users/${nickname}`);
    set(userRef, { cooldown: cooldownStatus })
      .then(() => console.log(`${nickname} cooldown atualizado com sucesso`))
      .catch((error) => console.error("Erro ao atualizar cooldown:", error));
  };

  const startCooldown = () => {
    setIsCooldownActive(true);
    const nickname = localStorage.getItem("nickname");
    if (nickname) {
      updateCooldown(nickname, true);
    }

    let timer = 60;
    const interval = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      if (timer <= 0) {
        clearInterval(interval);
        setIsCooldownActive(false);
        if (nickname) {
          updateCooldown(nickname, false);
        }
      }
    }, 1000);
  };

  useEffect(() => {
    const handleCooldownEvent = () => {
      if (!isCooldownActive) {
        startCooldown();
      }
    };

    listen("cooldown", handleCooldownEvent);
  }, [isCooldownActive, countdown]);

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

        const savedOrder = localStorage.getItem("orderedUsers");
        const savedOrderArray = savedOrder ? JSON.parse(savedOrder) : [];

        // Criar uma nova lista contendo todos os usuários (mantendo a ordem salva e adicionando novos)
        const newOrderedUsers = [
          ...savedOrderArray.filter((user: string) => data[user]), // Manter os usuários que ainda existem no Firebase
          ...Object.keys(data).filter((user) => !savedOrderArray.includes(user)), // Adicionar novos usuários
        ];

        setOrderedUsers(newOrderedUsers);
        localStorage.setItem("orderedUsers", JSON.stringify(newOrderedUsers));
      }
    });
  }, [partyId]);

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
    localStorage.setItem("orderedUsers", JSON.stringify(newOrderedUsers));
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-center text-2xl mb-4">Sistema de Cooldown</h2>

      <div className="mt-6 w-full">
        <h3 className="text-xl mb-2">Usuários:</h3>
        <div>
          {orderedUsers.map((nickname, index) => {
            const cooldownStatus = users[nickname]?.cooldown;
            return (
              <div
                key={nickname}
                className="flex items-center mb-2 p-2 bg-gray-800 text-white rounded"
              >
                <span className="flex-1">
                  {nickname}:{" "}
                  <span
                    className={cooldownStatus ? "text-red-500" : "text-green-500"}
                  >
                    {cooldownStatus ? "  Cooldown Ativo" : "  Cooldown Inativo"}
                  </span>
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
