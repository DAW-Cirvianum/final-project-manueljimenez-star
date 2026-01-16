<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    protected $fillable = [
        'user_id',
        'content_id',
        'score'
    ];

    /**
     * Relación: El usuario que emitió el voto.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación: El contenido que recibe la puntuación.
     */
    public function content()
    {
        return $this->belongsTo(Content::class);
    }
}
