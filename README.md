# 🎬 Entrega Final  TrailerFlix

Este Proyecto backend con Node.js, ExpressJS, Sequelize y MySQL es para la gestión de películas y series.

## 📁 Estructura del Proyecto
```
EntregaFinal-TrailerFlix/
├── models/
    └── Actor_Filmacion.js
    └── Actor.js
    └── Categoria.js
    └── Filmacion.js
    └── Genero.js
    └── Tag_Filmacion.js
    └── Tag.js
├── node_modules/
├── .env
├── .gitattributes
├── package-lock.json
├── package.json
├── README.md
|── sequelize.js
├── server.js
└── trailerflix.json

```
## 🚀 Instalación

### 1. Clonar el repositorio:
   ```bash
   git clone https://github.com/MoniZuluagaP/EntregaFinal-TrailerFlix.git
   ```

### 2. Instalar las dependencias:
   ```bash
   npm install
   ```

### 3. Configurar variables de entorno (`.env`):
   ```env
   PORT=3000
   DB_database=trailerflix
   DB_username=tu_usuario
   DB_password=tu_contraseña
   DB_host=localhost
   DB_dialect=mysql
   ```
## 🌐 Endpoints principales

| Método | Ruta              | Descripción                          |
|--------|-------------------|--------------------------------------|
| GET    | /filmaciones      | Lista todas las filmaciones         |
| GET    | /filmaciones/genero/:nombreGenero  | Trae las peliculas o series por un genero especifico (buscado por  params)    |
| GET  | /filmaciones/mision       | Busca todas las filmaciones que tengan la palabra "misión" en el resumen y mostrar su categoria y titulo
| GET | /filmacion/3temp    | Muestra las series con 3 o mas temporadas|
| GET | /actores/chris-pratt    | Cuenta en cuántas películas/series trabajó el actor Chris Pratt.
| GET | /actores/trabajos   | Muestra el nombre completo de actrices/actores junto al título de los trabajos, categoría y género|
| GET | /filmacion/peliculas    | Muestra título y género en mayúsculas, tags separados por coma, duración y enlace al tráiler|
| GET | /filmaciones/series    | Muestra título y género en mayúsculas, tags separados por coma, cantidad de temporadas, tráiler y resumen|
| GET | /filmaciones/conteo-peliculas    |Cuenta la cantidad total de películas registradas|
| GET | /filmaciones/conteo-series    |Cuenta la cantidad total de series registradas|
| GET | /filmaciones/series_temporadas   | Lista las series en orden descendente por cantidad de temporadas|
| GET | /filmaciones/buscar    | Busca películas por palabra clave en título o descripción (por ejemplo: "Aventura", "madre", "Ambientada")|
---

## 🗂️ Modelo de base de datos

### La BD `trailerflix` tiene las siguientes tablas:

- `Filmaciones`
- `Categorias`
- `Generos`
- `Tags`
- `Actores`
- `Tag_Filmacion`
- `Actor_Filmacion`

### Diagrama de Entidad Relación (DER)

![DER](https://github.com/silUrzagasti/EntregaFinal-TrailerFlix/blob/main/trailerflix.png?raw=true)


### Consultas en MySQL
1. Muestra las paliculas ordenadas por nombre del genero
```sql
SELECT F.idFilmacion, F.titulo AS TITULO, G.nombreGenero AS GENERO
FROM filmaciones F JOIN generos G ON F.idGenero = G.idGenero
ORDER BY G.nombreGenero;
```

3. Muestra los títulos y categorías cuyo resumen conteniene la palabra "misión"
```sql
SELECT F.titulo, C.nombreCategoria, F.resumen
FROM filmaciones F JOIN categorias C ON F.idCategoria = C.idCategoria
WHERE F.resumen LIKE '%misión%';
```
4. Muestra las series con al menos 3 temporadas
```sql
SELECT titulo, temporadas, idCategoria FROM filmaciones
WHERE temporadas >= 3 AND idCategoria=2;
```
5. Cuenta en cuántas películas/series trabajó el actor Chris Pratt
```sql
SELECT A.nombreActor AS ACTOR, count(F.idfilmacion) AS FILMACIONES_TRABAJADAS
FROM actores A JOIN actor_filmacion AF ON A.idActor=AF.idActor
JOIN filmaciones F ON AF.idFilmacion=F.idFilmacion
WHERE A.nombreActor="Chris Pratt";
```
6. Muestra el nombre completo de actrices/actores y en que filmaciones trabajo junto a su categoría y género. Ordenado por actor/actriz y luego por filmacion
```sql
SELECT A.nombreActor AS ACTOR_ACTRIZ, F.titulo AS TRABAJOO_EN, C.nombreCategoria AS CATEGORIA, G.nombreGenero AS GENERO
FROM actores A JOIN actor_filmacion AF ON A.idActor=AF.idActor
JOIN filmaciones F ON AF.idFilmacion=F.idFilmacion
JOIN categorias C ON F.idCategoria=C.idCategoria
JOIN generos G ON F.idGenero=G.idGenero
ORDER BY A.nombreActor, F.titulo;
```
1. Muestra el título y el género en mayúsculas, las etiquetas separadas por coma, duración y enlace al tráiler de las "Peliculas"
```sql

SELECT UPPER(F.titulo) AS Titulo, UPPER(G.nombreGenero) AS Genero, GROUP_CONCAT(T.nombreTag SEPARATOR ', ') AS Etiquetas, F.duracion AS Duracion, F.trailer AS Link_Trailer
FROM filmaciones F
JOIN categorias C ON F.idCategoria = C.idCategoria
JOIN generos G ON F.idGenero = G.idGenero
JOIN tag_filmacion TF ON F.idFilmacion = TF.idFilmacion
JOIN tags T ON TF.idTag = T.idTag
WHERE C.nombreCategoria = 'Película'
GROUP BY F.titulo, G.nombreGenero, F.duracion, F.trailer;
```
8. Muestra el título y el género en mayúsculas, las etiquetas separadas por coma, cantidad de temporadas, enlace al tráiler y resumen de las "Series"
```sql

SELECT UPPER(F.titulo) AS Titulo, UPPER(G.nombreGenero) AS Genero, GROUP_CONCAT(T.nombreTag SEPARATOR ', ') AS Etiquetas, F.temporadas AS Temporadas, F.trailer AS Link_Trailer, f.resumen AS Resumen
FROM filmaciones F
JOIN categorias C ON F.idCategoria = C.idCategoria
JOIN generos G ON F.idGenero = G.idGenero
JOIN tag_filmacion TF ON F.idFilmacion = TF.idFilmacion
JOIN tags T ON TF.idTag = T.idTag
WHERE C.nombreCategoria = 'Serie'
GROUP BY F.titulo, G.nombreGenero, F.temporadas, F.trailer, F.resumen;
```
9. Muestra de manera separada la película/serie con más actores y menos actores junto a la cantidad de actores respectivamente.
```sql
SELECT F.titulo AS Filmacion_con_mas_actores, COUNT(AF.idActor) AS Cantidad_Actores
FROM filmaciones F JOIN actor_filmacion AF ON F.idFilmacion = AF.idFilmacion
GROUP BY F.idFilmacion, F.titulo
ORDER BY Cantidad_Actores DESC
LIMIT 1;
```

```sql
SELECT F.titulo AS Filmacion_con_menos_actores, COUNT(AF.idActor) AS Cantidad_Actores
FROM filmaciones F JOIN actor_filmacion AF ON F.idFilmacion = AF.idFilmacion
GROUP BY F.idFilmacion, F.titulo
ORDER BY Cantidad_Actores
LIMIT 1;
```
10. Cuenta todas las películas registradas.
```sql
SELECT COUNT(*) AS Cantidad_Peliculas
FROM filmaciones F JOIN categorias C ON F.idCategoria = C.idCategoria
WHERE C.nombreCategoria = 'Película';
```
11. Cuenta todas las series registradas.
```sql
SELECT COUNT(*) AS Cantidad_Series
FROM filmaciones F JOIN categorias C ON F.idCategoria = C.idCategoria
WHERE C.nombreCategoria = 'Serie';
```
12. Muestra las series en orden descendente por cantidad de temporadas. Al multiplicar por 1 el campo temporadas (VARCHAR) se convierte a entero para que lo ordene correctamente
```sql
SELECT F.titulo AS Serie, F.temporadas * 1 AS Cantidad_Temporadas
FROM filmaciones F JOIN categorias C ON F.idCategoria = C.idCategoria
WHERE C.nombreCategoria = 'Serie'
ORDER BY F.temporadas * 1 DESC;
```
14. Buscar por palabra clave en título o descripción (por ejemplo: "Aventura" , "madre" , "Ambientada" )
```sql
SELECT titulo, resumen
FROM filmaciones
WHERE titulo LIKE '%madre%' OR resumen LIKE '%madre%';
```
## 🧑‍🤝‍🧑 Equipo de Trabajo
### Zuluaga, Mónica Maria
### Urzagasti, Silvia Liliana
