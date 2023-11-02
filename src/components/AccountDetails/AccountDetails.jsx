import { v4 as uuidv4 } from 'uuid'; // Import the v4 function from the uuid library
import Web3 from 'web3';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const AccountDetails = ({ accountAddress, accountBalance }) => {
  const [value, setValue] = useState('');
  const [signature, setSignature] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const url = 'https://www.kafkacoineth.com/home/add_wallet/'; // replace with your target URL
  const [walletHistory, setWalletHistory] = useState(null);
  const [walletLeaders, setWalletLeaders] = useState(null);
  const [leadersString, setLeadersString] = useState('');
  const [leadersData, setLeadersData] = useState([]);

  useEffect(() => {
    // Function to fetch the CSRF token
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('/home/get_csrf_token');
        const csrfToken = response.data.csrf_token;
        setCsrfToken(csrfToken);

        const walletHistoryResponse = await axios.get(`/home/get_wallet_history?wallet_address=${accountAddress}`);
        const parsedResponse = JSON.parse(walletHistoryResponse.data);
        setWalletHistory(parsedResponse);
        try {
          const walletLeadersResponse = await axios.get(`/home/get_leaders/`);
          setWalletLeaders(walletLeadersResponse.data.leaders);
          const leadersString = JSON.stringify(walletLeadersResponse.data.leaders, null, 2);
          const parsedData = JSON.parse(leadersString);
          setLeadersData(parsedData);
          console.log(leadersString);
          setLeadersString(leadersString);
          //const parsedLeadersResponse = JSON.parse(walletLeadersResponse.data);
          //alert(parsedLeadersResponse)
          //setWalletLeaders(parsedLeadersResponse);
        } catch (error) {
          console.error(error);
          alert(error);
        }

      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();

    const spanElements = document.querySelectorAll('.wallet_address_span');

    spanElements.forEach((spanElement) => {
      const accountAddress = spanElement.innerText;

      if (accountAddress.length >= 8) {
        const shortenedAddress = accountAddress.substring(0, 4) + '...' + accountAddress.slice(-4);
        spanElement.innerText = shortenedAddress;
      }
    });
    // Call the fetchCsrfToken function when the component mounts

  }, []);

  const signMessage = async (message, account) => {
    try {
      const web3 = new Web3(window.ethereum);
      const signedMessage = await web3.eth.personal.sign(message, account, '');
      return signedMessage;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error; // Rethrow the error for handling in the caller function
    }
  };

  const handleClick = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.requestAccounts();
      const account = accounts[0];

      // Generate a unique nonce (key)
      const key = uuidv4();

      // Call the signMessage function to generate the signature
      const signature = await signMessage(key, account);

      const data = {
        key: key,
        value: accountAddress,
        accountAddress: accountAddress,
        signature: signature, // Attach the signature to the payload
      };

      const url = '/home/add_wallet/';

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken, // Include the CSRF token in the headers
        },
        body: JSON.stringify(data),
      };

      // Send the data to the server and get the response
      const response = await fetch(url, requestOptions);
      const responseData = await response.text();
      document.getElementById("verified_button").innerText = "Verified";
    } catch (error) {
      console.error('Error handling click event:', error);
    }
  };



  return (
    <div>
      <div className="jumbotron">
        <h1 className="display-5">Verify Wallet Address (Optional)</h1>
        <div class="card col-md-12" >
          <div class="card-body">

                      <hr className="my-4" />
                      <p>
                      <a href={`/home/my_profile/`}>My Profile</a>
                      </p>
                      <p>
                      My Wallet Address: <span class="wallet_address_span" >{accountAddress}</span>
                      <input type="hidden" name="accountAddress" value={accountAddress} />
                      <input type="hidden" name="csrf_token" value={csrfToken} />
                      <hr className="my-1" />
                      <button onClick={handleClick} id="verified_button">Verify</button>
                      <hr className="my-4" />

                      <input
                        type="hidden"
                        value={signature}
                        readOnly
                        placeholder="Signature"
                        style={{ width: '100%' }}
                      />
                      </p>

                        <hr className="my-4" />

          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
