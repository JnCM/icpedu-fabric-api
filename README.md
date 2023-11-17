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
- MongoDB 7.0.3;

---

## Notas importantes

Este projeto não possui os passos de instalação e execução da rede de teste da Hyperledger Fabric. Mais informações: [Hyperledger Fabric Docs](https://hyperledger-fabric.readthedocs.io/en/latest/index.html).

Este projeto é apenas para fins de comprovação e estudo das tecnologias. Em nenhum momento esta versão deve ser utilizada em produção, a menos que seja alterada de acordo com as devidas diretrizes de segurança.

Antes de executar o projeto, lembre-se de adaptar as variáveis de ambiente (arquivo localizado em `common/config/env.config.js`) de acordo com as suas configurações da rede. Lembre-se também de colocar na pasta `./fabric-credentials` as credenciais necessárias dos peers e usuários participantes da rede, seguindo a mesma estrutura do diretório, ou então adapte o arquivo `fabric.connect.js` de acordo com a sua necessidade.

O pacote do chaincode utilizado neste projeto pode ser consultado [aqui]().

## Execução

Para testar a integração entre a API REST e a Blockchain Hyperledger Fabric, basta utilizar os seguintes comandos:

```bash
docker-compose build
```

```bash
docker-compose up
```

- O banco de dados MongoDB executará utilizando a porta `27017`;
- A API REST executará utilizando a porta `3000`.

---

## Documentação

Clique [aqui](https://documenter.getpostman.com/view/16678749/2s9YXpVyxJ) para acessar a documentação da API e obter mais informações sobre as requisições.