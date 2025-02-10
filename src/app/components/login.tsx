'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../firebase/firebaseConfig';
import { ref, set } from "firebase/database";

export default function Login() {
  const [nickname, setNickname] = useState('');
  const [partyId, setPartyId] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (!nickname.trim()) {
      alert('Digite um nome de usuário válido');
      return;
    }
    if (!partyId.trim() || partyId.length > 10) {
      alert('Digite um ID de Party válido (máx. 10 caracteres)');
      return;
    }

    // Limpa qualquer dado anterior no localStorage
    localStorage.clear();
    localStorage.setItem('nickname', nickname);
    localStorage.setItem('partyId', partyId);

    // Adicionando o usuário ao Firebase dentro da party correspondente
    const userRef = ref(db, `parties/${partyId}/users/${nickname}`);
    set(userRef, {
      nickname: nickname,
      cooldown: false,
    })
    .then(() => {
      alert('Usuário cadastrado com sucesso');
      router.push('/cd');
    })
    .catch((error) => {
      alert('Erro ao registrar usuário: ' + error.message);
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-center text-2xl mb-4">Digite seu Nickname e ID PARTY</h2>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Nickname"
        />
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={partyId}
          onChange={(e) => setPartyId(e.target.value)}
          placeholder="ID PARTY (máx. 10 caracteres)"
          maxLength={10}
        />
        <button
          onClick={handleLogin}
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
