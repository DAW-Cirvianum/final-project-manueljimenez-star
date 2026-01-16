<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'usuario' => $this->user->name,
            'comment' => $this->comment,
            'note' => $this->rating,
            'date' => $this->created_at->diffForHumans(),
        ];
    }
}
