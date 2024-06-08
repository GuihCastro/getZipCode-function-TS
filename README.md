# getZipCode

Este repositório contém a função `getZipCode`, que rastreia o código postal (CEP) com base nas coordenadas geográficas fornecidas (latitude e longitude). A função utiliza a API de geocodificação do Google Maps para buscar e extrair o CEP.

## Índice

- [Recursos](#recursos)
- [Instalação](#instalação)
- [Uso](#uso)
- [Testes](#testes)
- [Contribuição](#contribuição)

## Recursos

- Busca o código postal com base na latitude e longitude.
- Trata erros de forma adequada e fornece mensagens de erro significativas.
- Inclui uma cobertura abrangente de testes para todas as utilidades e a função principal.

## Instalação

Para usar esta função, você precisa ter Node.js e npm instalados. Siga os passos abaixo para configurar o projeto:

1. Clone o repositório:
    ```sh
    git clone https://github.com/seuusuario/getZipCode.git
    cd getZipCode
    ```

2. Instale as dependências:
    ```sh
    npm install
    ```

## Uso

Para usar a função `getZipCode` em seu projeto, siga estes passos:

1. Certifique-se de ter uma chave da API do Google Maps. Substitua `YOUR_GOOGLE_MAPS_API_KEY` no código pela sua chave real.

2. Importe a função `getZipCode` e use-a com os valores apropriados de latitude e longitude:

    ```typescript
    import getZipCode from './getZipCode';

    (async () => {
        try {
            const zipCode = await getZipCode(-23.5489, -46.6388); // Coordenadas para São Paulo, SP, Brasil
            console.log('CEP:', zipCode); // Saída esperada: 'CEP: 01007040'
        } catch (error) {
            console.error(error.message);
        }
    })();
    ```

### Detalhes da Implementação

- Função `getZipCode`:
    ```typescript
    import { constructGeocodingURL, fetchGeocodingData, extractZipCode } from './services/geocodingAPI';

    /**
     * Retorna o código postal (CEP) com base nas coordenadas (latitude e longitude) recebidas.
     *
     * @param {number} latitude - A coordenada de latitude.
     * @param {number} longitude - A coordenada de longitude.
     * @returns {Promise<string | null>} - O CEP rastreado a partir das coordenadas.
     */
    async function getZipCode(latitude: number, longitude: number): Promise<string | null> {
        const url = constructGeocodingURL(latitude, longitude);

        try {
            const results = await fetchGeocodingData(url);
            return extractZipCode(results);
        } catch (error) {
            console.error('Erro ao buscar o CEP:', error);
            throw new Error('Não foi possível recuperar o CEP.');
        }
    }

    export default getZipCode;
    ```

- `geocodingAPI.ts`:
    Este arquivo contém as funções auxiliares para construir a URL de geocodificação, buscar os dados de geocodificação e extrair o CEP.

## Testes

Este repositório inclui um conjunto de testes unitários para garantir a funcionalidade da função `getZipCode` e suas utilidades auxiliares. Os testes são escritos usando Jest e podem ser encontrados no arquivo `getZipCode.test.ts`.

Para executar os testes, execute o seguinte comando:

```sh
npm test
```

## Contribuição
O código foi feito principalmente para fins de estudo, e contribuições são sempre bem-vindas! 
Por favor, siga estes passos para contribuir:

Faça um fork do repositório.
Crie uma nova branch para sua funcionalidade ou correção de bug.
Faça commit das suas alterações.
Faça push da sua branch e crie um pull request.