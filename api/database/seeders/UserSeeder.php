<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Crear un Administrador (Para que puedas entrar)
        User::create([
            'name' => 'Manuel',
            'username' => 'manuel',
            'email' => 'admin@elarx.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'is_active' => true,
            'reputation_score' => 100,
        ]);

        // 2. Crear un Usuario normal
        User::create([
            'name' => 'Usuario ',
            'username' => 'usuario',
            'email' => 'user@elarx.com',
            'password' => Hash::make('user123'),
            'role' => 'user',
            'is_active' => true,
            'reputation_score' => 10,
        ]);

        // 3. Crear 10 usuarios aleatorios con Factory
        User::factory(10)->create();
    }
}
