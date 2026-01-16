<!DOCTYPE html>
<html lang="es">

<head>
      <meta charset="UTF-8">
      <title>ELARX - Login Admin</title>
      <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gray-900 flex items-center justify-center h-screen">
      <div class="bg-white p-8 rounded-lg shadow-xl w-96">
            <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">ELARX Admin</h2>

            <form action="{{ route('login.post') }}" method="POST">
                  @csrf
                  <div class="mb-4">
                        <label class="block text-gray-700">Email o Username</label>
                        <input type="text" name="login"
                              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  </div>
                  <div class="mb-6">
                        <label class="block text-gray-700">Contraseña</label>
                        <input type="password" name="password"
                              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  </div>
                  <button type="submit"
                        class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">Entrar al
                        Panel</button>

                  @if($errors->any())
                        <p class="text-red-500 text-sm mt-4">{{ $errors->first() }}</p>
                  @endif
            </form>
      </div>
</body>

</html>