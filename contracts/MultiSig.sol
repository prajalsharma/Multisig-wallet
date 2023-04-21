// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract MultiSig{

    address[] public owners;
    uint public threshold;
    address public owner;

    struct Transfer {
        uint id;
        uint amount;
        address payable to;
        uint approvals;
        bool sent;
    }

    Transfer[] public transfers;

    mapping(address => mapping(uint => bool)) public approvals;

    constructor(address[] memory _owners, uint _threshold){
        owners = _owners;
        threshold = _threshold;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function getOwners() external view returns(address[] memory){
        return owners;
    }

    function createTransfer(uint amount, address payable to) external onlyOwner {
        transfers.push(Transfer(transfers.length, amount, to, 0, false));
    }

    function getTransfers() external view returns(Transfer[] memory){
        return transfers;
    }

    function approveTransfer(uint id) external {
        require(transfers[id].sent == false, "transfer has already been sent");
        require(approvals[msg.sender][id] == false, "cannot approve transfer again");

        approvals[msg.sender][id] == true;
        transfers[id].approvals++;

        if(transfers[id].approvals >= threshold) {
            transfers[id].sent = true;
            address payable to = transfers[id].to;
            uint amount = transfers[id].amount;
            to.transfer(amount);
        }
    }

   function deposit() external payable {}

}