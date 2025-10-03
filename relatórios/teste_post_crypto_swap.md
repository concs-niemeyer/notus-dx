## Sessão de Teste - Post Crypto Swap (*Next.js*)

**1. Qual é o objetivo desta sessão?**

Testar a obtenção de uma cotação de swap de tokens através do endpoint `{{base_url}}/api/v1/crypto/swap`, consumido pelo componente `Swap` no Next.js.

---

**2. Qual abordagem você vai usar?**

Preencher e enviar o formulário de swap na aplicação Next.js. A aplicação então montará e enviará uma requisição POST para o endpoint com os detalhes da troca (tokens, valor, endereços, etc.).

---

**3. Há algo que precisa ser configurado antes de começar?**
- A aplicação Next.js deve estar em execução com um usuário logado.
- Os endereços `accountAbstraction` e `externallyOwnedAccount` devem estar disponíveis no estado do componente.
- A variável de ambiente `NEXT_PUBLIC_NOTUS_API_KEY` deve estar configurada.
- Os campos do formulário (token de origem, token de destino, quantidade) devem ser preenchidos.

---

**4. Você conseguiu atingir o objetivo da sessão?**

* [ x ] Sim
* [ ] Não. Se **não**, explique o que impediu.

---

**5. Problemas encontrados**

Nenhum.

---

**6. Observações adicionais**
A resposta deste endpoint (`quoteId`) é usada subsequentemente na chamada para `/crypto/execute-user-op` para assinar e executar a transação.
