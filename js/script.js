let libros = JSON.parse(localStorage.getItem('libros')) || []

let editando = false;
let indice_editar = null;

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

        renderizar_libros()
        actualizarSelectGeneros()
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
            <td>${index_real}</td>
            <td>${libro.titulo}</td>
            <td>${normalizarPalabra(libro.genero)}</td>
            <td>${libro.autor}</td>
            <td>${libro.anio}</td>
            <td>
                <button onclick="editar_libro(${index_real})" class="boton_editar">Editar</button>
                <button onclick="eliminar_libro(${index_real})" class="boton_eliminar">Eliminar</button>
            </td>
            <td>
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

    renderizar_libros()    


}

// Filtro de libros por titulo y genero
const filtrar_libro = () =>{
    const titulo = document.getElementById('busqueda').value.toLowerCase()
    const genero = document.getElementById('filtro_genero').value

    if (titulo === '' && genero === 'todos'){
        renderizar_libros()
    } else if (titulo != '' && genero === 'todos') {
        const libro_filtrado = libros.filter(libro => libro.titulo.toLowerCase().includes(titulo))
        renderizar_libros(libro_filtrado)
    } else if (titulo === '' && genero != 'todos') {
        const libro_filtrado = libros.filter(libro => libro.genero === genero)
        renderizar_libros(libro_filtrado)
    } else if (titulo != '' && genero != 'todos') {
        const libro_filtrado_genero = libros.filter(libro => libro.genero === genero)
        const libro_filtrado = libro_filtrado_genero.filter(libro => libro.titulo.toLowerCase().includes(titulo))
        renderizar_libros(libro_filtrado)
    }
}

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

    }

//funcion para filtrar leidos
const filtrar_leidos = () =>{
    const checkboxLeidos = document.getElementById('leidos')
    const estaMarcado = checkboxLeidos.checked

     let lista_leidos = []

      if (estaMarcado) {
        
            lista_leidos = libros.filter(libro => libro.leido === true)
        } else {
        
            lista_leidos = libros
    }

    renderizar_libros(lista_leidos)

}

// Funcion para mostrar bien el texto de los generos en el front (ej. 'ciencia_ficcion' >>> 'Ciencia Ficcion')
const normalizarPalabra = (palabra) => {
    return palabra
        .replace(/_/g, ' ')             // Reemplaza guiones bajos por espacios (/g permite que actue sobre todos los "_" que encuentre)
        .split(' ')                     // Divide en palabras
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()) // Capitaliza cada palabra
        .join(' ');                     // Une la palabra con espacios
}

// Funcion para formatear el input del usuario si carga un nuevo genero (si lo implementamos)
// ej. Terror Psicologico >>> terror_psicologico
const formatearPalabra = (palabra) => {
    return palabra
        .trim()
        .replace(/_/g, ' ')
        .toLowerCase
}

// Acciones realizadas al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    renderizar_libros()
    actualizarSelectGeneros()
})