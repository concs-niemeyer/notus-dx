## Sessão de Teste - List Tokens (*Postman*)

**1. Qual é o objetivo desta sessão?**

Testar o endpoint `{{base_url}}/api/v1/crypto/tokens` para listar os tokens da whitelist e verificar se a resposta está de acordo com a documentação.

---

**2. Qual abordagem você vai usar?**

Realizar uma requisição GET com o Postman para `{{base_url}}/api/v1/crypto/tokens`, enviando o `x-api-key` no cabeçalho.

---

**3. Há algo que precisa ser configurado antes de começar?**
- Tokens de interesse selecionados na `Whitelist` do dashboard Notus Team.
- Variável de ambiente `base_url` definida como `https://api.notus.team`.
- Header `x-api-key` definido com a chave da API do projeto Notus.

---

**4. Você conseguiu atingir o objetivo da sessão?**

* [X] Sim
* [ ] Não. Se **não**, explique o que impediu.

---

**5. Problemas encontrados**

Nenhum.

---

**6. Observações adicionais**
- Status: 200 OK
- Tempo de resposta: 847 ms