#  Documentación: ELARX Front-End

## Arquitectura y Organización

El código está organizado siguiendo el principio de **Separación de Responsabilidades (SoC)**:

- **`/src/components`**: Componentes UI atómicos y reutilizables (Botones, Modales, GlassCards).
- **`/src/context`**: Estado global de la aplicación (Autenticación y Sesión).
- **`/src/hooks`**: Custom hooks para lógica de negocio (ej. `useContents` para abstracción de la API).
- **`/src/pages`**: Vistas principales organizadas por módulos (Auth, Client, Admin).
- **`/src/services`**: Capa de servicios que centraliza las peticiones HTTP con Axios y la lógica de notificaciones.

## Enrutamiento y Navegación

Se utiliza **React Router Dom** para una navegación fluida sin recargas de página:

- **Rutas Dinámicas**: Implementación de `/contents/:id` para la visualización de detalle de productos.
- **Rutas Anidadas (Nested Routes)**: Uso de `MainLayout` para mantener elementos comunes (Navbar/Footer) de forma eficiente.
- **Protección de Rutas**: Middlewares de frontend (`ProtectedRoute` y `AdminRoute`) que gestionan el acceso según el estado de autenticación y roles de usuario.
- **Lazy Loading**: Los componentes pesados se cargan mediante `React.lazy` y `Suspense`, reduciendo el tiempo de carga inicial.



## Gestión de Estado y Formulario

- **Sistema de Notificaciones**: Integración global de `react-hot-toast` con estilos personalizados para confirmar acciones (Guardado, Edición, Errores).
- **Formularios Avanzados**:
    - **Validación Dual**: Gestión de errores en tiempo real en el cliente y captura de errores de validación del servidor (Laravel 422).
    - **Filtros Dinámicos**: Sistema de búsqueda en el catálogo con técnica de **Debounce** (400ms) para optimizar el rendimiento de la red.
    - **Gestión de Media**: Implementación de `FormData` para la subida de imágenes (Banners y Covers) con previsualización inmediata.

## Diseño y UX/UI

- **Responsividad**: Diseño adaptable mediante **Tailwind CSS**, garantizando compatibilidad desde dispositivos móviles hasta pantallas de ultra alta resolución.
- **Accesibilidad (A11y)**:
    - Uso de etiquetas semánticas HTML5.
    - Atributos ARIA en elementos interactivos y modales.
- **Internacionalización (i18n)**: Gestión multi-idioma centralizada, permitiendo que toda la interfaz sea escalable a otros lenguajes de forma sencilla.

## Requisitos de Ejecución

1. **Instalar dependencias**: `npm install`
2. **Configuración**: Revisar el archivo `.env` para apuntar a la URL de la API.
3. **Desarrollo**: `npm run dev`