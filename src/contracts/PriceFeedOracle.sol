// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PriceFeedOracle is Ownable {
    AggregatorV3Interface private immutable priceFeed;
    uint256 private constant PRICE_VALIDITY_PERIOD = 5 minutes;
    
    event PriceUpdated(uint256 price, uint256 timestamp);

    constructor(address _priceFeed) Ownable(msg.sender) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function getPrice() external view returns (uint256, bool) {
        (
            ,
            int256 price,
            ,
            uint256 updatedAt,
            
        ) = priceFeed.latestRoundData();
        
        bool isValid = (block.timestamp - updatedAt) <= PRICE_VALIDITY_PERIOD;
        return (uint256(price), isValid);
    }

    function getLastUpdateTimestamp() external view returns (uint256) {
        (, , , uint256 updatedAt, ) = priceFeed.latestRoundData();
        return updatedAt;
    }
}
