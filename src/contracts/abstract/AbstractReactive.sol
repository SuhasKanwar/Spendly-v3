// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IReactive.sol";

abstract contract AbstractReactive is IReactive {
    bool private _isSubscribed;
    address internal service;

    function subscribe() external payable virtual override {
        _isSubscribed = true;
        service = msg.sender;
    }

    function unsubscribe() external virtual override {
        require(msg.sender == service, "Unauthorized sender");
        _isSubscribed = false;
        service = address(0);
    }

    function isSubscribed() external view virtual override returns (bool) {
        return _isSubscribed;
    }

    receive() external payable virtual {}
}
