const produtos = [
    {
        nome: "Batata Bacon Supreme",
        descricao: "Cheddar, bacon crocante e catupiry.",
        preco: 29.90,
        imagem: "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=1200&auto=format&fit=crop"
    },

    {
        nome: "Batata Frango Cremoso",
        descricao: "Frango desfiado, milho e queijo.",
        preco: 27.90,
        imagem: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=1200&auto=format&fit=crop"
    },

    {
        nome: "Batata Calabresa",
        descricao: "Calabresa acebolada e cheddar.",
        preco: 31.90,
        imagem: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop"
    },

    {
        nome: "Batata Vegetariana",
        descricao: "Mix de legumes e queijo especial.",
        preco: 26.90,
        imagem: "https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=1200&auto=format&fit=crop"
    }
];

let carrinho = [];

const cards = document.getElementById("cards");
const cartItems = document.getElementById("cart-items");
const totalElement = document.getElementById("total");
const busca = document.getElementById("search");

function renderProdutos(lista){

    cards.innerHTML = "";

    lista.forEach((produto,index)=>{

        cards.innerHTML += `
            <div class="card">

                <img src="${produto.imagem}" alt="${produto.nome}">

                <div class="card-content">

                    <h3>${produto.nome}</h3>

                    <p>${produto.descricao}</p>

                    <div class="price">
                        R$ ${produto.preco.toFixed(2)}
                    </div>

                    <button class="btn"
                        onclick="addCarrinho(${index})">

                        Pedir Agora

                    </button>

                </div>

            </div>
        `;
    });
}

renderProdutos(produtos);

function addCarrinho(index){

    carrinho.push(produtos[index]);

    atualizarCarrinho();

}

function atualizarCarrinho(){

    cartItems.innerHTML = "";

    let total = 0;

    carrinho.forEach((item,index)=>{

        total += item.preco;

        cartItems.innerHTML += `
            <div class="cart-item">

                <div>
                    <strong>${item.nome}</strong>
                    <p>R$ ${item.preco.toFixed(2)}</p>
                </div>

                <button onclick="removerItem(${index})">
                    X
                </button>

            </div>
        `;
    });

    totalElement.innerText = total.toFixed(2);

}

function removerItem(index){

    carrinho.splice(index,1);

    atualizarCarrinho();

}

function finalizarPedido(){

    if(carrinho.length === 0){

        alert("Seu carrinho está vazio!");

        return;

    }

    let mensagem =
        "🍟 *Pedido Batata Gourmet* %0A%0A";

    let total = 0;

    carrinho.forEach(item=>{

        mensagem +=
            `• ${item.nome} - R$ ${item.preco.toFixed(2)}%0A`;

        total += item.preco;

    });

    mensagem += `%0A💰 Total: R$ ${total.toFixed(2)}`;

    const telefone = "5511999999999";

    window.open(
        `https://wa.me/${telefone}?text=${mensagem}`,
        "_blank"
    );
}

function copiarPix(){

    const chave =
        document.getElementById("pixKey").innerText;

    navigator.clipboard.writeText(chave);

    alert("Chave PIX copiada!");

}

/* BUSCA */

busca.addEventListener("input",()=>{

    const valor =
        busca.value.toLowerCase();

    const filtrados =
        produtos.filter(produto=>

            produto.nome
                .toLowerCase()
                .includes(valor)

        );

    renderProdutos(filtrados);

});
