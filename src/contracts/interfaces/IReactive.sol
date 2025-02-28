// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IReactive {
    struct LogRecord {
        uint256 blockNumber;
        bytes32 blockHash;
        uint256 transactionIndex;
        address source;
        uint256 chainId;
        bytes32 key;
    }

    function subscribe() external payable;
    function unsubscribe() external;
    function isSubscribed() external view returns (bool);
    function react(LogRecord calldata record) external;
}
