## Sessão de Teste - Get Liquidity Amounts (*Next.js*)

**1. Qual é o objetivo desta sessão?**

Testar o cálculo de valores para adicionar liquidez, utilizando o endpoint `{{base_url}}/api/v1/liquidity/amounts`, que é consumido pelo componente `LiquidityPools` no Next.js.

---

**2. Qual abordagem você vai usar?**

Preencher os dados de configuração de liquidez (tokens, valores máximos, faixa de preço) na aplicação Next.js e acionar a função "Calculate Amounts". A aplicação então fará uma requisição GET para o endpoint com os parâmetros necessários.

---

**3. Há algo que precisa ser configurado antes de começar?**
- A aplicação Next.js deve estar em execução com um usuário logado.
- Os endereços `accountAbstraction` e `externallyOwnedAccount` devem estar disponíveis no estado do componente.
- A variável de ambiente `NEXT_PUBLIC_NOTUS_API_KEY` deve estar configurada.
- Os campos do formulário de liquidez devem ser preenchidos.

---

**4. Você conseguiu atingir o objetivo da sessão?**

* [ X ] Sim
* [   ] Não. Se **não**, explique o que impediu.

---

**5. Problemas encontrados**

Nenhum

---

**6. Observações adicionais**
Os valores retornados por este endpoint são usados para popular os campos `token0Amount` e `token1Amount`, que são pré-requisitos para a chamada de `POST /liquidity/create`.
