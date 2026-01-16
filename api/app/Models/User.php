<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'username',
        'password',
        'role',
        'is_active',
        'reputation_score',
        'avatar',
        'bio'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'reputation_score' => 'integer'
        ];
    }

    /**
     * Lógica de Negocio: Cálculo de Reputación.
     * Calcula la puntuación basada en el total de "likes" recibidos en sus reseñas.
     * Cada like otorga 10 puntos de reputación.
     */
    public function calculateReputation()
    {
        $totalLikes = $this->reviews()->withCount('likes')->get()->sum('likes_count');

        $this->update(['reputation_score' => $totalLikes * 10]);
    }

    /**
     * Obtiene todas las reseñas publicadas por el usuario.
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Obtiene los contenidos marcados como favoritos por el usuario.
     */
    public function favorites()
    {
        return $this->belongsToMany(Content::class, 'favorites');
    }

    /**
     * Reseñas a las que el usuario actual les ha dado "Like".
     */
    public function likedReviews()
    {
        return $this->belongsToMany(Review::class, 'review_likes');
    }
}
