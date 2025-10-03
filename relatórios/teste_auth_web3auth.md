## Relatório de Funcionalidade - Autenticação com Web3Auth (*Next.js*)

**1. Qual é o objetivo desta funcionalidade?**

Implementar um fluxo de autenticação de usuário utilizando o SDK do Web3Auth. O processo deve permitir que o usuário faça login, obtenha seu endereço de carteira (EOA) e, subsequentemente, crie ou recupere uma Smart Wallet (Account Abstraction) associada via API Notus.

---

**2. Qual foi a abordagem utilizada?**

A lógica foi centralizada no componente `ConnectWallet.tsx` na aplicação Next.js e dividida em 4 etapas:

1.  **Inicialização:** Ao carregar o componente, o SDK do Web3Auth é inicializado. Se uma sessão ativa for encontrada, o usuário é automaticamente logado.
2.  **Login:** O usuário clica em "Connect Wallet", acionando o modal do Web3Auth para autenticação. Após o sucesso, a aplicação obtém o EOA (Externally Owned Account) do usuário.
3.  **Obtenção da Smart Wallet:** Com o EOA do usuário, a aplicação consulta a API Notus (`GET /wallets`) para verificar se uma Smart Wallet já existe. Se não, uma nova é registrada (`POST /wallets/register`). O endereço da Smart Wallet é então armazenado no estado da aplicação.
4.  **Logout:** O usuário pode encerrar sua sessão, o que limpa os dados de autenticação do estado da aplicação e do Web3Auth.

---

**3. Quais configurações foram necessárias?**
- Instalação dos pacotes `@web3auth/modal` e `viem`.
- Configuração do `Web3Auth` com um `clientId` e a rede (`SAPPHIRE_MAINNET`).
- O `clientId` é fornecido através da variável de ambiente `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID`.
- A API Key da Notus é fornecida via `NEXT_PUBLIC_NOTUS_API_KEY`.

---

**4. A funcionalidade foi implementada com sucesso?**

* [X] Sim
* [ ] Não. Se **não**, explique o que impediu.

---

**5. Problemas encontrados**

Seguindo a documentação encontrei essa mensagem de erro:

        Property 'currentChain' is missing in type 'EthereumPrivateKeyProvider' but required in type 
        'IBaseProvider<string>'.ts(2741) 
        interfaces.d.ts(40, 5): 'currentChain' is declared here. 
        IWeb3Auth.d.ts(111, 5): The expected type comes from property 'privateKeyProvider' which is declared here on type 'Web3AuthOptions'

Resolvi o erro criando outro provider com a documentação do **Web3Auth**

---

**6. Observações adicionais**
- O componente gerencia o estado de login (`loggedIn`), o EOA (`externallyOwnedAccount`) e o endereço da Smart Wallet (`accountAbstraction`).
- O endereço da Smart Wallet é crucial e é passado como propriedade para outros componentes que realizam transações (`Portfolio`, `Swap`, etc.).
