const { AuthProvider } = window.arcana.auth;

let provider;
const auth = new AuthProvider(
  "xar_test_4202ee73474195d8bfc5d14d7d1c78d8567eeff2"
);
provider = auth.provider;
setHooks();

window.onload = async () => {
  await auth.init();
  console.log("Auth initializaiton complete");
};

function setHooks() {
  provider("connect", async (params) => {
    console.log({ type: "connect", params: params });
  });
}

async function connect() {
  const provider = await auth.connect();
  alert("Successfully connected");
}

async function passwordlesslogin() {
    await auth.loginWithLink("ayushkmrjha@yahoo.com");
}

async function sociallogin() {
    await auth.loginWithSocial("google");
    alert("Login successful with google");
}

async function getAccount() {
    const accounts = await provider.request({method: "eth_accounts"});
    console.log({accounts});
    from = accounts[0];
}

async function getMyPublicKey() {
    if(!from) {
        alert("Get the accounts first");
    }

    const pk = await provider.request({method: "eth_getEncryptionPublicKey", params: [from]});
    console.log({pk});
    alert(pk);
    publicKey = pk;
}

async function getOtherPublicKey() {
    const pk = await auth.getPublicKey("ayushkmrjha@yahoo.com");
    console.log({pk});
    alert(pk);
}

async function requestSign() {
    // eth_signTypedData_v4 parameters. All of these parameters affect the resulting signature.
  const msgParams = JSON.stringify({
    domain: {
      // This defines the network, in this case, Mainnet.
      chainId: 1,
      // Give a user-friendly name to the specific contract you're signing for.
      name: 'Ether Mail',
      // Add a verifying contract to make sure you're establishing contracts with the proper entity.
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      // This identifies the latest version.
      version: '1',
    },

    // This defines the message you're proposing the user to sign, is dapp-specific, and contains
    // anything you want. There are no required fields. Be as explicit as possible when building out
    // the message schema.
    message: {
      contents: 'Hello, Bob!',
      attachedMoneyInEth: 4.2,
      from: {
        name: 'Cow',
        wallets: [
          '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
          '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
        ],
      },
      to: [
        {
          name: 'Bob',
          wallets: [
            '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
            '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
            '0xB0B0b0b0b0b0B000000000000000000000000000',
          ],
        },
      ],
    },
    // This refers to the keys of the following types object.
    primaryType: 'Mail',
    types: {
      // This refers to the domain the contract is hosted on.
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      // Not an EIP712Domain definition.
      Group: [
        { name: 'name', type: 'string' },
        { name: 'members', type: 'Person[]' },
      ],
      // Refer to primaryType.
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person[]' },
        { name: 'contents', type: 'string' },
      ],
      // Not an EIP712Domain definition.
      Person: [
        { name: 'name', type: 'string' },
        { name: 'wallets', type: 'address[]' },
      ],
    },
  });
    
    if(!from){
        alert("Get accounts first");
    }
    const signature = await provider.request({
        method: "eth_signTypeData_v4",
        params: [from, msgParams]
    })
    console.log({signature}) 
    alert(signature)
}

async function sendTransaction(){
    if(!from){
        alert("Get accounts first");
    }

    const hash = await provider.request({
        method: "eth_sendTransaction",
        params: [
            {
                from,
                gasPrice: 0,
                to: "0xa15B8586C00B6115e8C452E4B6594B7970E0B759",
                value: "0x01"
            }
        ]
    })
    alert(hash)

}

async function signTransaction() {
    if(!from){
        alert("Get Accoutns first")
    }

    const sig = await provider.request({
        method: "eth_signTransaction",
        params: [{
                from,
                gasPrice: 0,
                to: "0xa15B8586C00B6115e8C452E4B6594B7970E0B759",
                value: "0x01"
        }]

    })
    alert(sig)

}

async function addChain(){
    const response = await provider.request({
        method: "wallet_addEthereumChain",
        params: [{
            chainId: "0x64",
            chainName: "Ethereum",
            blockExplorerUrls: ["https://etherscan.io/"],
            rpcUrls: ["https://cloudflare-eth.com/"],
            nativeCurrency:{
                symbol: "ETH"
            }
        }]
    })

    alert(response);
}

async function switchChain(){
    const response =  await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{
            chainId: "0x64"
        }]
    })
    alert(response);
}

async function addToken() {
    let contractAddress = await provider.request({
        method: "wallet_watchAssets",
        params: {
            type: "ERC20",
            options: {
                address: contractAddress || "0xa15B8586C00B6115e8C452E4B6594B7970E0B759",
                symbol: "DMY",
                decimal: 18,
                image: "https://foo.io/token-image.svg"
            }
        }
    })
    alert(response);
}

async function logout() {
    await auth.logout();
    alert("user Logged out")
}