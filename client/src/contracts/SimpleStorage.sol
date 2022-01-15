// SPDX-License-Identifier: MIT
pragma solidity 5.4.29;

contract SimpleStorage {
    string ipfsHash;

    function set(string x) public {
        ipfsHash = x;
    }

    function get() public view returns (string) {
        return ipfsHash;
    }
}
