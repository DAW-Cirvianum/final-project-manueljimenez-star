<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Genre;

class GenreController extends Controller
{
    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|unique:genres']);
        $genre = Genre::create($request->all());
        return response()->json($genre, 201);
    }

    public function index()
    {
        return response()->json(Genre::all());
    }

    public function update(Request $request, $id)
    {
        $item = Genre::findOrFail($id);
        $request->validate(['name' => 'required|string|unique:genres,name,' . $id]);
        $item->update($request->all());
        $item->update($request->only(['name']));
    }

    public function destroy($id)
    {
        Genre::destroy($id);
        return response()->json(['message' => 'Eliminado']);
    }
}
