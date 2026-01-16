<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 * title="ELARX API",
 * version="1.0.0",
 * description="Catálogo de medios de Manuel Jiménez"
 * )
 * @OA\Server(
 * url="http://localhost/api",
 * description="Servidor Local"
 * )
 */
abstract class Controller
{
      /**
       * @OA\Get(
       * path="/api/test",
       * summary="Endpoint de prueba",
       * @OA\Response(response=200, description="OK")
       * )
       */
      public function test()
      {
      }
}