<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;


class Content extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'type',
        'release_year',
        'banner_image',
        'rating_avg',
        'duration',
        'cover_image'
    ];

    /**
     * Casting de tipos para asegurar que la nota media siempre sea decimal.
     */
    protected $casts = [
        'rating_avg' => 'float',
        'release_year' => 'integer'
    ];

    public function genres()
    {
        return $this->belongsToMany(Genre::class, 'content_genre');
    }

    public function platforms()
    {
        return $this->belongsToMany(Platform::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function favoritedByUsers()
    {
        return $this->belongsToMany(User::class, 'favorites');
    }

    /**
     * Calcula y actualiza la nota media combinando Reviews (reseñas largas)
     * y Ratings (votos rápidos de 1 a 5).
     */
    public function updateRating()
    {
        $reviewsData = $this->reviews()->selectRaw('count(*) as qty, sum(rating) as total')->first();
        $ratingsData = $this->ratings()->selectRaw('count(*) as qty, sum(score) as total')->first();

        $totalVotes = $reviewsData->qty + $ratingsData->qty;

        if ($totalVotes > 0) {
            $totalScore = $reviewsData->total + $ratingsData->total;
            $newAverage = $totalScore / $totalVotes;
        } else {
            $newAverage = 0;
        }

        $this->update(['rating_avg' => round($newAverage, 2)]);
    }

    /**
     * Genera automáticamente la URL absoluta para el banner.
     */
    protected function bannerImage(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ? asset('storage/' . $value) : null,
        );
    }

    /**
     * Genera la URL para la carátula, devolviendo una imagen por defecto si no existe.
     */
    protected function coverImage(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ? asset('storage/' . $value) : asset('images/default-cover.png'),
        );
    }
}
