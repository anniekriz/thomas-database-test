'use client';

import { useEffect, useState } from 'react';

import supabase from '@/lib/supabase';

import Link from 'next/link';

import '../styles.css';

type Person = {
    id: string;
    first_name: string;
    last_name: string;
    birth_date: string;
};

export default function Home() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');

    const [people, setPeople] = useState<Person[]>([]);

    useEffect(() => {
        fetchPeople();
    }, []);

    const fetchPeople = async () => {
        const { data, error } = await supabase.from('Person').select('*').order('birth_date');
        if (!error && data) setPeople(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        if (!firstName || !lastName || !birthDate) return;


        const { error } = await supabase.from('Person').insert([
            {
                first_name: firstName,
                last_name: lastName,
                birth_date: birthDate,
            },
        ]);


        if (!error) {
            setFirstName('');
            setLastName('');
            setBirthDate('');
            fetchPeople();
        }
    };

    const handleDelete = async (id: string) => {
        // vyskakovaci okno
        const confirmed = window.confirm('Are you sure you want to delete this person?');
        if (!confirmed) return;

        // const { error } = funkce await vraci vic veci nez jen error, ale nas zajima pouze error
        // await říká: „Počkej na výsledek této operace, než budu pokračovat dál.“, da se pouzit pouze ve funkci async
        const { error } = await supabase.from('Person').delete().eq('id', id); // eq(sloupec, hodnota) = „Vyber (nebo smaž, nebo aktualizuj) pouze ty řádky, kde sloupec = hodnota
        if (!error) {
            fetchPeople(); // obnov seznam
        }
    };

    return (
        <main className="container">

            <Link href="./" className='link'>Go to main page</Link>

            <h1>Add person</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
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

            <div>
                <h2>Person list</h2>
                <ul>
                    {people.map((p) => (
                        <li key={p.id}>
                            {p.first_name} {p.last_name} ({p.birth_date})
                            <button onClick={() => handleDelete(p.id)} className="delete">Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
