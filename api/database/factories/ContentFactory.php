<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Content>
 */
class ContentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'type' => fake()->randomElement(['movie', 'series', 'game']),
            'description' => fake()->paragraph(),
            'release_year' => fake()->year(),
            'banner_image' => 'banners/placeholder.jpg',
            'duration' => fake()->randomElement(['120 min', '1 temporada', '40h']),
        ];
    }
}
