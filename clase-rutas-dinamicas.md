# Rutas Dinámicas en Next.js (App Router)

## ¿Qué es una ruta dinámica?

En Next.js, una **ruta dinámica** es una ruta cuyo segmento no se conoce de antemano. En lugar de crear un archivo por cada posible URL, usas **corchetes `[nombre]`** en el nombre de la carpeta para capturar ese segmento de forma dinámica.

```
app/
  productos/
    [id]/          ← el [id] puede ser 1, 2, 42, "zapatos", lo que sea
      page.tsx
```

La URL `/productos/5` y la URL `/productos/99` usan el mismo archivo. El valor (`5` o `99`) llega dentro de `params`.

---

## Parte 1 — Ruta dinámica de **página**

### Caso de uso: Página de detalle de producto

Tienes una tienda y cada producto tiene su propia página. En lugar de crear `page.tsx` para cada uno, creas una sola ruta dinámica.

### Estructura de archivos

```
src/app/
  productos/
    [id]/
      page.tsx      ← esta es la página del producto
```

### Código

```tsx
// src/app/productos/[id]/page.tsx

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params   // ← params es una Promise en esta versión

  // Simulamos la búsqueda del producto con ese id
  const producto = {
    id,
    nombre: `Producto ${id}`,
    precio: 29.99,
  }

  return (
    <main>
      <h1>{producto.nombre}</h1>
      <p>ID: {producto.id}</p>
      <p>Precio: ${producto.precio}</p>
    </main>
  )
}
```

### ¿Qué URLs responde este archivo?

| URL visitada         | Valor de `id` |
| -------------------- | ------------- |
| `/productos/1`       | `"1"`         |
| `/productos/42`      | `"42"`        |
| `/productos/zapatillas` | `"zapatillas"` |

> **Importante:** `params` siempre llega como `string`, aunque la URL tenga un número.

---

## Parte 2 — Ruta dinámica de **API** (Route Handler)

### Caso de uso: Endpoint REST para consultar un producto por ID

El frontend (u otro servicio) hace una petición a `/api/productos/5` y recibe los datos de ese producto en JSON.

### Estructura de archivos

```
src/app/
  api/
    productos/
      [id]/
        route.ts    ← handler de la API para ese id
```

### Código

```ts
// src/app/api/productos/[id]/route.ts

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params   // ← igual que en la página, es una Promise

  // Aquí iría la consulta real a base de datos
  const producto = {
    id,
    nombre: `Producto ${id}`,
    precio: 29.99,
    stock: 100,
  }

  if (!producto) {
    return Response.json({ error: "Producto no encontrado" }, { status: 404 })
  }

  return Response.json(producto)
}
```

### ¿Qué URLs responde este handler?

| Petición HTTP              | Valor de `id` | Respuesta                            |
| -------------------------- | ------------- | ------------------------------------ |
| `GET /api/productos/1`     | `"1"`         | `{ id: "1", nombre: "Producto 1" … }` |
| `GET /api/productos/99`    | `"99"`        | `{ id: "99", nombre: "Producto 99" … }` |

Puedes probar el endpoint directamente en el navegador o con una herramienta como Thunder Client / Postman.

---

## Resumen visual

```
/productos/7          →  app/productos/[id]/page.tsx   (renderiza HTML)
/api/productos/7      →  app/api/productos/[id]/route.ts  (devuelve JSON)
```

Ambos reciben `params.id === "7"`.

---

## Diferencias clave entre página y route handler

| | Página (`page.tsx`) | Route Handler (`route.ts`) |
|---|---|---|
| ¿Qué devuelve? | HTML (componente React) | JSON / cualquier Response |
| ¿Quién lo llama? | El navegador al visitar la URL | Fetch, Postman, otro servicio |
| ¿Cómo se exporta? | `export default function` | `export async function GET` (o POST, etc.) |
| ¿Recibe `params`? | Sí, como prop | Sí, como segundo argumento |

---

## Tarea práctica

### Contexto

Ya tienes una app de usuarios funcionando. Ahora vas a agregarle una **vista de perfil** para cada usuario usando una ruta dinámica.

### Objetivo

Crear la página `src/app/usuarios/[id]/page.tsx` que, al visitar `/usuarios/1`, haga un fetch al entrar y muestre el perfil completo de ese usuario.

### Pasos

1. **Crea la ruta dinámica** — crea el archivo `src/app/usuarios/[id]/page.tsx` con un componente `async` que:
   - Reciba `params` y extraiga el `id` con `await params`
   - Haga un `fetch` a la API de usuarios usando ese `id` (por ejemplo `https://jsonplaceholder.typicode.com/users/${id}`)
   - Renderice el perfil completo con los datos recibidos

   ```tsx
   // src/app/usuarios/[id]/page.tsx

   export default async function PerfilUsuario({
     params,
   }: {
     params: Promise<{ id: string }>
   }) {
     const { id } = await params

     const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
     const usuario = await res.json()

     return (
       <main>
         <h1>{usuario.name}</h1>
         <p>Email: {usuario.email}</p>
         <p>Teléfono: {usuario.phone}</p>
         <p>Ciudad: {usuario.address.city}</p>
         <p>Empresa: {usuario.company.name}</p>
       </main>
     )
   }
   ```

2. **Verifica en el navegador:**
   - Visita `/usuarios/1` → perfil de Leanne Graham
   - Visita `/usuarios/3` → perfil de Clementine Bauch
   - Visita `/usuarios/99` → respuesta vacía o error de la API externa

### Bonus

- Maneja el caso en que la API devuelva un usuario vacío o error con `notFound()` de `next/navigation`.
- Agrega un link "← Volver a la lista" que lleve de regreso a `/usuarios`.
- Muestra un estado de carga con `loading.tsx` dentro de la misma carpeta.
