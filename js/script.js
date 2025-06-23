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

        if (editando){
            libros[indice_editar] = {titulo, autor, anio, genero}
            editando = false
            indice_editar = null
            document.querySelector('button[type="submit"]').innerText = 'Agregar Libro'
        }else{
            const ya_existe = libros.some(libro =>
                libro.titulo.toLowerCase() === titulo.toLowerCase() &&
                libro.autor.toLowerCase() === autor.toLowerCase()
            )
            if(ya_existe) {
                alert('Este libro ya se encuentra cargado')
                return
            }
            libros.push({ titulo, autor, anio, genero })
        }  

        localStorage.setItem('libros', JSON.stringify(libros))


        document.getElementById('titulo').value = ''
        document.getElementById('autor').value = ''
        document.getElementById('anio').value = ''
        document.getElementById('genero').value = ''

        renderizar_libros()
    }
    
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
        `

        tabla.appendChild(fila)

    });
}

// Acciones realizadas al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    renderizar_libros()
})