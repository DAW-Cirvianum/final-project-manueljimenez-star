<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\UserResource;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Log;


class AuthController extends Controller
{

    /**
     * Registra un nuevo usuario en el sistema.
     * Dispara un evento de registro para procesos en segundo plano (como correos).
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
            'is_active' => true,
        ]);

        // Lanza el evento nativo de Laravel para verificación de email
        event(new Registered($user));

        // Genera el token inicial para que el usuario no tenga que loguearse tras registrarse
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'access_token' => $token,
            'token' => $token,
            'message' => 'Usuario registrado. Por favor, verifica tu correo electrónico.'
        ], 201);
    }

    /**
     * Autentica al usuario mediante email/username y devuelve un token Bearer.
     * Implementa una política de "Single Device" eliminando tokens anteriores.
     */
    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required',
            'password' => 'required',
        ]);

        Log::info('Intento de login', ['login_enviado' => $request->login]);

        // Buscamos al usuario por email o por nombre de usuario
        $user = User::where('email', $request->login)
            ->orWhere('username', $request->login)
            ->first();

        if (!$user) {
            Log::error('Usuario no encontrado en DB para: ' . $request->login);
            return response()->json(['message' => 'Usuario no encontrado'], 401);
        }

        // LOG 3: Ver si la contraseña coincide
        if (!Hash::check($request->password, $user->password)) {
            Log::error('Contraseña incorrecta para usuario ID: ' . $user->id);
            return response()->json(['message' => 'Contraseña incorrecta'], 401);
        }
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => new UserResource($user),
        ]);
    }

    public function verifyEmail(Request $request)
    {
        $user = User::find($request->route('id'));

        // 1. Si el usuario no existe o el hash es incorrecto
        if (!$user || !hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
            return redirect(config('app.frontend_url') . '/login?error=invalid_token');
        }

        // 2. Si ya estaba verificado
        if ($user->hasVerifiedEmail()) {
            return redirect(config('app.frontend_url') . '/login?verified=already');
        }

        // 3. Marcar como verificado
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return redirect(config('app.frontend_url') . '/login?verified=1');
    }

    public function resendVerification(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'El correo ya ha sido verificado.'], 400);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'Enlace de verificación reenviado.']);
    }
}
