<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Content::create([
            'title' => 'Inception',
            'type' => 'movie',
            'release_year' => 2010,
            'description' => 'Un ladrón que roba secretos corporativos a través del uso de la tecnología de compartir sueños.',
            'banner_image' => 'banners/inception.jpg',
            'rating_avg' => 4.8
        ]);
    
        \App\Models\Content::create([
            'title' => 'The Last of Us Part II',
            'type' => 'game',
            'release_year' => 2020,
            'description' => 'Una aventura de acción y supervivencia épica.',
            'banner_image' => 'banners/tlou2.jpg',
            'rating_avg' => 4.9
        ]);
        
        $genres = \App\Models\Genre::all();
        $platforms = \App\Models\Platform::all();

        // Creamos 20 juegos de prueba
        for ($i = 1; $i <= 20; $i++) {
            $content = \App\Models\Content::create([
                'title' => "Juego de Prueba $i",
                'description' => "Esta es una descripción automática para el juego número $i de ELARX.",
                'type' => 'game',
                'release_year' => rand(2015, 2026),
                'rating_avg' => 0
            ]);

            // .pluck('id') extrae solo los IDs para el método attach()
            $content->genres()->attach($genres->random(rand(1, 2))->pluck('id'));
            $content->platforms()->attach($platforms->random(rand(1, 2))->pluck('id'));
        }
    }
}
