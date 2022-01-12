class JogoDaMemoria{
// se mandar um objeto = {tela:1, idade: 2, etc:3}, constructor irá ignorar todo o resto e focar apenas a propriedade dela
        constructor({tela, util}){
            this.tela=tela
            this.util = util
            this.heroisIniciais = [
                {img: './arquivos/batman.png', nome:'batman'},
                {img: './arquivos/wonder-woman.png', nome:'wonder-woman'},
                {img: './arquivos/wolverine.png', nome:'wolverine'},
                {img: './arquivos/cyclope.png', nome:'cyclope'}
            ]

            this.iconePadrao = './arquivos/interrogation.png'
            this.heroisEscondidos=[]
            this.heroisSelecionados=[]
        }
        
        //não podemos usar o static para poder usar o this
inicializar(){
    //coloca todos os herois na tela
    this.tela.atualizarImagens(this.heroisIniciais)
    // força a tela a usar o this desta tela
    this.tela.configurarBotaoJogar(this.jogar.bind(this))
    this.tela.configurarBotaoVerificarSelecao(this.verificarSelecao.bind(this))
    this.tela.configurarBotaoMostrarTudo(this.mostrarHeroisEscondidos.bind(this))
}

async embaralhar(){
    const copias = this.heroisIniciais
    .concat(this.heroisIniciais) // copiar os herois
    // .map irá embaralhar as imagens randomicamente com o Math.random()
    .map(item => {
        return Object.assign({}, item, {id: Math.random() / 0.5})
    })
    
    // ordernar aleatoriamente
    .sort(() => Math.random()-0.5)

    this.tela.atualizarImagens(copias)
    this.tela.exibirCarregando()
    
    const idDoIntervalo = this.tela.iniciarContador()
    //esperar 1 segundo para atualizar a tela
    await this.util.timeout(3000)
    this.tela.limparContador(idDoIntervalo)
    this.esconderHerois(copias)
    this.tela.exibirCarregando(false)
    ;
}

esconderHerois(herois){
    //vai trocar as imagens dos herois existentes pela interrogação
    const heroisOcultos = herois.map(( { nome, id }) =>({
        id,
        nome,
        img: this.iconePadrao
    }) )
    this.tela.atualizarImagens(heroisOcultos)
    // guardamos os herois para saber se eles estão certos ou não
    this.heroisEscondidos= heroisOcultos

}
exibirHerois(nomeDoHeroi){
    //obter apenas imagem
    const {img} = this.heroisIniciais.find(({nome}) => nomeDoHeroi === nome)
    this.tela.exibirHerois(nomeDoHeroi, img)  
}
verificarSelecao(id, nome){ // verificar a qnt de herois selecionados e ver se deu certo ou errado
    const item = {id, nome}
    const heroisSelecionados = this.heroisSelecionados.length
    switch(heroisSelecionados) {
        case 0: 
            this.heroisSelecionados.push(item)
            break;
        case 1: 
            const [ opcao1 ] = this.heroisSelecionados
            // zerar itens, para nao selecionar mais de dois
            this.heroisSelecionados = []
            
            if(opcao1.nome === item.nome && opcao1.id !== item.id) {
                this.exibirHerois(item.nome)
                // como padrão é true, não precisa passar nada
                this.tela.exibirMensagem()
                
                
                return;
            }
            this.tela.exibirMensagem(false)

            break;
    }
}

mostrarHeroisEscondidos(){
    const heroisEscondidos = this.heroisEscondidos
    for (const heroi of heroisEscondidos){
        const {img} = this.heroisIniciais.find(item => item.nome === heroi.nome)
        heroi.img = img
    }

    this.tela.atualizarImagens(heroisEscondidos)
}

jogar() {
        this.embaralhar()
}

}
