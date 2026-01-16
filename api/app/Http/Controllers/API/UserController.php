<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\Content;
use App\Models\Review;
use App\Models\Genre;

class UserController extends Controller
{
    /**
     * Lista usuarios con búsqueda y paginación.
     * Útil para el panel de administración.
     */
    public function index(Request $request)
    {
        $users = User::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return UserResource::collection($users);
    }

    /**
     * Muestra el perfil del usuario autenticado con sus estadísticas.
     */
    public function profile()
    {
        // Eager loading para evitar el problema de consultas N+1 en favoritos y reseñas
        $user = auth()->user()->load(['favorites', 'reviews.content']);

        return response()->json([
            'user' => new UserResource($user),
            'stats' => [
                'total_reviews' => $user->reviews->count(),
                'total_favorites' => $user->favorites->count(),
                'reputation' => $user->reputation_score ?? 0
            ]
        ]);
    }

    /**
     * Actualiza el perfil del usuario (Nombre, Bio y Avatar).
     */
    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|max:255',
            'bio' => 'sometimes|nullable|string|max:500',
            'avatar' => 'sometimes|image|mimes:jpeg,png,jpg|max:2048',
        ]);
        if ($request->has('name')) {
            $user->name = $request->name;
        }

        if ($request->has('username')) {
            $user->username = $request->username;
        }

        if ($request->has('bio')) {
            $user->bio = $request->bio;
        }

        // Gestión de Avatar con borrado de archivo antiguo
        if ($request->hasFile('avatar')) {
            // Borramos el avatar anterior si existe en el disco public
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated',
            'user' => new UserResource($user)
        ]);
    }

    /**
     * Banear/Activar usuario (Toggle).
     * Solo accesible por Administradores.
     */
    public function toggleBan(User $user)
    {
        $user->update(['is_active' => !$user->is_active]);
        return response()->json([
            'message' => $user->is_active ? 'Usuario activado' : 'Usuario desactivado',
            'is_active' => $user->is_active
        ]);
    }

    /**
     * Obtiene estadísticas globales para el Dashboard del Admin.
     */
    public function getAdminStats()
    {
        return response()->json([
            'totals' => [
                'users' => User::count(),
                'contents' => Content::count(),
                'reviews' => Review::count(),
                'genres' => Genre::count(),
            ],
            'recent_users' => User::latest()->take(5)->get(),
            'latest_content' => Content::latest()->take(3)->get()
        ]);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return new UserResource($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'role' => 'sometimes|in:user,admin',
        ]);

        $user->update($request->all());

        return response()->json([
            'message' => 'Usuario actualizado',
            'user' => new UserResource($user)
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'Usuario eliminado']);
    }
    public function updateRole(Request $request, User $user)
    {
        $request->validate(['role' => 'required|in:admin,user']);
        $user->update(['role' => $request->role]);
        return response()->json(['message' => 'Rol actualizado']);
    }

}
