import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import ipfs from './ipfs';

import "./App.css";
import { read } from "fs";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storageValue: 0,
      web3: null,
      contract: null,
      buffer: null,
      ipfsHash: null
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      console.log("web3", web3);

      this.setState({
        web3: web3
      })

      // Use web3 to get the user's accounts.
      const accounts = web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      this.setState({
        contract: instance
      })
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.error(error);
    }
  };

  captureFile(event) {
    console.log('Capture file...');
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer);
    }
  }

  onSubmit(event) {
    event.preventDefault()
    console.log('On submit...');
    ipfs.files.add(this.state.buffer, (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      this.setState({ ipfsHash: result[0].hash })
      console.log('ipfsHash', this.state.ipfsHash)
    })
  }

  render() {
    return (
      <div className="App">
        <h1>Your Image!</h1>
        <p>The image is stored in IPFS & The Ethereum Blockchain!</p>
        <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt="" />
        <h2>Upload Image</h2>
        <form onSubmit={this.onSubmit}>
          <input type='file' onChange={this.captureFile} />
          <input type='submit' />
        </form>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
