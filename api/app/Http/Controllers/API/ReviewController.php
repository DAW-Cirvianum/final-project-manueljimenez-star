<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Http\Resources\ReviewResource;


class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'content_id' => 'required|exists:contents,id',
            'comment' => 'required|string|min:10',
            'rating' => 'required|integer|min:1|max:5',
        ]);
    
        $review = Review::create([
            'user_id' => auth()->id(),
            'content_id' => $request->content_id,
            'comment' => $request->comment,
            'rating' => $request->rating,
        ]);
    
        $review->content->updateRating();

        return response()->json([
            'message' => 'Reseña publicada y nota media actualizada',
            'review' => new ReviewResource($review->load('user')),
            'new_average' => $review->content->rating_avg
        ], 201);
    }

    public function index($contentId)
    {
        $reviews = Review::where('content_id', $contentId)->with('user')->get();
        return response()->json($reviews);
    }

    // Para que el usuario o el admin borren una reseña
    public function destroy($id)
    {
        $review = Review::findOrFail($id);

        // Solo el dueño de la reseña o un admin pueden borrarla
        if (auth()->id() !== $review->user_id && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $review->delete();
        $review->content->updateRating(); // ¡Importante recalcular!
        return response()->json(['message' => 'Reseña eliminada']);
    }
}
