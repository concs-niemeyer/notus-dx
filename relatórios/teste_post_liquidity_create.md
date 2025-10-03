## Sessão de Teste - Post Liquidity Create (*Next.js*)

**1. Qual é o objetivo desta sessão?**

Testar a criação de uma operação para adicionar liquidez a um pool, utilizando o endpoint `{{base_url}}/api/v1/liquidity/create`, consumido pelo componente `LiquidityPools` no Next.js.

---

**2. Qual abordagem você vai usar?**

Após calcular os valores dos tokens, acionar a função "Create Liquidity Position" na aplicação. A aplicação então enviará uma requisição POST para o endpoint com todos os parâmetros da posição de liquidez.

---

**3. Há algo que precisa ser configurado antes de começar?**
- A aplicação Next.js deve estar em execução com um usuário logado.
- Os valores de `token0Amount` e `token1Amount` devem ter sido calculados previamente pela chamada ao endpoint `/liquidity/amounts`.
- Os endereços `accountAbstraction` e `externallyOwnedAccount` devem estar disponíveis.
- A variável de ambiente `NEXT_PUBLIC_NOTUS_API_KEY` deve estar configurada.

---

**4. Você conseguiu atingir o objetivo da sessão?**

* [ ] Sim
* [x] Não. Se **não**, explique o que impediu.

Utilizei todo o limite da API tentando resolver um bug em outro endpoint e não consegui executar a transação final.

---

**5. Problemas encontrados**

Nenhum.

---

**6. Observações adicionais**
A resposta deste endpoint (`userOperationHash`) é usada na chamada para `/crypto/execute-user-op` para assinar e executar a transação de adição de liquidez.
