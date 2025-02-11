'use client';
import { useRouter } from 'next/navigation';
import { db } from '../firebase/firebaseConfig';

import { ref, remove } from 'firebase/database';
import { ArrowLeftCircleIcon } from '@heroicons/react/16/solid';
import { ArrowLeftIcon } from '@heroicons/react/16/solid';

export default function BackToMenuButton() {
  const router = useRouter();

  const handleLeaveParty = () => {
    if (typeof window !== 'undefined') {
      const nickname = localStorage.getItem('nickname');
      const partyId = localStorage.getItem('partyId');

      if (nickname && partyId) {
        const userRef = ref(db, `parties/${partyId}/users/${nickname}`);
        remove(userRef).catch(error => console.error('Erro ao remover usuário do Firebase:', error));
      }
      
      localStorage.removeItem('nickname');
      localStorage.removeItem('partyId');
    }
    router.push('/'); // Substitua '/menu' pelo caminho correto do menu principal
  };

  return (
    <button
      onClick={handleLeaveParty}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
    >
       <ArrowLeftIcon className="h-5 w-5" />
    </button>
  );
}