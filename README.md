# Documentación del Proyecto Blog

Este documento describe los pasos necesarios para instalar y ejecutar el proyecto Blog en su entorno local. El proyecto consta de dos partes principales: el cliente y la API, cada una con sus propias dependencias.

## Requisitos Previos

Antes de comenzar, asegúrese de tener instalado:

- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)
- Un cliente de Git para clonar el repositorio (puede usar la línea de comandos o una interfaz gráfica como [GitHub Desktop](https://desktop.github.com/))

## Instalación

Siga estos pasos para configurar el proyecto en su entorno local.

### Clonar el Repositorio

Clone el repositorio de GitHub a su computadora local usando el siguiente comando en su terminal:

```bash
git clone <url-del-repositorio>
```

### Instalar Dependencias

Navegue a las carpetas del cliente y del API y ejecute el siguiente comando en ambas para instalar las dependencias necesarias:

```bash
npm install
```

### Configurar la Base de Datos

Utilice su cliente de MySQL favorito para ejecutar los siguientes comandos y generar la base de datos necesaria para el proyecto:

```sql
CREATE SCHEMA `blog`;

USE `blog`;

CREATE TABLE `users` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `img` VARCHAR(255),
    PRIMARY KEY (`id`)
);

CREATE TABLE `posts` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `cat` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `desc` TEXT NOT NULL,
    `img` VARCHAR(255) NOT NULL,
    `date` DATETIME NOT NULL,
    `uid` INT NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_posts_users` FOREIGN KEY (`uid`)
    REFERENCES `users` (`id`) ON DELETE CASCADE
);
```

### Configurar Claves de Acceso a la Base de Datos

Asegúrese de actualizar las credenciales de acceso a la base de datos en el archivo de configuración de la conexión, generalmente ubicado en el código del servidor API:

```javascript
import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "blog",
});
```

### Iniciar los Servidores

Inicie los servidores del cliente y del API navegando a sus respectivas carpetas y ejecutando el siguiente comando:

```bash
npm start
```

## Uso de la Aplicación

Una vez que los servidores estén en ejecución, puede acceder a la aplicación a través de su navegador web.

- **Registro e Inicio de Sesión**: Acceda a la página de inicio de sesión y utilice el botón de registro para crear una nueva cuenta.
- **Visualización de Entradas**: Todos los usuarios, registrados o no, pueden ver las entradas del blog.
- **Búsqueda y Filtros**: Utilice la barra de búsqueda y los botones de categoría para filtrar el contenido del blog.
- **Creación de Entradas**: Los usuarios registrados pueden crear nuevas entradas de blog, especificando título, categoría, descripción e imagen.
- **Edición y Eliminación de Entradas**: Los usuarios pueden editar y eliminar sus propias entradas.

## Características Importantes

- Soporte para múltiples usuarios con registro e inicio de sesión.
- Capacidad para crear, visualizar, editar y eliminar entradas de blog.
- Funcionalidad de búsqueda y filtros para encontrar entradas específicas.
- Asignación automática de autor y fecha a las nuevas entradas de blog.

## Tiempo de Desarrollo

El desarrollo de este proyecto tomó aproximadamente 4 horas.

---

Este documento proporciona una guía general para poner en marcha el proyecto Blog. Para más detalles o asistencia, contactar al equipo de desarrollo.
