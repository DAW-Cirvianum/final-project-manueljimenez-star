<?php

namespace App;

/**
 * @OA\Info(
 * title="ELARX API",
 * version="1.0.0",
 * description="Descripción de la API"
 * )
 * @OA\PathItem(path="/api")
 */
class SwaggerData
{
      /**
       * @OA\Get(
       * path="/api/check",
       * summary="Check",
       * @OA\Response(response=200, description="OK")
       * )
       */
      public function check()
      {
      }
}