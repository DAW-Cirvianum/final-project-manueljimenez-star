<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ContentController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\InteractionController;
use App\Http\Controllers\API\GenreController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\PlatformController;
use App\Http\Controllers\API\ForgotPasswordController;
use App\Http\Resources\UserResource;

// --- RUTAS PÚBLICAS ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/contents', [ContentController::class, 'index']);
Route::get('/contents/{id}', [ContentController::class, 'show']);
Route::get('/genres', [GenreController::class, 'index']);
Route::get('/platforms', [PlatformController::class, 'index']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/password/reset', [ForgotPasswordController::class, 'resetPassword']);


Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware(['signed'])
    ->name('verification.verify');


// --- RUTAS PROTEGIDAS (Requieren Token) ---
Route::middleware('auth:sanctum')->group(function () {

    // Perfil del usuario
    Route::get('/profile', function (Request $request) {
        return response()->json([
            'user' => new UserResource($request->user())
        ]);
    });
    Route::put('/profile/update', [UserController::class, 'updateProfile']);

    // Reseñas e Interacciones
    // Route::get('/contents', [ContentController::class, 'index']);
    // Route::get('/contents/{id}', [ContentController::class, 'show']);
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::post('/reviews/{id}/like', [InteractionController::class, 'toggleLike']);
    Route::post('/contents/{id}/favorite', [InteractionController::class, 'toggleFavorite']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

    // --- RUTAS SOLO ADMIN ---
    Route::middleware('admin')->group(function () {
        Route::post('/contents', [ContentController::class, 'store']);
        Route::put('/contents/{id}', [ContentController::class, 'update']);
        Route::delete('/contents/{id}', [ContentController::class, 'destroy']);

        Route::apiResource('genres', GenreController::class)->except(['index', 'show']);
        Route::apiResource('platforms', PlatformController::class)->except(['index', 'show']);

        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::patch('/users/{user}/role', [UserController::class, 'updateRole']);
        Route::post('/users/{user}/toggle-ban', [UserController::class, 'toggleBan']);

        Route::apiResource('users', UserController::class);
        Route::get('/admin/stats', [UserController::class, 'getAdminStats']);
    });
});