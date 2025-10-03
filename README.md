# Trilha B & C- Notus Lab

## Account Abstraction Web3Auth (PoC)

This project is a Proof of Concept (PoC) demonstrating Account Abstraction using Web3Auth. It aims to showcase how to integrate Web3Auth for seamless user authentication and manage smart contract accounts, enhancing the user experience in decentralized applications (dApps). The project leverages the Notus API for digital asset management, including features like fetching portfolio, transfering tokens, and swapping assets.

- Development time: 10 days.


### Technologies Used

*   **Next.js**: React framework for building performant web applications.
*   **Web3Auth**: SDK for easy and secure user authentication in web3 applications.
*   **Notus API**: A powerful API for digital asset management, providing endpoints for portfolio tracking, transactions, and more.
*   **TypeScript**: Strongly typed programming language that builds on JavaScript.
*   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
*   **Viem**: Libraries for interacting with the Ethereum blockchain.
---

### API Routes

The application integrates with the Notus API to provide the following functionalities:

*   **GET** `/api/v1/wallets/`: Retrieves the all the wallets registered in the Notus platform by project [**OK**]

*   **GET** `/api/v1/wallets/{accountAbstraction}/portfolio`: Retrieves the portfolio of a wallet, including token balances. [**OK**]
*   **POST** `/api/v1/wallets/register`: Registers a new wallet. [**OK**]
*   **POST** `/api/v1/crypto/swap`: Creates a user operation to swap tokens. [**OK**]
*   **POST** `/api/v1/crypto/execute-user-op`: Executes a user operation. [**OK**]
*   **GET** `/api/v1/liquidity/amounts`: Fetches the amounts of tokens in a liquidity pool. [**OK**]
*   **POST** `/api/v1/liquidity/create`: Creates a new liquidity pool. [*NOT TESTED*]
*   **POST** `/api/v1/crypto/transfer`: Creates a user operation to transfer tokens. [*NOT TESTED*]
*   **GET** `/api/v1/wallets/{accountAbstraction}/history`: Fetches the transaction history of a wallet. [*BUG*]

---
### Getting Started

Follow these steps to set up and run the project locally:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/concs-niemeyer/notus-dx.git
    cd notus-dx
    
    ```


2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project and add your Web3Auth client ID and any other necessary environment variables.

    ```
    NEXT_PUBLIC_WEB3AUTH_CLIENT_ID="YOUR_WEB3AUTH_CLIENT_ID"
    NEXT_PUBLIC_NOTUS_API_KEY="YOUR_NOTUS_API_KEY"
    

    ```

    *(You can obtain a Web3Auth Client ID from the [Web3Auth Dashboard](https://dashboard.web3auth.io/).)*

    *(You can obtain a Notus API Key from the [Notus Dashboard](https://dashboard.notus.team/).)*

    
    
4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```
---