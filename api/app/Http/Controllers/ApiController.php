<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 * title="ELARX API",
 * version="1.0.0",
 * description="Documentación de la API"
 * )
 */
class ApiController extends Controller
{
      /**
       * @OA\Get(
       * path="/api/test",
       * summary="Endpoint de prueba",
       * @OA\Response(
       * response=200,
       * description="OK"
       * )
       * )
       */
      public function test()
      {
            return response()->json(['message' => 'Swagger funcionando']);
      }
}