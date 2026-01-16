<!DOCTYPE html>
<html lang="es">

<head>
      <meta charset="UTF-8">
      <title>ELARX - Admin Usuarios</title>
      <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gray-100 p-8">
      <div class="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
    
    <form action="{{ route('logout') }}" method="POST">
        @csrf
        <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
            Cerrar Sesión
        </button>
    </form>
</div>
            @if (session('status'))
                  <div class="bg-green-100 text-green-700 p-3 mb-4 rounded">{{ session('status') }}</div>
            @endif

            <table class="w-full border-collapse">
                  <thead>
                        <tr class="bg-gray-200">
                              <th class="p-2 border">ID</th>
                              <th class="p-2 border">Nombre</th>
                              <th class="p-2 border">Email</th>
                              <th class="p-2 border">Rol</th>
                              <th class="p-2 border">Estado</th>
                              <th class="p-2 border">Acciones</th>
                        </tr>
                  </thead>
                  <tbody>
                        @foreach ($users as $user)
                              <tr class="text-center">
                                    <td class="p-2 border">{{ $user->id }}</td>
                                    <td class="p-2 border">{{ $user->name }}</td>
                                    <td class="p-2 border">{{ $user->email }}</td>
                                    <td class="p-2 border">{{ $user->role }}</td>
                                    <td class="p-2 border">
                                          <span class="{{ $user->is_active ? 'text-green-600' : 'text-red-600' }}">
                                                {{ $user->is_active ? 'Activo' : 'Inactivo' }}
                                          </span>
                                    </td>
                                    <td class="p-2 border">
                                          <form action="{{ route('admin.users.toggle', $user->id) }}" method="POST">
                                                @csrf
                                                <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                                      Cambiar Estado
                                                </button>
                                          </form>
                                    </td>
                              </tr>
                        @endforeach
                  </tbody>
            </table>
      </div>
</body>

</html>