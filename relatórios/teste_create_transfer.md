## Sessão de Teste - *Transfer* (*Postman & Next.js*)


**1. Qual é o objetivo desta sessão?**

Gerar uma **quoteId** de transferência de token `/api/v1/crypto/transfer`.

---

**2. Qual abordagem você vai usar?**
* Com o Postman vou fazer uma chamada `POST` para `/api/v1/crypto/transfer`para obter o **quoteId**.

---

**3. Há algo que precisa ser configurado antes de começar?**
- Endereço da **Smart Wallet** (smartWalletAddress) obtido na sessão teste03.
- Um token ERC-20 (USDC Polygon) para pagar as taxas (payGasFeeToken) – este token deve estar na Smart Wallet
- **Endpoint de Cotação (Quote)**: `{{base_url}}/api/v1/crypto/transfer` (POST).
- **Payload**:

        {
          "amount": "0.3",
          "chainId": 137, // Polygon
          "gasFeePaymentMethod": "DEDUCT_FROM_AMOUNT"
          "payGasFeeToken": "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", // USDC Polygon
          "token": "0xb33eaad8d922b1083446dc23f610c2567fb5180f", // UNI Polygon 
          "walletAddress": "0x7949344dcdfb01cbce444e73ea0c6d21c9aa257f",
          "toAddress": "0x584b997d843b50dad9cde1821b647c51b1643f9a",
          "transactionFeePercent": null
        } 

---

**4. Você conseguiu atingir o objetivo da sessão?**

* [x] Sim
* [] Não. Se **não**, explique o que impediu.


---

**5. Problemas encontrados**

Usei todo o limite da API tentando resolver um bug em outro endpoint e não consegui executar a transação final.
Como segue a mesma lógica do **SWAP**, não deve conter erros.


---

**6. Observações adicionais**
* A `quoteId` criada ainda precisar ser executada e possui um tempo para expirar.
* *Transfer USDC* devidamente implementada no dApp.

- Com Next.js, tentei realizar uma transferência de um endereço usando os dados de outra carteira e não foi aprovada.

      {
          "code": -32603,
          "message": "PersonalMessageController Signature: failed to sign message Torus Keyring - Unable to find matching address.",
          "stack": "Stack trace is not available."
      }

