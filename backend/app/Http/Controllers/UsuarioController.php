<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Http\Resources\UsuarioResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // Importe o Hash


class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return UsuarioResource::collection(Usuario::all());
    }

    /**
     * Store a newly created resource in storage.
     */
// App\Http\Controllers\UsuarioController

public function store(Request $request)
{
    // 1. Validação (OBRIGATÓRIO em API)
    $validatedData = $request->validate([
        'nome' => 'required|string|max:255',
        'email' => 'required|email|unique:usuarios',
        'senha' => 'required|min:8|max:255', // O front deve enviar 'senha' ou 'password'
    ]);

    // 2. Criação do Usuário, aplicando o Hash à senha
    $usuario = Usuario::create([
        'nome' => $validatedData['nome'],
        'email' => $validatedData['email'],
        // Seu campo no banco é 'senhaHash', mas o input é 'senha'
        'senhaHash' => Hash::make($validatedData['senha']), 
    ]);
    
    // O status code correto para criação é 201
    return (new UsuarioResource($usuario))->response()->setStatusCode(201);
}

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return new UsuarioResource(Usuario::findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->update($request->all());
        return new UsuarioResource($usuario);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->delete();
        return response()->noContent();
    }
}
