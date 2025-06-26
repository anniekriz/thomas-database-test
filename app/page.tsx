'use client'; 
// Příznak říká Next.js: tato komponenta má běžet na straně klienta (v prohlížeči)

import { useEffect, useState } from 'react';
// React hooky – useState pro práci se stavem, useEffect pro volání kódu po načtení

import supabase from '@/lib/supabase';
// Import přednastaveného klienta pro připojení k Supabase databázi

import './styles.css';

// Definice typu pro jednu osobu – jak vypadá záznam v databázi
type Person = {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
};

export default function Home() {
  // Stavy pro jednotlivá pole formuláře
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');

  // Stav pro seznam všech osob z databáze
  const [people, setPeople] = useState<Person[]>([]);

  // useEffect zajistí, že se data načtou hned po načtení stránky (pouze jednou)
  useEffect(() => {
    fetchPeople(); // zavolá funkci pro načtení dat
  }, []);

  // Funkce načítá všechny osoby z tabulky "Person", seřazené podle data narození
  const fetchPeople = async () => {
    const { data, error } = await supabase.from('Person').select('*').order('birth_date');
    if (!error && data) setPeople(data); // pokud je vše v pořádku, uložíme data do stavu
  };

  // Obsluha odeslání formuláře
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // zabrání klasickému refreshi stránky

    // Pokud chybí jakékoli pole, neodesílej
    if (!firstName || !lastName || !birthDate) return;

    // Vložení nové osoby do Supabase
    const { error } = await supabase.from('Person').insert([
      {
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
      },
    ]);

    // Pokud je vše v pořádku, formulář se vyprázdní a načtou se nová data
    if (!error) {
      setFirstName('');
      setLastName('');
      setBirthDate('');
      fetchPeople();
    }
  };

  return (
    <main className="container">
      <h1>Add person</h1>

      {/* Formulář pro zadání nové osoby */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)} /* Kdykoli uživatel napíše něco do pole pro jméno, tento řádek vezme nový text a uloží ho do proměnné firstName */
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
        <button type="submit">Save</button>
      </form>

      {/* Výpis seznamu osob */}
      <div>
        <h2>Person list</h2>
        <ul>
          {people.map((p) => (
            <li key={p.id}>
              {p.first_name} {p.last_name} ({p.birth_date})
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
