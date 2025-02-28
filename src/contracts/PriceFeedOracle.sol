// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PriceFeedOracle is Ownable {
    uint256 private lastPrice;
    uint256 private lastUpdateTimestamp;
    uint256 private constant PRICE_VALIDITY_PERIOD = 5 minutes;

    event PriceUpdated(uint256 price, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    function updatePrice(uint256 _price) external onlyOwner {
        lastPrice = _price;
        lastUpdateTimestamp = block.timestamp;
        emit PriceUpdated(_price, block.timestamp);
    }

    function getPrice() external view returns (uint256, bool) {
        bool isValid = (block.timestamp - lastUpdateTimestamp) <= PRICE_VALIDITY_PERIOD;
        return (lastPrice, isValid);
    }

    function getLastUpdateTimestamp() external view returns (uint256) {
        return lastUpdateTimestamp;
    }
}
