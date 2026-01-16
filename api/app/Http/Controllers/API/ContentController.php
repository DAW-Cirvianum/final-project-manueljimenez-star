<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Content;
use App\Http\Requests\StoreContentRequest;
use App\Http\Resources\ContentResource;
use Illuminate\Support\Facades\Storage;

class ContentController extends Controller
{

    /**
     * Almacena un nuevo contenido (Solo Administradores).
     * Gestiona la subida de múltiples archivos y relaciones N:M.
     */
    public function store(StoreContentRequest $request)
    {
        $data = $request->validated();

        // Persistencia de imágenes en el disco público
        if ($request->hasFile('banner_image')) {
            $data['banner_image'] = $request->file('banner_image')->store('banners', 'public');
        }

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        }

        $content = Content::create($data);

        // Sincronización de categorías y plataformas
        if ($request->has('genres'))
            $content->genres()->sync($request->genres);
        if ($request->has('platforms'))
            $content->platforms()->sync($request->platforms);

        return new ContentResource($content->load(['genres', 'platforms']));
    }

    /**
     * Lista contenidos con filtros avanzados y estados de usuario (favoritos).
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        // Eager Loading para evitar el problema de consultas N+1
        $query = Content::with(['genres', 'platforms', 'reviews.user:id,name']);

        

        // Filtros dinámicos mediante Query Builder
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('genre_id')) {
            $query->whereHas('genres', function ($q) use ($request) {
                $q->where('genres.id', $request->genre_id);
            });
        }

        if ($request->filled('platform_id')) {
            $query->whereHas('platforms', function ($q) use ($request) {
                $q->where('platforms.id', $request->platform_id);
            });
        }

        if ($request->filled('year')) {
            $query->where('release_year', $request->year);
        }

        if ($request->sort == 'recent') {
            $query->orderBy('created_at', 'desc');
        } elseif ($request->sort == 'rating') {
            $query->orderBy('rating_avg', 'desc')->orderBy('created_at', 'desc');
        } elseif ($request->sort == 'top') {
            $query->orderBy('created_at', 'asc');
        } else {
            $query->orderBy('rating_avg', 'desc');
        }

        $limit = $request->query('limit', ($request->has('all') ? 100 : 15));
        $paginated = $query->paginate($limit);

        // Inyectamos dinámicamente si el usuario actual tiene el contenido en favoritos
        $paginated->getCollection()->transform(function ($content) use ($user) {
            $content->is_favorite_by_me = $user
                ? $content->favoritedByUsers()->where('user_id', $user->id)->exists()
                : false;
            return $content;
        });
        
        return response()->json($paginated);
    }

    public function update(Request $request, $id)
    {
        $content = Content::findOrFail($id);

        $validatedData = $request->validate([
            'title' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:game,series,movie',
            'banner_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'release_year' => 'nullable|integer',
            'description' => 'nullable|string',
            'duration' => 'nullable|string',
            'cover_image' => 'nullable|image|max:2048',
        ]);


        if ($request->hasFile('banner_image')) {
            if ($oldPath = $content->getRawOriginal('banner_image')) {
                Storage::disk('public')->delete($oldPath);
            }
            $validatedData['banner_image'] = $request->file('banner_image')->store('banners', 'public');
        }

        if ($request->hasFile('cover_image')) {
            if ($oldPath = $content->getRawOriginal('cover_image')) {
                Storage::disk('public')->delete($oldPath);
            }
            $validatedData['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        }

        $content->update($validatedData);

        if ($request->has('genres')) {
            $content->genres()->sync($request->genres);
        }
        if ($request->has('platforms')) {
            $content->platforms()->sync($request->platforms);
        }

        return response()->json([
            'message' => 'Contenido actualizado correctamente',
            'content' => $content->load(['genres', 'platforms'])
        ]);
    }

    public function show($id)
    {
        $user = auth('sanctum')->user();
        $content = Content::with(['reviews.user:id,name', 'genres', 'platforms'])->findOrFail($id);

        return new ContentResource($content);
    }

    public function destroy($id)
    {
        $content = Content::findOrFail($id);

        if ($content->getRawOriginal('banner_image')) {
            Storage::disk('public')->delete($content->getRawOriginal('banner_image'));
        }
        if ($content->getRawOriginal('cover_image')) {
            Storage::disk('public')->delete($content->getRawOriginal('cover_image'));
        }

        $content->delete();
        return response()->json([
            'message' => 'Contenido eliminado correctamente'
        ], 200);
    }
}
