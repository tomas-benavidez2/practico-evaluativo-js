let libros = JSON.parse(localStorage.getItem('libros')) || []

let editando = false;
let indice_editar = null;
let orden_ascendente = true

// Funcion para carga de libros
const agregar_libro = () => {

    const titulo = document.getElementById('titulo').value.trim()
    const autor = document.getElementById('autor').value.trim()
    const anio = document.getElementById('anio').value
    const genero = document.getElementById('genero').value

    if (titulo !== '' && autor !== '' && anio !== '' && genero !== '') {

        if (libro_existe(libros, titulo, autor)) {
            alert('El libro que desea agregar ya se encuentra cargado')
            editando = false
            document.querySelector('button[type="submit"]').innerText = 'Agregar Libro'
        } else {
            if (editando){
                libros[indice_editar] = {titulo, autor, anio, genero}
                editando = false
                indice_editar = null
                document.querySelector('button[type="submit"]').innerText = 'Agregar Libro'
            }else{
                libros.push({ titulo, autor, anio, genero, leido: false})
            }  
        }
        localStorage.setItem('libros', JSON.stringify(libros))


        document.getElementById('titulo').value = ''
        document.getElementById('autor').value = ''
        document.getElementById('anio').value = ''
        document.getElementById('genero').value = ''

        actualizarTodo()
    }
    
}

//funcion para verificar si existe el libro o si ya esta cargado
const libro_existe = (lista = libros, titulo, autor) => { 
    existe = libros.some(libro => 
        libro.titulo.toLowerCase() === titulo.toLowerCase() &&
        libro.autor.toLowerCase() === autor.toLowerCase()
        )
    console.log(existe)
    return existe
    }

// Funcion para renderizar listas de libros
const renderizar_libros = (lista = libros) => {

    const tabla = document.getElementById("tabla_libros").querySelector('tbody')

    tabla.innerText = ''

    lista.forEach(libro => {
        
        const index_real = libros.indexOf(libro) // Obtiene el indice real del array original

        const fila = document.createElement('tr')

        fila.innerHTML = `
            <td>${index_real + 1}</td>
            <td>${libro.titulo}</td>
            <td>${normalizarPalabra(libro.genero)}</td>
            <td>${libro.autor}</td>
            <td>${libro.anio}</td>
            <td class="acciones">
                <button onclick="editar_libro(${index_real})" class="boton_editar">Editar</button>
                <button onclick="eliminar_libro(${index_real})" class="boton_eliminar">Eliminar</button>
            </td>
            <td class="leido">
                <input type="checkbox" id="leido_${index_real}" ${libro.leido ? 'checked' : ''} onchange="cambio_leido(${index_real})">
            </td>
        `

        tabla.appendChild(fila)

    });
}

//funcion para editar libros
const editar_libro = (index) => {
    const libro = libros[index]
    document.getElementById('titulo').value = libro.titulo
    document.getElementById('autor').value = libro.autor
    document.getElementById('anio').value = libro.anio
    document.getElementById('genero').value = libro.genero
    document.querySelector('button[type="submit"]').innerText = 'Actualizar Libro'
    editando = true
    indice_editar = index
}

//funcion para eliminar libros
const eliminar_libro = (index) => {

    libros.splice(index, 1)

    localStorage.setItem('libros', JSON.stringify(libros))

    actualizarTodo()
}

// Filtro de libros por titulo y genero
const filtrar_libro = () =>{
    const titulo = document.getElementById('busqueda').value.toLowerCase()
    const genero = document.getElementById('filtro_genero').value
    const estaMarcado = document.getElementById('leidos').checked // Toma directamente del elemento el estado checked (true/false)

    // Chequea primero si esta marcada la opcion para mostrar solo los leidos y los filtra de ser verdadero
    if (estaMarcado) {
        lista_leidos = libros.filter(libro => libro.leido === true)
        console.log(lista_leidos)
        } else {
            lista_leidos = libros
        }

    // Luego aplica el resto de los filtros a lista_leidos, que previamente aplico ese filtro
    if (titulo === '' && genero === 'todos'){
        renderizar_libros(lista_leidos)
    } else if (titulo != '' && genero === 'todos') {
        const libro_filtrado = lista_leidos.filter(libro => libro.titulo.toLowerCase().includes(titulo))
        renderizar_libros(libro_filtrado)
    } else if (titulo === '' && genero != 'todos') {
        const libro_filtrado = lista_leidos.filter(libro => libro.genero === genero)
        renderizar_libros(libro_filtrado)
    } else if (titulo != '' && genero != 'todos') {
        const libro_filtrado_genero = lista_leidos.filter(libro => libro.genero === genero)
        const libro_filtrado = libro_filtrado_genero.filter(libro => libro.titulo.toLowerCase().includes(titulo))
        renderizar_libros(libro_filtrado)
    }
}

//funcion para actualizar el select de generos en los filtros
const actualizarSelectGeneros = () => {
    const select = document.getElementById('filtro_genero')
    const generosUnicos = [...new Set(libros.map(libro => libro.genero))]

    select.innerHTML = `<option value="todos">Todos</option>`
    generosUnicos.forEach(genero => {
        const option = document.createElement("option")
        option.value = genero
        option.text = normalizarPalabra(genero)
        select.appendChild(option)
    })
}

//cambia en el local a leido o no leido
const cambio_leido = (index) => {
    
    libros[index].leido = !libros[index].leido

    localStorage.setItem('libros', JSON.stringify(libros))

    resumenDatos()
}

// Funcion para mostrar bien el texto de los generos en el front (ej. 'ciencia_ficcion' >>> 'Ciencia Ficcion')
const normalizarPalabra = (palabra) => {
    return palabra
        .replace(/_/g, ' ')             // Reemplaza guiones bajos por espacios (/g permite que actue sobre todos los "_" que encuentre)
        .split(' ')                     // Divide en palabras
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()) // Capitaliza cada palabra
        .join(' ');                     // Une la palabra con espacios
}

//funcion para mostrar resumen de datos
const resumenDatos = () => {
    const resumen = document.getElementById('resumen_datos')
    const anioPosterior = 2010

    const total = libros.length

    const sumarAnios = libros.reduce((acum, libro) => acum + parseInt(libro.anio), 0)
    const promedioAnios = Math.round(sumarAnios / total)

    const posterioresA = libros.filter(libro => libro.anio > anioPosterior).length

    const libroMasAntiguo = libros.reduce((libroViejo, libro) => (libro.anio < libroViejo.anio ? libro : libroViejo), libros[0])

    const libroMasNuevo = libros.reduce((libroNuevo, libro) => (libro.anio > libroNuevo.anio ? libro : libroNuevo), libros[0])

    const cantLibrosLeidos = libros.filter(libro => libro.leido === true).length

    resumen.innerHTML = `
    <div class="dato">
    <strong>Total de libros:</strong><p>${total}</p>
    </div>
    <div class="dato">
    <strong>Total de libros leídos:</strong><p>${cantLibrosLeidos}</p>
    </div>
    <div class="dato">
    <strong>Año promedio de publicación:</strong><p>${promedioAnios}</p>
    </div>
    <div class="dato">
    <strong>Libros posteriores a ${anioPosterior}:</strong><p>${posterioresA}</p>
    </div>
    <div class="dato">
    <strong>Libro más antiguo:</strong><p>"${libroMasAntiguo.titulo}", ${libroMasAntiguo.anio}</p>
    </div>
    <div class="dato">
    <strong>Libro más nuevo:</strong><p>"${libroMasNuevo.titulo}", ${libroMasNuevo.anio}</p>
    </div>`
}

// Funcion para ordenar por año (ascendente y descendente)
const ordenar_por_anio = () => {

    const boton_ordenar = document.getElementById('btn_ordenar')

    if (orden_ascendente) {
        const libros_ordenados = [...libros].sort((a, b) => a.anio - b.anio)
        renderizar_libros(libros_ordenados)
        orden_ascendente = false
        boton_ordenar.innerText = 'Ordenar por Año ▲'
    } else {
        const libros_ordenados = [...libros].sort((a, b) => b.anio - a.anio)
        renderizar_libros(libros_ordenados)
        orden_ascendente = true
        boton_ordenar.innerText = 'Ordenar por Año ▼'
    }
}

//funcion para volver la lista al orden original por su index
const orden_original = () => {

    renderizar_libros(libros)
}

const actualizarTodo = () => {
    renderizar_libros()
    actualizarSelectGeneros()
    resumenDatos()
}

// Acciones realizadas al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    actualizarTodo()
    console.log(libros)
})