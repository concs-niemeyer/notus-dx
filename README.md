# Trilha B & C- Notus

## Account Abstraction Web3Auth (PoC)

This project is a Proof of Concept (PoC) demonstrating Account Abstraction using Web3Auth. It aims to showcase how to integrate Web3Auth for seamless user authentication and manage smart contract accounts, enhancing the user experience in decentralized applications (dApps).

### Technologies Used

*   **Next.js**: React framework for building performant web applications.
*   **Web3Auth**: SDK for easy and secure user authentication in web3 applications.
*   **TypeScript**: Strongly typed programming language that builds on JavaScript.
*   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
*   **Viem**: Libraries for interacting with the Ethereum blockchain.

### Getting Started

Follow these steps to set up and run the project locally:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/concs-niemeyer/notus-web3auth.git
    cd notus-web3auth
    
    ```


2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of the project and add your Web3Auth client ID and any other necessary environment variables.

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

Check the project's [demo](https://notus-web3auth.vercel.app/)
