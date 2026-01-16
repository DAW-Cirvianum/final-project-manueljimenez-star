<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GenreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $genres = ['Acción', 'Aventura', 'RPG', 'Shooter', 'Terror', 'Deportes'];
        foreach ($genres as $name) {
            \App\Models\Genre::create(['name' => $name]);
        }
    }
}
