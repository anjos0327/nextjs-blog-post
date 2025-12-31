# 📝 Next.js Blog Post App

Una aplicación web moderna para gestión de posts de blog construida con Next.js 13+, TypeScript y Prisma.

## ✨ Características

- 📝 **Gestión de Posts**: Crear, leer y eliminar posts de blog
- 👥 **Sistema de Usuarios**: Autenticación JWT con registro y login
- 🔍 **Filtrado Avanzado**: Filtrar posts por autor
- 🌓 **Tema Oscuro/Claro**: Soporte completo para temas
- 📱 **Responsive Design**: Optimizado para móviles y desktop
- ⚡ **Manejo de Errores**: Experiencia robusta con conexiones inestables
- 🗃️ **Base de Datos**: SQLite con Prisma ORM
- 🔄 **Soft Delete**: Eliminación lógica de posts

## 🚀 Tecnologías Utilizadas

### Core Framework
- **Next.js** 16.1.1 - React framework con App Router
- **React** 19.2.3 - Biblioteca de UI
- **TypeScript** 5.x - Tipado estático

### Base de Datos & ORM
- **Prisma** 7.2.0 - ORM moderno para TypeScript
- **SQLite** - Base de datos embebida
- **@prisma/adapter-libsql** 7.2.0 - Adaptador para SQLite

### Autenticación
- **jsonwebtoken** 9.0.3 - Tokens JWT para autenticación
- **@types/jsonwebtoken** 9.0.10 - Tipos para JWT

### UI & Estilos
- **Tailwind CSS** 4.x - Framework de CSS utilitario
- **next-themes** 0.4.6 - Gestión de temas para Next.js
- **react-hot-toast** 2.6.0 - Notificaciones toast

### Desarrollo
- **ESLint** 9.x - Linting de código
- **tsx** 4.21.0 - Ejecutor TypeScript
- **dotenv** 17.2.3 - Variables de entorno

## 📋 Prerrequisitos

- **Node.js** 18.x o superior
- **npm** 8.x o superior (viene incluido con Node.js)
- **Git** para control de versiones

## 🛠️ Instalación y Configuración

### 1. Clona el repositorio
```bash
git clone https://github.com/anjos0327/nextjs-blog-post.git
cd nextjs-blog-post
```

### 2. Instala las dependencias
```bash
npm install
```

### 3. Configura la base de datos
```bash
# Genera el cliente de Prisma
npm run db:generate

# Ejecuta las migraciones
npm run db:migrate

# Siembra la base de datos con datos de ejemplo
npm run db:seed
```

### 4. Inicia el servidor de desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm run start` | Inicia el servidor de producción |
| `npm run lint` | Ejecuta ESLint para verificar el código |
| `npm run db:generate` | Genera el cliente de Prisma |
| `npm run db:migrate` | Ejecuta migraciones de base de datos |
| `npm run db:push` | Sincroniza el esquema con la base de datos |
| `npm run db:seed` | Siembra la base de datos con datos de ejemplo |
| `npm run db:reset` | Resetea la base de datos completamente |
| `npm run db:studio` | Abre Prisma Studio (interfaz gráfica de BD) |

## 🗂️ Estructura del Proyecto

```
nextjs-blog-post/
├── app/                    # Páginas y rutas API (App Router)
│   ├── api/               # Endpoints de API
│   │   ├── auth/         # Autenticación (login, signup, logout)
│   │   ├── posts/        # CRUD de posts
│   │   └── users/        # Gestión de usuarios
│   ├── posts/            # Página de listado de posts
│   ├── login/            # Página de login
│   ├── signup/           # Página de registro
│   └── page.tsx          # Página principal
├── components/           # Componentes reutilizables
│   ├── PostCard.tsx     # Tarjeta de post individual
│   ├── PostFilter.tsx   # Filtro de posts por usuario
│   ├── CreatePostModal.tsx # Modal para crear posts
│   ├── Header.tsx       # Barra de navegación
│   └── ThemeToggle.tsx  # Alternador de tema
├── lib/                 # Utilidades y configuración
│   ├── prisma.ts        # Cliente de Prisma
│   ├── auth.ts          # Utilidades de autenticación
│   └── auth-context.tsx # Contexto de autenticación
├── prisma/              # Configuración de base de datos
│   ├── schema.prisma    # Esquema de base de datos
│   ├── seed.ts         # Script de siembra
│   └── migrations/     # Migraciones de base de datos
├── public/             # Archivos estáticos
├── .env                # Variables de entorno
├── assumptions.md      # Presunciones del desarrollo
└── package.json        # Dependencias y scripts
```

## 🗄️ Base de Datos

La aplicación utiliza SQLite con Prisma ORM. El esquema incluye dos modelos principales:

### User
- `id`: Identificador único (autoincremental)
- `name`: Nombre completo del usuario
- `username`: Nombre de usuario único
- `email`: Correo electrónico único

### Post
- `id`: Identificador único (autoincremental)
- `title`: Título del post
- `body`: Contenido del post
- `userId`: ID del autor (relación con User)
- `deleted`: Flag de eliminación lógica
- `deletedAt`: Timestamp de eliminación (opcional)

## 🔐 Autenticación

La aplicación implementa autenticación JWT con las siguientes características:

- **Registro**: Crear nueva cuenta de usuario
- **Login**: Autenticación con email/username y password
- **Protección de rutas**: Rutas que requieren autenticación
- **Persistencia**: Sesión mantenida en cookies HTTP-only

## 🎨 Funcionalidades

### Para Usuarios No Autenticados
- Ver posts recientes en la página principal
- Navegar a la página completa de posts
- Filtrar posts por autor
- Ver detalles de posts

### Para Usuarios Autenticados
- Todas las funcionalidades anteriores, más:
- Crear nuevos posts
- Eliminar posts propios (con confirmación)
- Acceso automático a la página de posts al iniciar sesión

## 🌐 API Endpoints

### Posts
- `GET /api/posts` - Lista todos los posts (con filtrado opcional por userId)
- `POST /api/posts` - Crea un nuevo post (requiere autenticación)
- `DELETE /api/posts/[id]` - Elimina un post (soft delete, requiere autenticación)

### Autenticación
- `POST /api/auth/signup` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cierre de sesión
- `GET /api/auth/me` - Verificar sesión actual

### Usuarios
- `GET /api/users` - Lista todos los usuarios

## 🔧 Configuración de Desarrollo

### Variables de Entorno
```env
# Archivo .env en la raíz del proyecto
DATABASE_URL="file:./dev.db"
```

### Base de Datos de Desarrollo
- Archivo: `dev.db` (SQLite)
- Ubicación: Raíz del proyecto
- Se incluye automáticamente en el control de versiones

## 🚀 Despliegue

### Para Producción
```bash
# Construir la aplicación
npm run build

# Iniciar servidor de producción
npm run start
```

### Variables de Entorno para Producción
Asegúrate de configurar `DATABASE_URL` apuntando a tu base de datos de producción.

## 🤝 Contribuciones

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa el archivo `assumptions.md` para entender las decisiones de diseño
2. Verifica los logs de la consola para errores
3. Abre un issue en el repositorio de GitHub

---

**Desarrollado con ❤️ usando Next.js, TypeScript y Prisma**
