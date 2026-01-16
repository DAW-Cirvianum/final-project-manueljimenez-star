<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'user_id',
        'content_id',
        'comment',
        'rating'
    ];

    /**
     * Relación: Una reseña es escrita por un único usuario.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación: Una reseña pertenece a una película, serie o juego.
     */
    public function content()
    {
        return $this->belongsTo(Content::class);
    }

    /**
     * Relación Muchos a Muchos: Usuarios que han reaccionado positivamente a esta reseña.
     * Esta relación alimenta el sistema de reputación del autor.
     */
    public function likes()
    {
        return $this->belongsToMany(User::class, 'review_likes');
    }
}
