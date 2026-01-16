<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WebAuthController extends Controller
{
    public function showLoginForm()
    {
        return view('auth.login');
    }
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'login' => 'required', // Email o Username
            'password' => 'required',
        ]);

        // Lógica dual para Blade
        $fieldType = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        if (Auth::attempt([$fieldType => $request->login, 'password' => $request->password])) {
            $request->session()->regenerate();

            // Si es admin, al panel. Si no, lo mandamos fuera.
            if (Auth::user()->role === 'admin') {
                return redirect()->intended('/admin/users');
            }

            Auth::logout();
            return back()->withErrors(['login' => 'No tienes permisos de administrador.']);
        }

        return back()->withErrors(['login' => 'Las credenciales no coinciden.']);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/login');
    }
}
