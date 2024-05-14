import React, { useState, useEffect } from "react";
import { walletClient, sepoliaClient, baseClient } from './client';
import { abi } from './abi';
import "./index.css";

const LogInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [contractMessage, setContractMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');

  // Fetch message details on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await sepoliaClient.readContract({
          address: '0x8D1c4a8994b9bBB16c6Fc50eac42c228bD49b6CA', // Replace with your Ethereum Sepolia contract address
          abi,
          functionName: 'getLastReceivedMessageDetails',
        });
        setContractMessage(data[1]);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle read click - this simply logs the message and shows it
  const handleReadClick = () => {
    console.log(contractMessage);
    setShowMessage(true);
  };

  // Handle input changes
  const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setInputValue(event.target.value);
  };

  // Handle form submission and initiate transaction
  const logInput = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    console.log(inputValue);
    await sendTransaction();
  };

  // Function to handle the smart contract transaction
  const sendTransaction = async () => {
    try {
      const [account] = await walletClient.getAddresses();
      const { request } = await baseClient.simulateContract({
        address: '0x4C1cEfb608a812f19C77A4e6d48a85d804A57B95', // Replace with your Base Sepolia contract address
        abi,
        functionName: 'sendMessagePayLINK',
        args: [BigInt("16015286601757825753"), "0x8D1c4a8994b9bBB16c6Fc50eac42c228bD49b6CA", inputValue], // Replace with your Ethereum Sepolia contract address
        account
      });

      const txResponse = await walletClient.writeContract(request);
      setTransactionHash(txResponse);
      console.log('Transaction Hash:', txResponse);
    } catch (error) {
      console.error('Transaction Error:', error);
    }
  };

  // Render the component UI
  return (
    <div className="App">
      <div className="forms-wrapper">
        <form className="form-container">
          <img src="/base.png" alt="Base"/>
          <input 
            value={inputValue}
            onChange={handleInputChange}
            className="form-input" 
            id="message" 
            type="text" 
            placeholder="Type Message"
          />
          <button onClick={logInput} className="button-base">
            🔊 Send to Sepolia
          </button>
        </form>
        <div className="form-container-1">
          <img src="/ethereum.png" alt="Base"/>
          <button onClick={handleReadClick} className="button-sepolia">
            🦻 Read on Sepolia
          </button>
        </div>
        {showMessage && <p className="message">{contractMessage || "No Messge Yet"}</p>}
        {transactionHash && <p className="link"><a href={`https://ccip.chain.link/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
          View Transaction
        </a></p>}
      </div>
    </div>
  );
};

export default LogInput;
