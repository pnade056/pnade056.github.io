
// Flèche
const arrow = document.getElementById("arrow");

console.log(`Scroll vertical : ${window.scrollY}px`);
document.body.style.scrollBahavior = "smooth";

arrow.addEventListener("click", () => {
    if (arrow.style.opacity == 1) {
        window.scrollTo(0, 0);
    }});

window.addEventListener("scroll", () => {

    if (window.innerWidth >= 800 && window.scrollY >= 250) {
        arrow.style.opacity = 1,
        arrow.className = "show";
        arrow.style.cursor = "pointer";
    }

    if (window.scrollY < 250) {
        arrow.style.opacity = 0,
        arrow.style.cursor = "default";        
        }
    });

// Panier
const productsContainer = document.getElementById("products");
const cartContainer = document.getElementById("cart");
const totalContainer = document.getElementById("total");
const cartCount = document.getElementById("cart-count");
const clearCartButton = document.getElementById("clear-cart");

let cart = JSON.parse(localStorage.getItem("cart")) || []; //getItem Cart ou rien

fetch("../products.json")
    .then(response => response.json()) // Convertit la réponse en JSON
    // .then(data => console.log(data)) // Affiche les données reçues
    // .catch(error => console.error("Erreur :", error)); // Gère les erreurs
    .then(products => {
        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("col-md-6");
            productCard.innerHTML = 
            `<div class="card mb-3">
                <img src="${product.img}" class="card-img-top" alt="${product.nom}">
                
                <div class="card-body">
                    <h5 class="card-title">${product.nom}</h5>
                    <!-- <p class="card-text">${product.description}</p> -->
                    <p class="card-text">${product.prix}$</p>
                    <div class="d-flex flex-column gap-1">
                    <button data-id="${product.id}" data-nom="${product.nom}" data-prix="${product.prix}" data-img="${product.img}" data-description="${product.description}" class="btn btn-primary voir-details" data-bs-toggle="modal" data-bs-target="#productModal">Voir détails</button>
                    <button data-id="${product.id}" data-nom="${product.nom}" data-prix="${product.prix}" data-img="${product.img}" data-description="${product.description}" class="btn btn-primary add-to-cart">Ajouter au panier</button>
                    </div>
                </div>
            </div>`;

            productsContainer.appendChild(productCard);
        });

        document.querySelectorAll(".voir-details").forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute("data-id");
                const nom = e.target.getAttribute("data-nom");
                const prix = e.target.getAttribute("data-prix");
                const description = e.target.getAttribute("data-description");
                const img = e.target.getAttribute("data-img");

                showProductModal(id, nom, prix, img, description);

            });

            
        });

        function showProductModal(id, nom, prix, img, description) {
            const productModalTitle = document.getElementById("productModalTitle");
            productModalTitle.textContent = nom;
            const modalBody = document.getElementById("productModalBody");
            modalBody.innerHTML = `<img src="${img}" class="img-fluid mb-3" alt="${nom}">
            <p class="text-center">Prix : ${prix}</p>
            <p class="text-center">${description}</p>`;

            /*const myModal = new bootstrap.Modal(document.getElementById("productModal"));
            myModal.show();*/
        };


        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute("data-id");
                const nom = e.target.getAttribute("data-nom");
                const prix = e.target.getAttribute("data-prix");
                const img = e.target.getAttribute("data-img");

                addToCart(id, nom, prix, img);

            });
        });

        function addToCart(id, nom, prix, img) {
            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({id, nom, prix, quantity: 1});

            }
            updateCart();
            saveCart(); 
        }

        function updateCart() {
            cartContainer.innerHTML = "";
            let total = 0;
            let itemCount = 0;
            cart.forEach(item => {
                total += item.prix * item.quantity;
                itemCount += item.quantity;
                const listItem = document.createElement("li");
                listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
                listItem.innerHTML = `
                ${item.nom} X ${item.quantity} = ${(item.prix * item.quantity).toFixed(2)}$
                <button class="btn btn-danger remove-item" data-id="${item.id}">X</button>`;
                cartContainer.appendChild(listItem);

            });
            totalContainer.textContent = total.toFixed(2);
            cartCount.textContent = itemCount;
            document.querySelectorAll(".remove-item").forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    removeFromCart(id);
                })
            });

            displayClearCartButton();
        }

        function removeFromCart(id) {
            const index = cart.findIndex(item => item.id === id);
            if(index != -1) {
                if(cart[index].quantity > 1) {
                    cart[index].quantity--;
                }
                else {
                    cart.splice(index, 1);
                }
            }
                updateCart();
                saveCart();
        }

        function saveCart() {
            localStorage.setItem("cart", JSON.stringify(cart));
        }

        function clearCart() {
            cart = [];
            saveCart();
            updateCart();
        }

        function displayClearCartButton() {
            if (cart.length > 0) {
                clearCartButton.style.display = "block";
            }
            else{
                clearCartButton.style.display = "none";
            }
        }

    updateCart();
    clearCartButton.addEventListener('click', () => {
        if(confirm("Voulez-vous vraiment vider votre panier?"))
        {
            clearCart();
        }
    })
})
