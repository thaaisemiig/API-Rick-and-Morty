/* <div class="row justify-content-center">

  <div class="col-12 col-md-4 d-flex justify-content-center align-self-center mt-5 mb-5">
    <div class="card border-2 border-success">
      
    <img src="..." class="card-img-top" alt="...">

        <div class="card-body rounded-bottom-1 pb-0">
          <h5 class="card-title mb-0" id="card-nome">Título do card</h5>
          <p class="card-status mb-3" id="card-especie">Vivo-Humano</p>
          <p class="card-localizacao mb-0" id="card-status">Última localização conhecida</p>
          <p class="card-planeta mb-3">Planeta XPTO</p>
          <p class="card-visto mb-0">Visto a última vez em</p>
          <p class="card-capitulo">Nome do capítulo</p>

        </div>
    </div>
  </div> */

const criarCard = async (personaId, personaImagem, personaNome, personaEspecie, personaStatus, personaLocalizacao, personaEpisodio) => {

  const personaCard = document.createElement('div')
  personaCard.className = 'col-12 col-md-4 d-flex justify-content-center align-self-center mt-5 mb-5'

  const estiloCard = document.createElement('div')
  estiloCard.className = 'card border-2 border-success'

  // Imagem
  const img = document.createElement('img')
  img.src = personaImagem
  img.className = 'card-img-top'
  img.alt = personaNome

  // Card
  const card = document.createElement('div')
  card.className = 'card-body rounded-bottom-1 pb-0'

  // Título
  const titulo = document.createElement('h5')
  titulo.className = 'card-title mb-0'
  titulo.textContent = personaNome

  // Status e especie
  const status = document.createElement('p')
  status.className = 'card-status mb-3'
  status.textContent = `${personaStatus} - ${personaEspecie}`

  // Última localização
  const ultimaLocalizacao = document.createElement('p')
  ultimaLocalizacao.className = 'card-localizacao mb-0'
  ultimaLocalizacao.textContent = 'Última localização conhecida'

  // Localização do capítulo
  const localizacao = document.createElement('p')
  localizacao.className = 'card-planeta mb-3'
  localizacao.textContent = personaLocalizacao.name

  // Visto a última vez em
  const visto = document.createElement('p')
  visto.className = 'card-visto mb-0'
  visto.textContent = 'Visto a última vez em:'


  // Nome do capítulo
  const capitulo = document.createElement('p')
  capitulo.className = 'card-capitulo'

  // Busca o nome do último episódio
  try {
    const response = await axios.get(personaEpisodio)
    capitulo.textContent = response.data.name
  } catch (error) {
    console.error('Erro ao buscar dados do episódio:', error)
    capitulo.textContent = 'Erro ao carregar episódio'
  }

  // Cria todos os elementos filhos no card
  card.appendChild(titulo)
  card.appendChild(status)
  card.appendChild(ultimaLocalizacao)
  card.appendChild(localizacao)
  card.appendChild(visto)
  card.appendChild(capitulo)

  // Cria o card e a imagem
  estiloCard.appendChild(img)
  estiloCard.appendChild(card)

  // Cria o card na col
  personaCard.appendChild(estiloCard)

  // Adiciona o evento de clique para abrir o modal
  personaCard.addEventListener('click', async () => {
    try {
      const response = await axios.get(`https://rickandmortyapi.com/api/character/${personaId}`)
      const personagem = response.data

      document.getElementById('modalImg').src = personagem.image
      document.getElementById('modalNome').textContent = personagem.name
      document.getElementById('modalEspecie').textContent = personagem.species
      document.getElementById('modalStatus').textContent = personagem.status
      document.getElementById('modalLocalizacao').textContent = personagem.location.name
      document.getElementById('modalEpisodio').textContent = personagem.episode[personagem.episode.length - 1]
      document.getElementById('modalGenero').textContent = personagem.gender
      document.getElementById('modalOrigem').textContent = personagem.origin.name

      const detalhesModal = new bootstrap.Modal(document.getElementById('detalhesModal'))
      detalhesModal.show();
    } catch (error) {
      console.error('Erro ao buscar dados do personagem:', error)
    }
  })

  return personaCard
}

// Seta os personagens
const setaPersonagens = async (personagens) => {
  const container = document.getElementById("cardsPersonagens")
  container.innerHTML = '' // Limpa o conteúdo anterior antes de adicionar novos cards

  // Limita a exibição aos primeiros 9 personagens (3 linhas de 3 cards cada)
  const personagensLimitados = personagens.slice(0, 9)

  for (const personagem of personagensLimitados) {
    const card = await criarCard(
      personagem.id,
      personagem.image,
      personagem.name,
      personagem.species,
      personagem.status,
      personagem.location,
      personagem.episode[personagem.episode.length - 1]
    )

    container.appendChild(card)
  }
};

// Buscar Dados
const api = axios.create({
  baseURL: 'https://rickandmortyapi.com/api/character',
})

const dadosCharacter = async (pagina) => {
  try {
    const response = await api.get(`?page=${pagina}`)
    const data = response.data
    return data
  } catch (error) {
    console.error('Erro ao buscar dados da API:', error)
  }
}

// Atualizar página
let paginaAtual = 1

const atualizaPagina = async () => {
  const data = await dadosCharacter(paginaAtual)
  await setaPersonagens(data.results)

  document.getElementById('prev-btn').disabled = paginaAtual === 1
  document.getElementById('next-btn').disabled = !data.info.next
};

document.getElementById('prev-btn').addEventListener('click', () => {
  if (paginaAtual > 1) {
    paginaAtual--
    atualizaPagina()
  }
})

document.getElementById('next-btn').addEventListener('click', () => {
  paginaAtual++
  atualizaPagina()
})

atualizaPagina()

//Footer
const atualizarTotaisFooter = (totalPersonagens, totalEpisodios, totalLocalizacoes) => {
  document.getElementById('total-personagens').textContent = totalPersonagens
  document.getElementById('total-episodios').textContent = totalEpisodios
  document.getElementById('total-localizacoes').textContent = totalLocalizacoes
};

const buscarTotais = async () => {
  try {
    const personagensResponse = await axios.get('https://rickandmortyapi.com/api/character')
    const totalPersonagens = personagensResponse.data.info.count

    const episodiosResponse = await axios.get('https://rickandmortyapi.com/api/episode')
    const totalEpisodios = episodiosResponse.data.info.count

    const localizacoesResponse = await axios.get('https://rickandmortyapi.com/api/location')
    const totalLocalizacoes = localizacoesResponse.data.info.count

    atualizarTotaisFooter(totalPersonagens, totalEpisodios, totalLocalizacoes)
  } catch (error) {
    console.error('Erro ao buscar totais da API:', error)
  }
}

document.addEventListener('DOMContentLoaded', buscarTotais)
