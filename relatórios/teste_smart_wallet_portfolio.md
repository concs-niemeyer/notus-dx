## Sessão de Teste - Portfolio (*Postman* & *Next.js*)


**1. Qual é o objetivo desta sessão?**

Obter o portfólio completo da Smart Wallet, incluindo saldos de diferentes tokens.

---

**2. Qual abordagem você vai usar?**

Usar o Postman para fazer uma chamada *GET* para `/api/v1/wallets/{walletAddress}/portfolio` passando o endereço da **Smart Wallet**.

---

**3. Há algo que precisa ser configurado antes de começar?**
- Endereço da **Smart Wallet** como `Path Variables` no Postman.
- **Endpoint**: `{{base_url}}/api/v1/wallets/:walletAddress/portfolio` (GET).

---

**4. Você conseguiu atingir o objetivo da sessão?**

* [X] Sim
* [ ] Não. Se **não**, explique o que impediu.

---

**5. Problemas encontrados**

Nenhum

---

**6. Observações adicionais**
* Status:   200 OK
* Tempo de resposta:    1.46 s
* Rota  implementada e devidamente testada no dApp.