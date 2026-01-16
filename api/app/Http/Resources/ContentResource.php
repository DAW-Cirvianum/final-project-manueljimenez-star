<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;


class ContentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    public function toArray(Request $request): array
    {
        $user = auth('sanctum')->user();

        return [
            'id' => $this->id,
            'title' => $this->title,
            'type' => $this->type,
            'description' => $this->description,
            'release_year' => $this->release_year,
            'banner_image' => $this->banner_image ? asset('storage/' . $this->banner_image) : null,
            'cover_image' => $this->cover_image ? asset('storage/' . $this->cover_image) : null,
            'duration' => $this->duration,
            'rating_avg' => round($this->reviews()->avg('rating') ?? $this->rating ?? 0, 1),

            'resenas' => $this->reviews->map(function ($review) use ($user) {
                return [
                    'id' => $review->id,
                    'usuario' => $review->user->name,
                    'comentario' => $review->comment,
                    'nota' => $review->rating,
                    'date' => $review->created_at->diffForHumans(),
                    'likes_count' => $review->likes()->count(),
                    'is_liked_by_me' => $user ? $review->likes->contains($user->id) : false,
                ];
            }),
            'genres' => $this->whenLoaded('genres'),
            'platforms' => $this->whenLoaded('platforms'),
            'is_favorite_by_me' => $user
                ? $this->favoritedByUsers()->where('user_id', $user->id)->exists()
                : false,
        ];
    }
}
