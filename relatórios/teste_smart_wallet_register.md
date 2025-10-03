## Sessão de Teste - Register Wallet (*Postman* & *Next.js*)

**1. Qual é o objetivo desta sessão?**

Registrar o endereço de uma Smart Wallet (ERC-4337) usando uma Externally Owned Account (EOA) como signatário inicial.

---

**2. Qual abordagem você vai usar?**

Utilizar o Postman para  fazer uma chamada `POST` ao endpoint de registro de carteiras.

---

**3. Há algo que precisa ser configurado antes de começar?**

- Definir o endereço da sua **EOA** (sua  carteira de chave privada, por exemplo metamask, base wallet, etc).
- Definir o endereço do `FACTORY_ADDRESS`.  (LightAccount: 0x0000000000400CdFef5E2714E63d8040b700BC24).
- Payload **JSON** para o `POST` `/wallets/register`:

      
      {
        "externallyOwnedAccount": "0xc4ad20cb81d8f8fc1f109edfdc7bd01b283c7475",
        "factory": "0x0000000000400CdFef5E2714E63d8040b700BC24",
        "salt": "12345"
      }
- Endpoint: `{{base_url}}/wallets/register`

---

**4. Você conseguiu atingir o objetivo da sessão?**

* [X] Sim
* [ ] Não. Se **não**, explique o que impediu.

---

**5. Problemas encontrados**

Nenhum

---

**6. Observações adicionais**
* Status: 201 CREATED
* Tempo de resposta: 861 ms
* Carteira criada apenas como teste e outros valores de "salt" também foram testados.
* *Account Abstraction* devidamente implementada e testada no dApp.