# Prova de conceito - ICPEdu

Prova de conceito para o sistema ICPEdu, de criação de certificados digitais. Integração entre API REST em NodeJS e a Blockchain privada Hyperledger Fabric.

---

## Versões utilizadas

- Windows 11 Pro 23H2;
- Linux Ubuntu 22.04.6 LTS (WSL);
- Docker 23.0.1;
- Docker Desktop 24.0.5;
- NodeJS 20.9.0;
- Hyperledger Fabric 2.5.4;

---

## Notas importantes

Este projeto não possui os passos de instalação e execução da rede de teste da Hyperledger Fabric. Mais informações: [Hyperledger Fabric Docs](https://hyperledger-fabric.readthedocs.io/en/latest/index.html).

Este projeto é apenas para fins de comprovação e estudo das tecnologias. Em nenhum momento esta versão deve ser utilizada em produção, a menos que seja alterada de acordo com as devidas diretrizes de segurança.

Antes de executar o projeto, lembre-se de adaptar as variáveis de ambiente (arquivo `.env`) de acordo com as suas configurações da rede. Lembre-se também de colocar na pasta `./fabric-credentials` as credenciais necessárias dos peers e usuários participantes da rede, seguindo a mesma estrutura do diretório presente no repositório, ou então adapte o arquivo `fabric.connect.js` de acordo com a sua necessidade.

Modelo do arquivo `.env` que deve estar contido na pasta raiz do repositório:

```env
PORT=3000 # Porta do endpoint da API REST
SECRET_KEY=... # Chave secreta para validar o acesso às requisições
CHANNEL_NAME=... # Nome do canal da Blockchain
CHAINCODE_NAME=... # Nome do chaincode implantado na Blockchain
MSP_ID=... # ID MSP da organização na Blockchain
PEER_ENDPOINT=... # Endpoint do Peer da Blockchain
PEER_HOST_ALIAS=... # Alias do Peer da Blockchain
KEYSTORE_PATH=... # Path para o arquivo .pem da keystore da organização
SIGNCERT_PATH=... # Path para o arquivo .pem do signcert da organização
PEERTLSCERT_PATH=... # Path para o arquivo .pem do tls-cert do peer da rede
```

O pacote do chaincode utilizado neste projeto pode ser consultado [aqui](https://github.com/JnCM/icpedu).

## Execução

Para testar a integração entre a API REST e a Blockchain Hyperledger Fabric, basta utilizar os seguintes comandos (Necessário docker instalado):

```bash
docker-compose up -d --build
```

Ou se preferir não utilizar docker (deve possuir as versões das tecnologias utilizadas instaladas), basta utilizar o seguinte comando:

```bash
npm start
```

- A API REST executará utilizando a porta `3000`.

---

## Documentação

Clique [aqui](https://documenter.getpostman.com/view/16678749/2s9YXpVyxJ) para acessar a documentação da API e obter mais informações sobre as requisições.