// Ids
const items = document.getElementById('items');
const cards = document.getElementById('cards'); 
const footer = document.getElementById('footer'); 

// Templates
const templateCard = document.getElementById('template-card').content; 
const templateFooter = document.getElementById('template-footer').content;
const templateCart = document.getElementById('template-carrito').content;

const fragment = document.createDocumentFragment();

let cart = {};

// Ejecutar fetchData() cuando cargue la pagina
document.addEventListener('DOMContentLoaded', ()=> {
    fetchData();
})

// Evento para añadir al carrito
cards.addEventListener('click', (e)=> {
    addCart(e);
})

items.addEventListener('click', e => {
    btnAction(e);
})

// Leer los elementos del JSON con Async y Await
const fetchData = async ()=> {
    try {
        const res = await fetch('productos.json');
        const data = await res.json();
        printCard(data);
    } catch (error) {
        console.log(error)
    }
}

const printCard = data => {
    data.forEach(producto => {
        console.log(producto) // Con esto podemos visualizar los productos en la consola
        templateCard.querySelector('h5').textContent = producto.title; // Accedemos al titulo del producto y lo cambio por el del objeto

        templateCard.querySelector('p').textContent = producto.precio; // Lo mismo pero con el precio

        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl);
        templateCard.querySelector('.btn-dark').dataset.id = producto.id; // Establecemos el Id a cada boton

        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone); // Utilizamos fragment para acelerar nuestra pag
    })
    cards.appendChild(fragment); // Pintamos los productos en items
}

// Funcion para añadir al carrito
const addCart = e => {
    // Creamos un if que detecte si el boton que tocamos tiene esa clase
    if (e.target.classList.contains('btn-dark')) {
        setCart(e.target.parentElement);
    }
    e.stopPropagation();
}

// Funcion para generar un objeto a partir de cada producto
const setCart = obj => {
    // Crear el objeto
    const product = {
        id: obj.querySelector('.btn-dark').dataset.id,
        title: obj.querySelector('h5').textContent,
        precio: obj.querySelector('p').textContent,
        cantidad: 1
    }

    console.log(product);

    //Sentencia para sumarle +1 cantidad al producto
    if(cart.hasOwnProperty(product.id)) {
        product.cantidad = cart[product.id].cantidad + 1;
    }

    cart[product.id] = {...product}; // Le pasamos al carrito todo el producto generado

    printCart();
    console.log(cart)
}

const printCart = ()=> {
    items.innerHTML = '';
    Object.values(cart).forEach(prod => {
        templateCart.querySelector('th').textContent = prod.id;
        templateCart.querySelectorAll('td')[0].textContent = prod.title;
        templateCart.querySelectorAll('td')[1].textContent = prod.cantidad;
        templateCart.querySelector('.btn-info').dataset.id = prod.id;
        templateCart.querySelector('.btn-danger').dataset.id = prod.id;
        templateCart.querySelector('span').textContent = prod.cantidad * prod.precio;

        const clone = templateCart.cloneNode(true);
        fragment.appendChild(clone);
    })
    items.appendChild(fragment);

    printFooter();
}

const printFooter = ()=> {
    footer.innerHTML = '';
    if (Object.keys(cart).length === 0) {
        footer.innerHTML = 
        `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return;
    } 

    // Sumar cantidades del carrito
    const quantity = Object.values(cart).reduce((acc, {cantidad})=> acc + cantidad, 0);
    const totalPrice = Object.values(cart).reduce((acc, {cantidad, precio})=> acc + cantidad * precio, 0);
    console.log(quantity);
    console.log(totalPrice);

    templateFooter.querySelectorAll('td')[0].textContent = quantity;
    templateFooter.querySelector('span').textContent = totalPrice;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const deleteCart = document.getElementById('vaciar-carrito');
    deleteCart.addEventListener('click', ()=> {
        cart = {};
        printCart();
    })
}

// Hacer que funcionen los botones de disminuir o aumentar
const btnAction = e => {
    // Aumentar
    if (e.target.classList.contains('btn-info')) {
        const product = cart[e.target.dataset.id];
        product.cantidad = cart[e.target.dataset.id].cantidad + 1;

        cart[e.target.dataset.id] = {...product};
        printCart();
    }
 
    // Disminuir
    if (e.target.classList.contains('btn-danger')) {
        const product = cart[e.target.dataset.id];
        product.cantidad--;

        // Eliminar del carro si tengo 0 cantidades
        if (product.cantidad === 0) {
            delete cart[e.target.dataset.id];
        }
        printCart();
    }

    e.stopPropagation();
}