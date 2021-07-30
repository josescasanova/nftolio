import React, { useEffect, useState } from "react";
import Web3 from "web3";

const resolveWeb3 = (resolve) => {
  // @ts-ignore
  let { web3 } = window;
  const alreadyInjected = typeof web3 !== "undefined"; // i.e. Mist/Metamask
  const localProvider = `http://localhost:9545`;

  if (alreadyInjected) {
    console.log(`Injected web3 detected.`);
    web3 = new Web3(web3.currentProvider);
  } else {
    console.log(`No web3 instance injected, using Local web3.`);
    const provider = new Web3.providers.HttpProvider(localProvider);
    web3 = new Web3(provider);
  }

  resolve(web3);
};

const getWeb3 = (): any => {
  return new Promise((resolve) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener(`load`, () => {
      resolveWeb3(resolve);
    });
    // If document has loaded already, try to get Web3 immediately.
    if (document.readyState === `complete`) {
      resolveWeb3(resolve);
    }
  });
};

const Web3Container = async (props) => {
  const [state, setState] = useState<{ web3?: any; accounts?: any }>({});

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        setState({ web3, accounts });
      } catch (error) {
        alert(`Failed to load web3, or accounts. Check console for details.`);
        console.log(error);
      }
    };
    fetchWallet();
  }, []);

  const { web3, accounts } = state;
  return web3 && accounts
    ? props.render({ web3, accounts })
    : props.renderLoading();
};

export default Web3Container;
