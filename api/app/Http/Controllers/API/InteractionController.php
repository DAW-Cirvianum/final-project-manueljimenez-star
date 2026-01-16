<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Content;

class InteractionController extends Controller
{

    /**
     * Alterna el estado de "Me gusta" en una reseña.
     * Calcula automáticamente la reputación del autor tras la interacción.
     */
    public function toggleLike(Request $request, $reviewId)
    {
        $user = auth()->user();
        $review = Review::findOrFail($reviewId);

        // El método toggle simplifica la lógica Attach/Detach de la tabla pivote
        $status = $user->likedReviews()->toggle($reviewId);
        $isLiked = count($status['attached']) > 0;

        // Actualizamos la reputación del autor de la reseña basándonos en el nuevo Like/Dislike
        if ($review->user) {
            $review->user->calculateReputation();
        }

        return response()->json([
            'is_liked' => $isLiked,
            'likes_count' => $review->likes()->count(),
            'message' => 'Interacción procesada'
        ]);
    }

    public function toggleFavorite(Request $request, $contentId)
    {
        $user = auth()->user();
        Content::findOrFail($contentId);

        $status = $user->favorites()->toggle($contentId);
        $isFavorite = count($status['attached']) > 0;

        return response()->json([
            'is_favorite' => $isFavorite,
            'message' => $isFavorite ? 'Añadido a tus favoritos' : 'Eliminado de favoritos'
        ]);
    }
}
