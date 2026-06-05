document.addEventListener("DOMContentLoaded", () => {
    // ========================================
    // DADOS E VARIÁVEIS
    // ========================================
    const produtos = [
        { id: 1, nome: "Batata Cheddar Bacon", descricao: "Batata recheada com cheddar cremoso, bacon crocante e cebolinha fresca.", preco: 32.90, imagem: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?q=80&w=1200" },
        { id: 2, nome: "Batata Frango Catupiry", descricao: "Frango desfiado temperado com Catupiry original e queijo gratinado.", preco: 34.90, imagem: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?q=80&w=1200" },
        // ... (adicione as outras imagens aqui)
    ];

    let carrinho = [];
    const CHAVE_PIX = "1db6a81e-038a-4839-8f91-894bd167d418";

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
    const btnFinalizarPedido = document.getElementById("btn-finalizar-pedido");

    // ========================================
    // INJEÇÃO DA OPÇÃO PIX
    // ========================================
    const containerPagamento = document.createElement('div');
    containerPagamento.className = "border-t pt-3 mb-4";
    containerPagamento.innerHTML = `
        <label class="block text-sm font-semibold text-gray-700 mb-1">Forma de Pagamento:</label>
        <select id="forma-pagamento" class="w-full border rounded-xl px-3 py-2 text-sm mb-2">
            <option value="entrega">Pagamento na Entrega</option>
            <option value="pix">Pix (QR Code)</option>
        </select>
        <div id="area-pix" class="hidden text-center p-3 bg-gray-50 rounded-xl border">
            <p class="text-xs font-bold mb-1">Escaneie o QR Code:</p>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${CHAVE_PIX}" class="mx-auto w-24 h-24">
            <p class="text-[10px] text-gray-500 mt-1 break-all">Chave: ${CHAVE_PIX}</p>
        </div>
    `;
    btnFinalizarPedido.parentNode.insertBefore(containerPagamento, btnFinalizarPedido);

    document.getElementById('forma-pagamento').addEventListener('change', (e) => {
        document.getElementById('area-pix').classList.toggle('hidden', e.target.value !== 'pix');
    });

    // ========================================
    // LÓGICA DO CARRINHO
    // ========================================
    function atualizarInterface() {
        let total = 0, totalItens = 0;
        carrinho.forEach(item => { total += item.preco * item.quantidade; totalItens += item.quantidade; });
        const totalFormatado = `R$ ${total.toFixed(2).replace(".", ",")}`;
        totalBarra.textContent = totalFormatado;
        totalModal.textContent = totalFormatado;
        contadorCarrinho.textContent = totalItens;
    }

    function renderizarCardapio() {
        cardapioContainer.innerHTML = produtos.map(p => `
            <div class="bg-white rounded-2xl p-4 shadow border flex flex-col">
                <h3 class="font-bold text-lg">${p.nome}</h3>
                <p class="text-sm text-gray-500 flex-1">${p.descricao}</p>
                <div class="flex justify-between items-center mt-4">
                    <span class="font-bold text-orange-600">R$ ${p.preco.toFixed(2).replace(".", ",")}</span>
                    <button class="btn-add bg-orange-500 text-white px-3 py-1 rounded-lg" data-id="${p.id}">Adicionar</button>
                </div>
            </div>
        `).join('');
    }

    // Delegacao de eventos para botões dinâmicos
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-add')) {
            const id = parseInt(e.target.dataset.id);
            const prod = produtos.find(p => p.id === id);
            const existe = carrinho.find(i => i.id === id);
            existe ? existe.quantidade++ : carrinho.push({...prod, quantidade: 1});
            atualizarInterface();
        }
    });

    btnVerCarrinho.addEventListener("click", () => modalCarrinho.classList.remove("hidden"));
    btnFecharModal.addEventListener("click", () => modalCarrinho.classList.add("hidden"));

    btnFinalizarPedido.addEventListener("click", () => {
        if (carrinho.length === 0) return alert("Carrinho vazio!");
        if (!inputEndereco.value) return alert("Informe o endereço!");
        
        const forma = document.getElementById('forma-pagamento').value;
        const msg = `Pedido: ${carrinho.map(i => i.nome).join(', ')}. Pagamento: ${forma}. Endereço: ${inputEndereco.value}`;
        window.open(`https://wa.me/5511976794749?text=${encodeURIComponent(msg)}`, "_blank");
    });

    renderizarCardapio();
});
