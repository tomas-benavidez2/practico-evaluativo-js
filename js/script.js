let libros = JSON.parse(localStorage.getItem('libros')) || []

let editando = false;
let indice_editar = null;

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

    }
    
}