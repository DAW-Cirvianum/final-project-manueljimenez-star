<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Platform extends Model
{
    protected $fillable = [
        'name'
    ];

    /**
     * Relación Muchos a Muchos: Los contenidos disponibles en esta plataforma.
     * Utiliza la tabla pivote 'content_platform'.
     */
    public function contents()
    {
        return $this->belongsToMany(Content::class, 'content_platform');
    }
}
