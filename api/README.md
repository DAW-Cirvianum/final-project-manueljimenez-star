# ELARX API - Catálogo de Entretenimiento (WSL2 & Docker)

## Instalación y Despliegue con Laravel Sail

Dentro de la carpeta `/final-project-manueljimenez-star`:

1. **Instalar dependencias de Composer (vía Docker):**
  
    ```bash
    cd ~/final-project-manueljimenez-star

        alias sail='api/vendor/bin/sail'

        sail up -d

        sail artisan key:generate
        sail artisan migrate --seed
        sail artisan storage:link

    ```

## Acceso a la Documentación (Swagger)

1. **Una vez levantado el servicio, puedes acceder a la documentación interactiva en:**

    ```bash
      http://localhost/api/documentation
    ```

## Credenciales de Acceso

| Rol           | Email              | Password |
| ------------- | ------------------ | -------- |
| Administrador | admin@elarx.com    | admin123 |
| Usuario       | Testuser@elarx.com | user123  |

    ```bash
    http://localhost/login
    ```


    https://drive.google.com/file/d/1f77rAy1cbVv0H1JwIOYpumvz_IKjRp5_/view?usp=sharing