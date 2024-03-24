# Pairfy marketplace

Pairfy is an e-commerce protocol that uses smart contracts for the process of selling and buying physical products on Cardano using the ADA cryptocurrency.

### Introduction

Pairfy aims to allow the community to sell physical products and be purchased with ADA by the same community using a **plutus** P2P exchange system based on blind mediators and trust rating.

In a successful P2P negotiation the seller delivers the product and the buyer pays the price of the product in this case the trade ends naturally. The problem arises when one of the participants does not fulfill their obligations such as when the seller does not deliver the product but argues that he does. Using physical blockchain infrastructure, i.e. hardware connected to oracles it is possible to determine if the product was actually delivered. The problem with this is that many shipping companies do not have blockchain infrastructure so humans inevitably participate throughout the product delivery process.

Connecting the blockchain to the real world is an expensive challenge at least for trading physical products. Shipping companies would have to connect their vehicles to supervised oracles and the products must have an infallible tracker to check if were delivered. A lot of infrastructure deployed around the world is necessary to achieve a fully decentralized e-commerce protocol. Clearly this represents a very difficult challenge to achieve in contrast to another option which is to use the human brain as a source of truth. With the right conditions the human brain can make logical reasoning about facts or propositions to declare a truth as happens in the legal or scientific area (Peer review).

The peer review system in the academic world allows a research paper to be reviewed by randomly assigned experts. A blind reviewer does not know who is the author of the paper he is reviewing and the author also does not know who the reviewers are. The system maintains confidentiality to prevent biases ensuring an impartial assessment. The system acts as a quality control mechanism identifying errors and providing arguments based on scientific knowledge to ensure the greatest precision and reliability of the research paper.

A system of blind reviewers trained in conflict resolution can decide on a disputed negotiation session in the event that the buyer or seller defaults on their obligations or another problem arises that does not allow the natural conclusion of the negotiation session.

### Features

| Feature      | yes | Description                                          |
| ------------ | --- | ---------------------------------------------------- |
| P2P          | ✓   | Cardano  preview-testnet, testnet, mainnet           |
| E2E          | ✓   | Signing and sending transactions only in the browser |
| Multi-wallet | ✓   | Nami                                                 |
| PAB          | ✓   | Does not depend on third-party tools                 |

### Stack

| Stack    | Type      | Description                  | Keywords                     | Version | Licence            | Repository                                                         |
| -------- | --------- | ---------------------------- | ---------------------------- | ------- | ------------------ | ------------------------------------------------------------------ |
| mysql    | database  | cloud-native database        | sharding                     | 8.0     | GPL license        | [https://www.mysql.com/downloads](https://www.mysql.com/downloads) |
| Debezium | cdc       | database change data capture | cdc, kafka, stream, sync     | 2.5     | Apache Version 2.0 | [https://github.com/debezium](https://github.com/debezium)         |
| Kafka    | streaming | event streaming              | high-throughput, low-latency | 3.6.1   | Apache Version 2.0 | [https://github.com/apache/kafka](https://github.com/apache/kafka) |
| Node.js  | runtime   | javascript runtime           | code, javascript             | alpine  | MIT                | [https://github.com/nodejs/node](https://github.com/nodejs/node)   |

### P2P trading and Mediator Pool Scalability

Peer-to-Peer cryptocurrency exchange services such as localbitcoins or binance P2P have proven to be systems that work for secure trades. These systems are based on trust rating and involve real-world action on the part of the buyer such as making a transaction to the bank account provided by the seller. In Binance P2P, disputes between buyers and sellers can be addressed through an appeal process. Common reasons for initiating an appeal involves problems with payment confirmation, disagreements over payment quality, or disputes regarding trade terms. To protect the cryptocurrency involved in the trade an escrow system locks the funds.

Both the buyer and seller are afforded the opportunity to present evidence or explanations supporting their case during the appeal. A mediation team at Binance reviews the appeal carefully considering the evidence and arguments put forth by both parties. Subsequently, Binance reaches a decision which may involve upholding the original trade agreement, releasing funds from escrow to the appropriate party, or taking other actions based on the specific circumstances of the dispute.

[BINANCE ACTIVE USERS](https://www.binance.com/en/feed/post/2023-12-28-binance-ends-2023-with-30-user-growth-committed-to-compliance-and-web3-products-1989369934178) At the end of 2023, Binance reached approximately 170M+ registered users. A large percentage of users carry out P2P negotiations using bank accounts and physical world payment methods. Binance has demonstrated that the Peer-to-Peer exchange system with appeal mechanism is effective and scalable.

## Table Of Content

[Installation](#installation)

[Documentation](#documentation)

[License](#license)

[Links](#links)

### 1\. Requeriments

Install kubernetes local cluster

- with docker-desktop [https://docs.docker.com/desktop/install/linux-install/](https://docs.docker.com/desktop/install/linux-install/)
- or minikube [https://minikube.sigs.k8s.io/docs/start/](https://minikube.sigs.k8s.io/docs/start/)

Clone this repository

```
git clone https://github.com/pairfy/marketplace.git
```

Install skaffold dev

```
https://skaffold.dev/docs/install
```

Install kubectl

```
https://kubernetes.io/docs/tasks/tools/install-kubectl-linux
```

### 2\. Installation

Command

```
skaffold dev
```
