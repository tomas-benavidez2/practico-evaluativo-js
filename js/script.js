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
            editando = False
        } else {
            if (editando){
                libros[indice_editar] = {titulo, autor, anio, genero}
                editando = false
                indice_editar = null
                document.querySelector('button[type="submit"]').innerText = 'Agregar Libro'
            }else{
                libros.push({ titulo, autor, anio, genero })
            }  
        }
        localStorage.setItem('libros', JSON.stringify(libros))


        document.getElementById('titulo').value = ''
        document.getElementById('autor').value = ''
        document.getElementById('anio').value = ''
        document.getElementById('genero').value = ''

        renderizar_libros()
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
            <td>${libro.genero}</td>
            <td>${libro.autor}</td>
            <td>${libro.anio}</td>
            <td>
                <button onclick="editar_libro(${index_real})">Editar</button>
                <button onclick="eliminar_libro(${index_real})">Eliminar</button>
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
//buscar libros por titulo
const filtrar_libro = () =>{
    const texto = document.getElementById('busqueda').value.toLowerCase()

    const libro_filtrado = libros.filter(libro => libro.titulo.toLowerCase().includes(texto))
    
    renderizar_libros(libro_filtrado)


}


// Acciones realizadas al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    renderizar_libros()
})