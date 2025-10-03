## Sessão de Teste - Get Wallet History (*Next.js*)

**1. Qual é o objetivo desta sessão?**
Testar a busca do histórico de transações de uma smart wallet através do endpoint `{{base_url}}/api/v1/wallets/{accountAbstraction}/history`, consumido pelo componente `TransactionHistory` no Next.js.

---

**2. Qual abordagem você vai usar?**
Utilizar o componente `TransactionHistory` na aplicação Next.js, que efetua uma requisição GET para o endpoint, passando o endereço da `accountAbstraction` na URL e outros filtros como query params.

---

**3. Há algo que precisa ser configurado antes de começar?**
- A aplicação Next.js deve estar em execução com um usuário logado.
- O endereço da `accountAbstraction` deve estar disponível no estado do componente.
- As variáveis de ambiente (`NEXT_PUBLIC_NOTUS_API_KEY`) devem estar configuradas.

---

**4. Você conseguiu atingir o objetivo da sessão?**

* [ ] Sim
* [x] Não. Se **não**, explique o que impediu.

Extrapolei o limite da API tentando resolve o problema de 'looping' nas chamadas.

---

**5. Problemas encontrados**

Nenhum problema na chamada da API.

---

**6. Observações adicionais**
O código-fonte do componente `TransactionHistory` indica um bug de loop de requisições que precisa ser investigado.
