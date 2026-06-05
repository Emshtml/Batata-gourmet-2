// ========================================
// CARDÁPIO BATATA RECHEADA GOURMET
// ========================================

const produtos = [
    { id: 1, nome: "Batata Cheddar Bacon", descricao: "Batata recheada com cheddar cremoso, bacon crocante e cebolinha fresca.", preco: 32.90, imagem: "./assets/img/batata-cheddar-bacon.png" },
    { id: 2, nome: "Batata Frango Catupiry", descricao: "Frango desfiado temperado com Catupiry original e queijo gratinado.", preco: 34.90, imagem: "./assets/img/batata-frango-catupiry.png" },
    { id: 3, nome: "Batata Calabresa Suprema", descricao: "Calabresa acebolada, mussarela derretida e molho especial da casa.", preco: 33.90, imagem: "./assets/img/batata-calabresa-suprema.png" },
    { id: 4, nome: "Batata Costela Barbecue", descricao: "Costela desfiada ao molho barbecue com cheddar e cebola crispy.", preco: 39.90, imagem: "./assets/img/batata-costela-barbecue.png" },
    { id: 5, nome: "Batata Strogonoff Gourmet", descricao: "Strogonoff cremoso de carne com batata palha e parmesão ralado.", preco: 37.90, imagem: "./assets/img/batata-strogonoff-gourmet.png" },
    { id: 6, nome: "Batata Vegetariana Premium", descricao: "Brócolis, milho, champignon, queijo e molho branco artesanal.", preco: 31.90, imagem: "./assets/img/batata-vegetariana-premium.png" },
    { id: 7, nome: "Batata Camarão Especial", descricao: "Camarões salteados no alho com requeijão cremoso e queijo gratinado.", preco: 44.90, imagem: "./assets/img/batata-camarao-especial.png" },
    { id: 8, nome: "Batata Filé Mignon", descricao: "Cubos de filé mignon ao molho especial com queijo premium gratinado.", preco: 42.90, imagem: "./assets/img/batata-file-mignon.png" }
];

let carrinho = [];

// Elementos DOM
const cardapioContainer = document.getElementById("cardapio");
const modalCarrinho = document.getElementById("modal-carrinho");
const btnVerCarrinho = document.getElementById("btn-ver-carrinho");
const btnFecharModal = document.getElementById("btn-fechar-modal");
const itensCarrinhoContainer = document.getElementById("itens-carrinho");
const totalBarra = document.getElementById("total-barra");
const totalModal = document.getElementById("total-modal");
const contadorCarrinho = document.getElementById("contador-carrinho");
const inputEndereco = document.getElementById("input-endereco");
const avisoEndereco = document.getElementById("aviso-endereco");
const btnFinalizarPedido = document.getElementById("btn-finalizar-pedido");

// ========================================
// INTEGRAÇÃO PIX (Dinâmica)
// ========================================
const CHAVE_PIX = "1db6a81e-038a-4839-8f91-894bd167d418";

const containerPagamento = document.createElement('div');
containerPagamento.className = "border-t pt-3 mb-4";
containerPagamento.innerHTML = `
    <label class="block text-sm font-semibold text-gray-700 mb-1">Forma de Pagamento:</label>
    <select id="forma-pagamento" class="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-2">
        <option value="entrega">Pagamento na Entrega</option>
        <option value="pix">Pix (QR Code)</option>
    </select>
    <div id="area-pix" class="hidden text-center p-3 bg-gray-50 rounded-xl border">
        <p class="text-xs font-bold mb-1">Escaneie o QR Code:</p>
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${CHAVE_PIX}" alt="QR Pix" class="mx-auto w-24 h-24">
        <p class="text-[10px] text-gray-500 mt-1 break-all">Chave Pix: ${CHAVE_PIX}</p>
    </div>
`;
btnFinalizarPedido.parentNode.insertBefore(containerPagamento, btnFinalizarPedido);

document.getElementById('forma-pagamento').addEventListener('change', (e) => {
    document.getElementById('area-pix').classList.toggle('hidden', e.target.value !== 'pix');
});

// Funções de renderização e lógica mantidas...
function renderizarCardapio() {
    cardapioContainer.innerHTML = "";
    produtos.forEach(produto => {
        const card = document.createElement("div");
        card.className = "bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col";
        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}" class="w-full h-56 object-cover">
            <div class="p-5 flex flex-col flex-1">
                <div class="flex-1">
                    <h3 class="font-bold text-xl text-gray-900 mb-2">${produto.nome}</h3>
                    <p class="text-gray-500 text-sm leading-relaxed mb-5">${produto.descricao}</p>
                </div>
                <div class="flex items-center justify-between">
                    <span class="font-bold text-2xl text-orange-600">R$ ${produto.preco.toFixed(2).replace(".", ",")}</span>
                    <button class="btn-add bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow transition-all" data-id="${produto.id}">
                        <i class="fa-solid fa-plus mr-1"></i> Adicionar
                    </button>
                </div>
            </div>`;
        cardapioContainer.appendChild(card);
    });
}

function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    const itemExistente = carrinho.find(item => item.id === id);
    if (itemExistente) itemExistente.quantidade++;
    else carrinho.push({ ...produto, quantidade: 1 });
    atualizarInterface();
}

function atualizarInterface() {
    let total = 0, totalItens = 0;
    carrinho.forEach(item => { total += item.preco * item.quantidade; totalItens += item.quantidade; });
    const totalFormatado = `R$ ${total.toFixed(2).replace(".", ",")}`;
    totalBarra.textContent = totalFormatado;
    totalModal.textContent = totalFormatado;
    contadorCarrinho.textContent = totalItens;
}

btnVerCarrinho.addEventListener("click", () => {
    renderizarCarrinhoModal();
    modalCarrinho.classList.remove("hidden");
});

btnFecharModal.addEventListener("click", () => modalCarrinho.classList.add("hidden"));

function renderizarCarrinhoModal() {
    itensCarrinhoContainer.innerHTML = "";
    if (carrinho.length === 0) {
        itensCarrinhoContainer.innerHTML = `<p class="text-center text-gray-500 py-5">Seu carrinho está vazio.</p>`;
        return;
    }
    carrinho.forEach(item => {
        const div = document.createElement("div");
        div.className = "flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100";
        div.innerHTML = `
            <div class="flex items-center gap-3">
                <img src="${item.imagem}" class="w-16 h-16 rounded-xl object-cover">
                <div>
                    <h4 class="font-bold text-sm text-gray-900">${item.nome}</h4>
                    <span class="text-xs text-gray-500">R$ ${item.preco.toFixed(2).replace(".", ",")}</span>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <button class="btn-diminuir text-red-500 font-bold text-lg" data-id="${item.id}">-</button>
                <span class="font-bold text-sm">${item.quantidade}</span>
                <button class="btn-aumentar text-green-500 font-bold text-lg" data-id="${item.id}">+</button>
            </div>`;
        itensCarrinhoContainer.appendChild(div);
    });
}

itensCarrinhoContainer.addEventListener("click", (e) => {
    const id = parseInt(e.target.dataset.id);
    if (e.target.classList.contains("btn-aumentar")) carrinho.find(i => i.id === id).quantidade++;
    if (e.target.classList.contains("btn-diminuir")) {
        const item = carrinho.find(i => i.id === id);
        if (item.quantidade > 1) item.quantidade--;
        else carrinho = carrinho.filter(i => i.id !== id);
    }
    atualizarInterface();
    renderizarCarrinhoModal();
});

btnFinalizarPedido.addEventListener("click", () => {
    if (carrinho.length === 0) return alert("Seu carrinho está vazio!");
    if (inputEndereco.value.trim() === "") {
        avisoEndereco.classList.remove("hidden");
        return;
    }

    const formaPagamento = document.getElementById('forma-pagamento').value;
    let mensagem = `🍟 *NOVO PEDIDO - BATATA GOURMET* 🍟\n\n`;
    carrinho.forEach(item => mensagem += `• ${item.quantidade}x ${item.nome}\n`);
    const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
    mensagem += `\n💰 *Total:* R$ ${total.toFixed(2)}`;
    mensagem += `\n💳 *Pagamento:* ${formaPagamento === 'pix' ? 'Pix (Chave: ' + CHAVE_PIX + ')' : 'Na Entrega'}`;
    mensagem += `\n📍 *Endereço:* ${inputEndereco.value}`;

    const url = `https://api.whatsapp.com/send?phone=5511976794749&text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
});

renderizarCardapio();
