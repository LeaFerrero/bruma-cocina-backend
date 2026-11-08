# Bruma Cocina — Backend

API REST del sistema de gestión de Bruma Cocina, una Dark Kitchen ubicada en Palermo Hollywood que elabora y vende viandas selladas al vacío y refrigeradas.

El sistema centraliza la gestión de pedidos, inventario, producción y cobros. Este repositorio contiene el backend (Express y MongoDB), que atiende las solicitudes del frontend y notifica los cambios en tiempo real mediante Socket.IO.

- Aplicación desplegada: https://bruma-cocina.onrender.com/
- API desplegada: https://bruma-cocina-backend.onrender.com (se puede comprobar con `/api/ping`)
- Repositorio del frontend: [bruma-cocina-frontend](https://github.com/LeaFerrero/bruma-cocina-frontend)

> Proyecto Integrador del Equipo Orión — Tecnicatura Superior en Desarrollo de Software a Distancia, IFTS N.º 29, Comisión D (2026). Más detalle en el Manual Técnico.

## Funcionalidades

| Módulo     | Descripción                                                                             | Roles con acceso                     |
| ---------- | --------------------------------------------------------------------------------------- | ------------------------------------ |
| Auth       | Inicio y cierre de sesión con JWT en cookie, y verificación de sesión.                  | Público                              |
| Insumos    | Alta, consulta, edición y baja lógica. Ingreso de stock por lotes.                      | admin, stock                         |
| Viandas    | Alta, edición y baja lógica con receta, categorías e imagen. El listado es público.     | admin, stock (listado público)       |
| Pedidos    | Creación pública de comandas con control de stock. Consulta, despacho y cancelación.    | Público (crear), admin, cocina, caja |
| Producción | Registro de viandas elaboradas: descuenta insumos de la receta y suma stock de viandas. | admin, cocina                        |
| Pagos      | Registro del cobro de un pedido según el medio de pago.                                 | admin, caja                          |
| Usuarios   | Alta, edición y baja lógica de cuentas de empleados.                                    | admin                                |

### Características generales

- Autenticación con JWT en cookie `httpOnly` y control de acceso por rol (`admin`, `cocina`, `caja` y `stock`).
- Validación en tres niveles: Zod en el frontend, `express-validator` en la API y esquemas de Mongoose en la base.
- Manejo centralizado de errores con respuestas de formato unificado.
- Precio histórico en cada pedido y total calculado siempre en el servidor.
- Baja lógica en insumos, viandas y usuarios.
- Subida de imágenes de viandas con control de tipo y tamaño.
- Eventos en tiempo real con Socket.IO.

### Fuera de alcance de esta versión (MVP)

Apertura y cierre de caja, «Plato del Día», proveedores y facturas, punto de venta (POS), gestión de personal, informes avanzados, integraciones externas y resumen diario de caja.

## Tecnologías

| Tecnología        | Versión      | Uso                                                         |
| ----------------- | ------------ | ----------------------------------------------------------- |
| Node.js           | 20.19+       | Entorno de ejecución.                                       |
| Express           | ^5.3         | API REST.                                                   |
| MongoDB           | 7.0.34       | Base de datos (Community en local, Atlas en el despliegue). |
| Mongoose          | ^9.11        | Modelado y persistencia.                                    |
| jsonwebtoken      | ^9.0         | Firma y verificación de tokens.                             |
| cookie-parser     | ^1.4         | Lectura de la cookie de sesión.                             |
| express-validator | ^7.3         | Validación de las solicitudes.                              |
| multer            | ^2.5         | Subida de imágenes.                                         |
| socket.io         | ^4.8         | Eventos en tiempo real.                                     |
| cors y dotenv     | ^2.8 y ^18.0 | Orígenes permitidos y variables de entorno.                 |

## Requisitos

- Git y acceso al repositorio.
- Node.js 20.19 o superior y npm.
- MongoDB Community 7.0.34 instalado y en ejecución en el puerto 27017 (o una cadena de conexión a MongoDB Atlas).

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/LeaFerrero/bruma-cocina-backend.git
cd bruma-cocina-backend
```

### 2. Instalar las dependencias

```bash
npm install
```

### 3. Configurar las variables de entorno

Copiar el archivo `.env.example` como `.env` en la raíz del repositorio, al mismo nivel que `package.json`, y completar las variables:

| Variable       | Descripción                   | Valor de ejemplo                         |
| -------------- | ----------------------------- | ---------------------------------------- |
| `PORT`         | Puerto del servidor.          | `3000`                                   |
| `MONGO_URI`    | Cadena de conexión a MongoDB. | `mongodb://127.0.0.1:27017/bruma_cocina` |
| `JWT_SECRET`   | Clave para firmar los tokens. | Una clave larga y aleatoria.             |
| `FRONTEND_URL` | Origen permitido por CORS.    | `http://localhost:5173`                  |

El archivo `.env` está excluido del control de versiones y no debe contener credenciales reales en el repositorio.

### 4. Cargar los datos iniciales

```bash
npm run seed
```

Crea la base `bruma_cocina` con un usuario por rol, 18 insumos y 2 viandas de ejemplo. El script es repetible: si los datos ya existen, no los duplica.

Las contraseñas de los usuarios iniciales se toman de las variables `ADMIN_INIT_PASSWORD`, `COCINA_INIT_PASSWORD`, `CAJA_INIT_PASSWORD` y `STOCK_INIT_PASSWORD` del `.env`. Si no se definen, se usan los valores por defecto del script.

| Rol           | Usuario         |
| ------------- | --------------- |
| Administrador | `admin.admin`   |
| Cocina        | `cocina.cocina` |
| Caja          | `caja.caja`     |
| Stock         | `stock.stock`   |

Las credenciales de prueba se detallan en el Manual Técnico; este repositorio no incluye contraseñas.

### 5. Iniciar el servidor

```bash
npm run dev
```

O `npm start` para el modo normal. Para comprobar que está activo, abrir `http://localhost:3000/api/ping`, que responde «Backend de Bruma Cocina funcionando».

> **Importante:** el servidor debe iniciarse desde la carpeta raíz del backend, porque la carpeta `uploads/` se resuelve de forma relativa.

### 6. Conectar el frontend

Iniciar el frontend siguiendo las instrucciones de su repositorio, con `VITE_BACKEND_URL=http://localhost:3000`. El valor de `FRONTEND_URL` debe coincidir con la dirección del frontend (por defecto, `http://localhost:5173`).

## Comandos disponibles

| Comando        | Descripción                                              |
| -------------- | -------------------------------------------------------- |
| `npm run dev`  | Inicia el servidor en modo desarrollo.                   |
| `npm start`    | Inicia el servidor en modo normal.                       |
| `npm run seed` | Carga los datos iniciales (usuarios, insumos y viandas). |
| `npm test`     | Ejecuta todas las pruebas, incluidas las de integración. |

## Arquitectura

El backend sigue un patrón MVC sin vistas: los modelos son los esquemas de Mongoose, los controladores resuelven la lógica de cada recurso con el apoyo de las rutas y los middlewares, y la vista corresponde al frontend, que consume la API en formato JSON.

Recorrido de una petición: ruta → middlewares (autenticación, subida de archivos, validadores) → controlador → modelo (Mongoose) → respuesta con formato unificado.

## Organización del código

| Carpeta o archivo             | Contenido                                                                                                                   |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `src/routes/`                 | Endpoints de cada recurso y cadena de middlewares.                                                                          |
| `src/middlewares/`            | `auth.js` (JWT y roles), `upload.js` (multer), `validators/` (reglas por recurso), `validateFields.js` y `errorHandler.js`. |
| `src/controllers/`            | Lógica de negocio por recurso: autenticación, insumos, viandas, pedidos, pagos, producción y usuarios.                      |
| `src/models/`                 | Esquemas de Mongoose: `Meal`, `Order`, `Payment`, `Supply` y `User`.                                                        |
| `src/constants/`              | Roles, unidades, estados de pedido y de pago, métodos de pago, tipos de imagen y códigos de error.                          |
| `src/utils/`                  | `AppError.js`, `responses.js`, `parsers.js`, `dates.js` y `generateOrderCode.js`.                                           |
| `src/config/db.js`            | Conexión a MongoDB.                                                                                                         |
| `src/app.js` y `src/index.js` | Configuración de Express y arranque del servidor con Socket.IO.                                                             |
| `uploads/`                    | Imágenes de las viandas, servidas como archivos estáticos en `/uploads`.                                                    |
| `tests/`                      | Pruebas unitarias y de integración.                                                                                         |

## Endpoints

Todas las rutas llevan el prefijo `/api`.

### Autenticación

| Método y ruta  | Acceso  | Descripción                                                     |
| -------------- | ------- | --------------------------------------------------------------- |
| `POST /login`  | Público | Valida `userName` y `password` y guarda el token en una cookie. |
| `POST /logout` | Público | Cierra la sesión y borra la cookie.                             |
| `GET /verify`  | Público | Verifica que la sesión siga activa y devuelve el usuario.       |

### Insumos

| Método y ruta          | Acceso       | Descripción                                                  |
| ---------------------- | ------------ | ------------------------------------------------------------ |
| `GET /supplies`        | admin, stock | Lista los insumos activos, ordenados por nombre.             |
| `GET /supplies/:id`    | admin, stock | Devuelve un insumo.                                          |
| `POST /supplies`       | admin, stock | Crea un insumo.                                              |
| `PATCH /supplies/:id`  | admin, stock | Edita un insumo.                                             |
| `DELETE /supplies/:id` | admin, stock | Baja lógica.                                                 |
| `PATCH /supplies`      | admin, stock | Ingreso de stock por lotes (`items` con `_id` y `quantity`). |

### Viandas

| Método y ruta       | Acceso       | Descripción                                |
| ------------------- | ------------ | ------------------------------------------ |
| `GET /meals`        | Público      | Lista las viandas activas.                 |
| `GET /meals/images` | Público      | Lista las imágenes de las viandas activas. |
| `GET /meals/:id`    | admin, stock | Devuelve una vianda con su receta.         |
| `POST /meals`       | admin, stock | Crea una vianda (multipart con imagen).    |
| `PATCH /meals/:id`  | admin, stock | Edita una vianda.                          |
| `DELETE /meals/:id` | admin, stock | Baja lógica.                               |

### Pedidos

| Método y ruta                | Acceso              | Descripción                                                                 |
| ---------------------------- | ------------------- | --------------------------------------------------------------------------- |
| `POST /orders`               | Público             | Crea una comanda.                                                           |
| `GET /orders`                | admin, cocina, caja | Lista comandas, con filtros `orderStatus`, `paymentStatus` y `date`.        |
| `GET /orders/:id`            | admin, cocina, caja | Devuelve una comanda.                                                       |
| `PATCH /orders/:id/dispatch` | admin, cocina       | Cambia el estado a `despachado` (solo si está pendiente).                   |
| `PATCH /orders/:id/cancel`   | admin, cocina, caja | Cancela la comanda y devuelve el stock de viandas (solo si está pendiente). |

### Producción

| Método y ruta      | Acceso        | Descripción                                                                          |
| ------------------ | ------------- | ------------------------------------------------------------------------------------ |
| `POST /production` | admin, cocina | Registra la producción: recibe `meals`, una lista de objetos con `_id` y `quantity`. |

### Pagos

| Método y ruta    | Acceso      | Descripción                                                                                                                              |
| ---------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /payments` | admin, caja | Registra el cobro de un pedido (`order`, `paymentMethod` y `paidAt`). El monto (`totalAmount`) lo toma el servidor del total del pedido. |

### Usuarios

| Método y ruta       | Acceso | Descripción                 |
| ------------------- | ------ | --------------------------- |
| `GET /users`        | admin  | Lista los usuarios activos. |
| `GET /users/:id`    | admin  | Devuelve un usuario.        |
| `POST /users`       | admin  | Crea un usuario.            |
| `PATCH /users/:id`  | admin  | Edita un usuario.           |
| `DELETE /users/:id` | admin  | Baja lógica.                |

## Reglas de negocio

### Autenticación

- Al iniciar sesión se firma un JWT con el id y el rol del usuario, con vencimiento de 1 hora, y se guarda en la cookie `token` (`httpOnly`, `sameSite: none`, `secure`). Por la opción `secure`, en local el frontend debe abrirse desde `http://localhost` y, en el sitio desplegado, por HTTPS.
- Un usuario inexistente, dado de baja o con contraseña incorrecta recibe el mismo mensaje con código 401, para no revelar cuál dato falló.
- Los routers protegidos usan `protectRoute` y `verifyRole` (en `middlewares/auth.js`) para exigir sesión y rol.

### Insumos

- El ingreso por lotes valida primero que todos los insumos existan y estén activos. Si alguno falla, responde 404 con el detalle por posición y no actualiza ninguno. Si todos son válidos, suma las cantidades y emite `supplies-updated`.

### Viandas

- Imágenes: campo `image` del formulario multipart, máximo 2 MB, tipos JPEG, JPG, PNG o WEBP.
- Al editar con una imagen nueva se borra la anterior solo después de guardar; si la operación falla, se descarta la imagen recién subida.
- `GET /meals/:id` devuelve la receta con el nombre y la unidad de cada insumo.

### Pedidos

1. El cliente envía `POST /orders` sin necesidad de iniciar sesión.
2. El servidor comprueba que cada vianda exista y que haya stock preparado suficiente. Si falta, responde 409 con el detalle por vianda y no registra nada.
3. Calcula el total con los precios de la base de datos, no con los que envía el cliente, y guarda el nombre y el precio de cada vianda en el pedido.
4. Descuenta el stock de las viandas, genera el código de pedido (`generateOrderCode`), asigna la fecha del día y emite `order-created`. El código está formado por la fecha del día y el número de comanda de ese día, y es único.

Estados de la comanda: `pendiente`, `despachado` y `cancelado`. Estados de pago: `pendiente`, `pagado`, `cancelado`, `reembolsado` y `fallido`. Despachar o cancelar solo es posible si la comanda está pendiente (si no, responde 409).

### Producción

- Suma las cantidades de cada insumo que necesitan todas las viandas de la lista y verifica que alcance el stock de todos antes de descontar.
- Si falta algún insumo, responde 400 con el insumo, la cantidad necesaria y la disponible, y no modifica nada.
- Si alcanza, descuenta los insumos, suma las unidades al stock de cada vianda y emite `production-updated`.

### Pagos

- La aplicación no procesa pagos: solo registra el cobro, que se realiza por fuera, y el método utilizado (`efectivo`, `mercado_pago`, `transferencia`, `tarjeta_debito` o `tarjeta_credito`).
- Verifica que el pedido exista (404) y que no esté cancelado ni pagado (409). Toma el monto del total del pedido y no del cuerpo de la petición, crea el pago con estado `pagado`, actualiza el estado de pago del pedido y emite `order-updated`.

### Usuarios

- El nombre de usuario se genera con el formato `nombre.apellido` en minúsculas, con un contador si ya existe, y se regenera si cambia el nombre o el apellido.
- La contraseña se guarda con hash PBKDF2 y salt aleatorio. En la edición es opcional: si viene vacía, no se cambia.
- No se puede eliminar una cuenta de administrador (error 403).
- Los usuarios eliminados no aparecen en los listados ni pueden iniciar sesión.

## Base de datos

Se utiliza MongoDB (base `bruma_cocina`) a través de Mongoose. Al ser una base documental, las relaciones se resuelven con referencias (`ObjectId`) y con subdocumentos embebidos.

| Colección  | Modelo    | Campos principales                                                                                                                            |
| ---------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `supplies` | `Supply`  | `name` (único), `unit` (kg, L, u), `price`, `currentStock`, `minStock`, `status`.                                                             |
| `meals`    | `Meal`    | `name` (único), `price`, `category`, `description`, `ingredients[]` (`supply`, `quantity`), `image`, `currentStock`, `minStock`, `status`.    |
| `orders`   | `Order`   | `orderCode` (único), datos del cliente, `meals[]` (`meal`, `name`, `price`, `quantity`), `total`, `orderStatus`, `paymentStatus`, `dateOnly`. |
| `payments` | `Payment` | `order` (referencia), `totalAmount`, `paymentMethod`, `paymentStatus`, `paidAt`.                                                              |
| `users`    | `User`    | `userName`, `name`, `lastName`, `role`, `passwordHash`, `salt`, `status`.                                                                     |

### Relaciones

| Origen                      | Destino  | Tipo            | Implementación                                            |
| --------------------------- | -------- | --------------- | --------------------------------------------------------- |
| `Meal.ingredients[].supply` | `Supply` | Muchos a muchos | Array embebido con referencia al insumo y la cantidad.    |
| `Order.meals[].meal`        | `Meal`   | Muchos a muchos | Array embebido con referencia, nombre y precio histórico. |
| `Payment.order`             | `Order`  | Muchos a uno    | `ObjectId` con índice.                                    |
| `User`                      | —        | Independiente   | No se vincula a pedidos ni pagos.                         |

`INGREDIENTS` y `ORDER_ITEMS`, que aparecen en el diagrama entidad–relación, no son colecciones aparte: son los arrays embebidos `Meal.ingredients` y `Order.meals`.

### Decisiones de diseño

- **Precio histórico:** cada pedido guarda el nombre y el precio de la vianda al momento de la compra.
- **Baja lógica:** insumos, viandas y usuarios se marcan como `eliminado` en lugar de borrarse. Un insumo eliminado sigue reservando su nombre por el índice único.
- **Evitar duplicados:** índices únicos en el nombre de insumos y viandas y en el código de pedido.
- **Contraseñas:** hash PBKDF2 con salt aleatorio. Nunca se guardan en texto plano.
- **Fechas:** `dateOnly` y `paidAt` son texto con índice, para filtrar por día.

## Tiempo real

El servidor emite eventos para avisar a las pantallas abiertas que los datos cambiaron:

| Evento               | Cuándo                                  |
| -------------------- | --------------------------------------- |
| `order-created`      | Se registra un pedido nuevo.            |
| `order-updated`      | Se despacha, cancela o cobra un pedido. |
| `production-updated` | Se registra producción.                 |
| `supplies-updated`   | Se ingresa stock de insumos.            |

## Validaciones y errores

Las validaciones se aplican en tres niveles:

1. **Frontend (Zod):** cada formulario valida antes de enviar.
2. **API (express-validator):** cada ruta revisa campos obligatorios, formatos y rangos, y responde con un error 400 que detalla qué campo falló.
3. **Base de datos (Mongoose):** los esquemas definen campos obligatorios, rangos, valores permitidos e índices únicos como última barrera.

La clase `AppError` representa los errores controlados, con mensaje, código de estado y código interno. El middleware `errorHandler` los convierte en una respuesta uniforme.

Formato de las respuestas:

- Éxito: `{ status, message, data }`. Los listados devuelven un arreglo en `data`; las operaciones sobre un registro devuelven el dato envuelto con el nombre de la entidad (`data.supply`, `data.meal`, `data.order`, `data.payment` o `data.user`). El ingreso de stock devuelve `data.supplies`.
- Error: `{ status, message, errorCode, details }`.

## Pruebas

```bash
npm test
```

Ejecuta todas las pruebas con el ejecutor incluido en Node (`node --test`): 24 de 24 aprobadas.

| Tipo        | Archivo                              | Qué cubre                                                                                                                |
| ----------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Unitaria    | `tests/unit/parsers.test.js`         | `parseDecimal`: coma decimal, texto con punto, redondeo, número directo y texto inválido.                                |
| Unitaria    | Modelo `User`                        | `generateSafePassword` y `validatePassword`: hash correcto, contraseñas inválidas y salts distintos.                     |
| Integración | `tests/integration/supplies.test.js` | CRUD de insumos por la API: sesión, creación, lectura, duplicados, stock vacío, edición y baja lógica.                   |
| Integración | `tests/integration/stock.test.js`    | Flujo de stock: producción, pedido, stock insuficiente, cancelación y rechazo de despachar o cobrar un pedido cancelado. |

Las pruebas de integración requieren MongoDB en ejecución y usan las bases `bruma_cocina_test` (insumos) y `bruma_cocina_test_stock` (flujo de stock), que se borran al empezar y al terminar. Se niegan a correr si el nombre de la base no incluye `test` y nunca tocan `bruma_cocina`. Cada archivo usa su propia base porque `node --test` ejecuta los archivos en paralelo. La base de la prueba de insumos puede cambiarse con la variable `MONGO_URI_TEST`.

## Problemas frecuentes

### El servidor se detiene al iniciar

Si la base de datos no está disponible, el servidor muestra el error en la consola y se detiene. Comprobar que MongoDB esté en ejecución y que `MONGO_URI` sea correcta.

### El frontend no puede conectarse o aparece un error de CORS

Comprobar que `FRONTEND_URL` coincida exactamente con el origen del frontend (por ejemplo, `http://localhost:5173`, sin barra final) y que el servidor esté en el puerto configurado en `PORT`.

### La sesión no se mantiene en local

La cookie es `secure`: abrir el frontend desde `http://localhost` y no desde una dirección IP.

### No se ven las imágenes de las viandas

Iniciar el servidor desde la carpeta raíz del backend, porque `uploads/` se resuelve de forma relativa.

### No se puede crear un insumo o vianda con un nombre ya usado

Los nombres son únicos y un registro eliminado de forma lógica sigue reservando el suyo.

### La primera respuesta del sitio desplegado demora

Si el servicio estuvo un tiempo sin uso, la primera carga puede tardar unos segundos.

## Limitaciones conocidas y mejoras futuras

- Implementar transacciones de base de datos en pedidos, producción e ingreso de stock, para garantizar atomicidad y evitar actualizaciones parciales entre colecciones.
- Extraer la lógica de negocio de los controladores a una capa de servicios independiente.
- Aumentar las iteraciones de PBKDF2 para elevar el estándar de seguridad de las contraseñas.
- Manejar de forma más flexible la unicidad de nombres de insumos y viandas dados de baja.
- Normalizar el nombre de usuario generado (quitar acentos y espacios) para evitar nombres como `maría josé.pérez`.
- Agregar un índice único en `userName`, para que la unicidad no dependa solo de la búsqueda previa en el código.
- Generar el código de pedido con un contador atómico por día, para evitar códigos repetidos ante pedidos simultáneos.
- Compartir las constantes de negocio (roles, estados, unidades) con el frontend en un paquete común.

## Enlaces

- Aplicación desplegada: https://bruma-cocina.onrender.com/
- API desplegada: https://bruma-cocina-backend.onrender.com
- Backend: https://github.com/LeaFerrero/bruma-cocina-backend
- Frontend: https://github.com/LeaFerrero/bruma-cocina-frontend
