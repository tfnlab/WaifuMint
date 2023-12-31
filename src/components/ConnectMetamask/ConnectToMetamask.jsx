import React, { useEffect, useState, useRef } from "react";
import metamaskIcon from "./metamask.svg";
import Web3 from 'web3';
import { v4 as uuidv4 } from 'uuid'; // Import the v4 function from the uuid library
// import { Entity, Scene } from "aframe-react";
import "./styles.css";

import axios from 'axios';
import * as d3 from 'd3';

const ConnectToMetamask = ({ connectToMetamask }) => {
  const [value, setValue] = useState('');



  return (
    <div className="container" >
      <div className="jumbotron custom-jumbotron">
        <h1 className="display-5 text-center">
          Meta Legends
        </h1>
        <h3 className="mt-3">Introducing Our Profile Picture Collection</h3>
                    <hr className="my-4" />
                    <p>
                    Discover the future of profile pictures with our revolutionary AI-generated collection. We're the first to offer a large, adaptable selection of AI-crafted profile pictures, ensuring diversity, uniqueness, and privacy. Upgrade your online presence today.
                    </p>
                <hr className="my-4" />
                <button
                  onClick={connectToMetamask}
                  className="btn btn-primary d-flex align-items-center"
                  style={{ fontSize: "0.9rem", letterSpacing: "0.14rem" }}
                >
                  Connect Wallet
                </button>




        <hr className="my-2" />
        MetaLegends.org &copy; 2023 All rights reserved.
        <hr className="my-2" />
      </div>
    </div>
  );
};

export default ConnectToMetamask;
