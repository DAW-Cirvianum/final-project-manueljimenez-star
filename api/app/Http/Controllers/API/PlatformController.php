<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Platform;


class PlatformController extends Controller
{
    public function index()
    {
        return response()->json(Platform::all());
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|unique:platforms']);
        $platform = Platform::create($request->all());
        return response()->json($platform, 201);
    }

    public function update(Request $request, $id)
    {
        $item = Platform::findOrFail($id);
        $request->validate(['name' => 'required|string|unique:platforms,name,' . $id]);
        $item->update($request->only(['name']));
        return response()->json($item);
    }

    public function destroy($id)
    {
        Platform::destroy($id);
        return response()->json(['message' => 'Eliminado']);
    }
}
