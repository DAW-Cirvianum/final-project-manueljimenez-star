<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlatformSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $platforms = ['PS5', 'Xbox Series X', 'PC', 'Nintendo Switch', 'PS4'];
        foreach ($platforms as $name) {
            \App\Models\Platform::create(['name' => $name]);
        }
    }
}
