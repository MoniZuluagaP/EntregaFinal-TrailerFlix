require('dotenv').config();

const express = require('express');
const { sequelize, authenticate, closeConnection } = require('./sequelize');
const { Op } = require('sequelize');
const Filmacion = require('./models/Filmacion');
const Categoria = require('./models/Categoria');
const Genero = require('./models/Genero');
const Actor = require('./models/Actor');
const Tag = require('./models/Tag');
const Actor_Filmacion = require('./models/Actor_Filmacion');
const Tag_Filmacion = require('./models/Tag_Filmacion');

const app = express();
const PORT = process.env.PORT||3000 ;

// Para probar la conexión
// authenticate()
// console.log("procesando informacion de la base de datos")

//Endpoints
// Ruta raíz
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>TrailerFlix - Inicio</title>
          <style>
            body {
              margin: 0;
              font-family: 'Segoe UI', sans-serif;
              background:#555;
              color: #f5f5f5;
              text-align: center;
            }
            header {
              padding: 5em;
              background:rgb(150, 2, 9);
              color: white;
            }
            h1 {
              font-size: 3em;
              letter-spacing: 2px;
              text-transform: uppercase;
              margin: 0;
            }
            .subtitle {
              font-size: 1.2em;
              margin-top: 0.5em;
              padding-top: 1em;
            }
            .credits {
              margin-top: 3em;
              font-size: 1em;
              color: #ccc;
            }
            .catalogo-btn {
              display: inline-block;
              margin-top: 2em;
              padding: 0.8em 2em;
              background-color:rgb(116, 2, 7);
              color: white;
              border: none;
              border-radius: 4px;
              text-decoration: none;
              font-weight: bold;
              font-size: 1.1em;
              box-shadow: 0 0 15px rgba(229,9,20,0.5);
            }
            .catalogo-btn:hover {
              background-color: #bf0810;
            }
          </style>
        </head>
        <body>
          <header>
            <h1>TRAILERFLIX</h1>
            <div class="subtitle">Portal de películas y series</div>
          </header>

          <main>
          <div class="subtitle">Proyecto realizado para <strong>Ingenias - YPF</strong></div>
            <a class="catalogo-btn" href="/filmaciones">Ver catálogo completo</a>

            <div class="credits">
              <p><strong>Desarrollado por:</strong></p>
              <p>Monica Zuluaga Pelaez</p>
              <p>Silvia Urzagasti </p>
            </div>
          </main>
        </body>
        </html>
    `);
});

app.get('/filmaciones/', async (req, res) => {
    try {
        await authenticate();

        const todasLasFilmaciones = await Filmacion.findAll();
        const resultado = [];

        for (let i = 0; i < todasLasFilmaciones.length; i++) {
            const filmacion = todasLasFilmaciones[i];

            // Obtener categoría
            const categoria = await Categoria.findOne({
                where: { idCategoria: filmacion.idCategoria }
            });

            // Obtener género
            const genero = await Genero.findOne({
                where: { idGenero: filmacion.idGenero }
            });

            resultado.push({
                titulo: filmacion.titulo,
                categoria: categoria.nombreCategoria ,
                genero: genero.nombreGenero 
            });
        }

        res.json(resultado);
    } catch (error) {
        console.error('Error al listar resumen de filmaciones:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

//1. Endpoint para traer las peliculas o series por genero especifico (buscado por  params)
app.get('/filmaciones/genero/:nombreGenero', async (req, res) => {
    const { nombreGenero } = req.params;

    try {
        await authenticate(); 

         // Busqueda del  genero buscado,  en la tabla de Generos
        const genero = await Genero.findOne({  
            where: { nombreGenero }
        });

        if (!genero) {
            return res.status(404).json({ error: `El género '${nombreGenero}' no existe.` });
        }

        const filmaciones = await Filmacion.findAll({
            where: { idGenero: genero.idGenero }
        });

        res.json(filmaciones);
    } catch (error) {
        console.error('Error al buscar filmaciones por género:', error);
        res.status(500).json({ error: 'Error del servidor.' });
         }
    // finally {
    //     await closeConnection(); // Cierra conexión 
    // }
});

//2. Endpoint para Obtener películas con los tags "Aventura" y "Ciencia Ficción", o "Aventura" y "Fantasía".

// 3. Endpoint para buscar todas las filmaciones que tengan la palabra "misión" en el resumen y mostrar su categoria y titulo
app.get('/filmaciones/mision', async (req, res) => {
    try {
        await authenticate(); 
        const filmaciones = await Filmacion.findAll({
            where: {resumen: { [Op.like]: '%mision%'  } } //Con esta forma se logra eliminar problema con el acento 
        });

        // creo una lista para guardar los resultados
        const resultado = [];

        // Se itera en todas las filmaciones y buscar la categoría de cada una
        for (let i = 0; i < filmaciones.length; i++) {
            const filmacion = filmaciones[i];
            const categoria = await Categoria.findOne({
                where: { idCategoria: filmacion.idCategoria }
            });

            // Agregar a la lista  título y nombre de categoría (y resumen para verificar)
            resultado.push({
                titulo: filmacion.titulo,
                categoria: categoria ? categoria.nombreCategoria : 'Sin categoría',
                resumen: filmacion.resumen
            });
        }

        // Mostrar todos los resultados
        res.json(resultado);
    } catch (error) {
        console.error('Error al mostrar filmaciones con la palabra mision en el resumen', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
        // finally {
    //     await closeConnection(); // Cierra conexión 
    // }
});


//4. Endpoint para mostrar las series (o filmaciones) con 3 o mas temporadas
app.get('/filmaciones/3temp', async (req, res) => {
    try {
      await authenticate(); 
      const series = await Filmacion.findAll({
          where: {temporadas: {[Op.gte]: 3  } } // series que tengan >= 3 temporadas
      });
      res.json(series); 
  } catch (error) {
      console.error('Error al buscar series con mas de 3 temporadas', error);
      res.status(500).json({ error: 'Error del servidor' });
  } // finally {
    //     await closeConnection(); // Cierra conexión 
    // }
});


//5. Endpoint para contar en cuántas películas/series trabajó el actor Chris Pratt.
app.get('/actores/chris-pratt', async (req, res) => {
    try {
        await authenticate(); 
        // Busco  el actor y sus datos en la tabla Actores
        const actor = await Actor.findOne({
            where: { nombreActor: 'Chris Pratt' }
        });

        if (!actor) {
            return res.status(404).json({ error: 'El actor no esta en las filmaciones' });
        }

        // Cuento cuántas veces aparece en la tabla Actor_Filmacion el id de ese actor
        const cantidad = await Actor_Filmacion.count({
            where: { idActor: actor.idActor }
        });

        res.json({
            actor: actor.nombreActor,
            cantidadFilmaciones: cantidad
        });
    } catch (error) {
        console.error('Error al contar en cuantas filmaciones esta el actor:', error);
        res.status(500).json({ error: 'Error del servidor' });
    } // finally {
    //     await closeConnection(); // Cierra conexión 
    // }
});


//6. Endpoint para mostrar nombre completo de actrices/actores junto a: título de los trabajos, categoría y género.
app.get('/actores/trabajos', async (req, res) => {
    try {
        await authenticate(); 
        // Busco todos los actores y actrices
        const listaDeActores = await Actor.findAll();
        const trabajosPorActor = [];

        // Recorro cada actor/actriz y obtengo un listado de todas las filmaciones de ese actor o actriz
        for (let i = 0; i < listaDeActores.length; i++) {
            const actorActual = listaDeActores[i];

            const ActorFilmaciones = await Actor_Filmacion.findAll({
                where: { idActor: actorActual.idActor },
                attributes: ['idFilmacion', 'idActor'] // así no intenta seleccionar 'id'
            });

            //recorro todas las filmaciones de un mismo actor y de cada una obtengo su categora y genero
            for (let i = 0; i< ActorFilmaciones.length; i++) {
                const idFilmacion = ActorFilmaciones[i].idFilmacion;

                const datosFilmacion = await Filmacion.findOne({
                    where: { idFilmacion: idFilmacion }
                });

                const categoriaFilmacion = await Categoria.findOne({
                    where: { idCategoria: datosFilmacion.idCategoria }
                });

                const generoFilmacion = await Genero.findOne({
                    where: { idGenero: datosFilmacion.idGenero }
                });

                //Guardo información en  la lista de trabajosPorActor
                trabajosPorActor.push({
                    nombreActor: actorActual.nombreActor,
                    nombreFilmacion: datosFilmacion.titulo,
                    Categoria: categoriaFilmacion.nombreCategoria ,
                    Genero: generoFilmacion.nombreGenero
                });
            }
        }
        res.json(trabajosPorActor);
    } catch (error) {
        console.error('Error al querer mostrar  filmaciones por actor/actriz:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }// finally {
    //     await closeConnection(); // Cierra conexión 
    // }
});

//7. Ver solo la categoría "Películas":
//mostrar título en mayúsculas, género en mayúsculas, tags separados por coma, duración y enlace al tráiler.
app.get('/filmaciones/peliculas', async (req, res) => {
    await authenticate(); 
    try {
        // Busco la categoría Películas en la tabla categorias para poder utilizar luego su id
        const categoriaPeliculas = await Categoria.findOne({
            where: { nombreCategoria: 'Película' }
        });

        if (!categoriaPeliculas) {
            return res.status(404).json({ error: 'La categoría no existe.' });
        }

        // Busco todas las filmaciones con esa categoría
        const filmaciones = await Filmacion.findAll({
            where: { idCategoria: categoriaPeliculas.idCategoria }
        });

        //recorro esas filmaciones y de cada una obtengo el genero y los tags
        const filmacionesPeliculas = [];
        for (let i = 0; i < filmaciones.length; i++) {
            const filmacion = filmaciones[i];

            const genero = await Genero.findOne({
                where: { idGenero: filmacion.idGenero }
            });

            const FilmacionTags = await Tag_Filmacion.findAll({
                where: { idFilmacion: filmacion.idFilmacion },
                attributes: ['idTag'] // Evita seleccionar el campo 'id'
            });

            const idsTags = FilmacionTags.map(rel => rel.idTag);

            const tags = await Tag.findAll({
                where: { idTag: idsTags }
            });

            const nombresTags = tags.map(tag => tag.nombreTag);

            filmacionesPeliculas.push({
                titulo: filmacion.titulo.toUpperCase(),
                genero: genero.nombreGenero.toUpperCase(),
                tags: nombresTags.join(', '),
                duracion: filmacion.duracion,
                trailer: filmacion.trailer
            });
        }

        res.json(filmacionesPeliculas);
    } catch (error) {
        console.error('Error al listar películas:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }// finally {
    //     await closeConnection(); // Cierra conexión 
    // }
});

//8. Ver solo la categoría "Series":
//mostrar título en mayúsculas, género en mayúsculas, tags separados por coma, cantidad de temporadas, tráiler y resumen.
app.get('/filmaciones/series', async (req, res) => {
    await authenticate(); 
    try {
         // Busco la categoría Series en la tabla categorias para poder utilizar luego su id
        const categoriaSeries = await Categoria.findOne({
            where: { nombreCategoria: 'Serie' }
        });

        if (!categoriaSeries) {
            return res.status(404).json({ error: 'La categoría "Series" no existe.' });
        }

        // Busco todas las filmaciones con esa categoría
        const filmaciones = await Filmacion.findAll({
            where: { idCategoria: categoriaSeries.idCategoria }
        });

        //recorro esas filmaciones y de cada una obtengo el genero y los tags
        const filmacionesSeries = [];
        for (let i = 0; i < filmaciones.length; i++) {
            const filmacion = filmaciones[i];

            //Genero
            const genero = await Genero.findOne({
                where: { idGenero: filmacion.idGenero }
            });

            // Tags
            const FilmacionTags = await Tag_Filmacion.findAll({
                where: { idFilmacion: filmacion.idFilmacion },
                attributes: ['idTag']
            });

            const idsTags = FilmacionTags.map(rel => rel.idTag);

            const tags = await Tag.findAll({
                where: { idTag: idsTags }
            });

            const nombresTags = tags.map(tag => tag.nombreTag);

            filmacionesSeries.push({
                titulo: filmacion.titulo.toUpperCase(),
                genero: genero.nombreGenero.toUpperCase(),
                tags: nombresTags.join(', '),
                temporadas: filmacion.temporadas,
                trailer: filmacion.trailer,
                resumen: filmacion.resumen
            });
        }

        res.json(filmacionesSeries);
    } catch (error) {
        console.error('Error al listar series:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }// finally {
    //     await closeConnection(); // Cierra conexión 
    // }
});

//9. Endpoint para Identificar la película/serie con más actores y la que tiene menos actores, indicando la cantidad en cada caso.


//10. Endpoint para Contar la cantidad total de películas registradas.
app.get('/filmaciones/conteo-peliculas', async (req, res) => {
    try {
        await authenticate(); 
        // Busco los datos de la categoria pelicula para usar su id
        const categoriaPelicula = await Categoria.findOne({
            where: { nombreCategoria: 'Película' }
        });

        if (!categoriaPelicula) {
            return res.status(404).json({ error: 'La categoría "Película" no existe.' });
        }

        // Hallo cuántas filmaciones tienen esa categoría
        const totalPeliculas = await Filmacion.count({
            where: { idCategoria: categoriaPelicula.idCategoria }
        });

        res.json({
            categoria: 'Película',
            cantidad: totalPeliculas
        });
    } catch (error) {
        console.error('Error al consultar la cantidad de peliculas en el listado de filmaciones', error);
        res.status(500).json({ error: 'Error del servidor' });
    }// finally {
    //     await closeConnection(); // Cierra conexión 
    // }
});


//11. Contar la cantidad total de series registradas.
app.get('/filmaciones/conteo-series', async (req, res) => {
    try {
        await authenticate(); 
        // Busco los datos de la categoria serie para usar su id
        const categoriaSerie = await Categoria.findOne({
            where: { nombreCategoria: 'Serie' }
        });

        if (!categoriaSerie) {
            return res.status(404).json({ error: 'La categoría "Serie" no existe.' });
        }

        // Hallo cuántas filmaciones tienen esa categoría
        const totalSeries = await Filmacion.count({
            where: { idCategoria: categoriaSerie.idCategoria }
        });

        res.json({
            categoria: 'Serie',
            cantidad: totalSeries
        });
    } catch (error) {
        console.error('Error al consultar la cantidad de series en el listado de filmaciones', error);
        res.status(500).json({ error: 'Error del servidor' });
    }// finally {
    //     await closeConnection(); // Cierra conexión 
    // }
});


//12. Listar las series en orden descendente por cantidad de temporadas.
app.get('/filmaciones/series_temporadas', async (req, res) => {
    try {
        await authenticate(); 
        // Busco los datos de la categoria serie para usar su id
        const categoriaSerie = await Categoria.findOne({
            where: { nombreCategoria: 'Serie' }
        });

        if (!categoriaSerie) {
            return res.status(404).json({ error: 'La categoría "Serie" no existe.' });
        }

        // Hallo cuántas filmaciones tienen esa categoría
        const series = await Filmacion.findAll({
            where: { idCategoria: categoriaSerie.idCategoria },
        });
        const seriesPorTemporadas = series.sort((a, b) => parseInt(b.temporadas) - parseInt(a.temporadas));

       res.json(seriesPorTemporadas);
    } catch (error) {
        console.error('Error al ordenar series por cantidad de temporadas', error);
        res.status(500).json({ error: 'Error del servidor' });
    }// finally {
    //     await closeConnection(); // Cierra conexión 
    // }
});

//13. Agregar el campo fecha_lanzamiento (tipo DATE) a la tabla de trabajos fílmicos y actualizar las fechas de los títulos del género "Aventura".

//14. Buscar películas por palabra clave en título o descripción (por ejemplo: "Aventura", "madre", "Ambientada").
app.get('/filmaciones/buscar', async (req, res) => {
    try {
        await authenticate();

        const palabraBuscada = req.query.q;

        if (!palabraBuscada) {
            return res.status(400).json({ error: 'Falta la palabra que quieres buscar' });
        }

        // Busco la categoria pelicula
        const categoriaPelicula = await Categoria.findOne({
            where: { nombreCategoria: 'Película' }
        });

        if (!categoriaPelicula) {
            return res.status(404).json({ error: 'Categoría "Película" no encontrada.' });
        }

        // Busco en las peliculas la palabra buscada, en título o resumen
        const peliculasConPalabra = await Filmacion.findAll({
            where: {
                idCategoria: categoriaPelicula.idCategoria,
                [Op.or]: [
                    { titulo: { [Op.like]: `%${palabraBuscada}%` } },
                    { resumen: { [Op.like]: `%${palabraBuscada}%` } }
                ]
            }
        });
        if (peliculasConPalabra.length>0) {
            res.json(peliculasConPalabra);
        } else {
            res.status(404).json({ mensaje: 'No hay ninguna pelicula con esa palabra en titulo o resumen'})
        }

    } catch (error) {
        console.error('Error al buscar películas por palabra clave:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }//finally {
    //     await closeConnection(); // Cierra conexión 
    // }
});



// Middleware para manejar rutas inexistentes
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada. Verifica la URL." });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
