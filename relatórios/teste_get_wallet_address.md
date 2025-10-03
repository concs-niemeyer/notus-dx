## Sessão de Teste - Get Wallet Address (*Next.js*)

**1. Qual é o objetivo desta sessão?**

Verificar a chamada ao endpoint `{{base_url}}/api/v1/wallets/address` a partir da aplicação Next.js para obter o endereço de uma smart wallet e confirmar se a resposta é processada corretamente.

---

**2. Qual abordagem você vai usar?**

Interagir com a aplicação Next.js, que, em cenários de fallback durante o registro da carteira, dispara uma requisição GET para `{{base_url}}/api/v1/wallets/address` com os parâmetros `externallyOwnedAccount`, `factory` e `salt`.

---

**3. Há algo que precisa ser configurado antes de começar?**
- A aplicação Next.js deve estar em execução.
- As variáveis de ambiente (`NEXT_PUBLIC_NOTUS_API_KEY`) devem estar configuradas corretamente.
- A lógica da aplicação deve ser acionada para realizar a chamada (neste caso, um fallback do registro de carteira).

---

**4. Você conseguiu atingir o objetivo da sessão?**

* [ x ] Sim
* [ ] Não. Se **não**, explique o que impediu.

---

**5. Problemas encontrados**

Nenhum

---

**6. Observações adicionais**
A ser preenchido.
