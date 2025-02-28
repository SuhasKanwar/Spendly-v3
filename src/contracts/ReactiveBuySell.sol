// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../lib/reactive-lib/src/abstract-base/AbstractReactive.sol";
import "../../lib/reactive-lib/src/interfaces/IReactive.sol";

/**
 * @title ReactiveVolatilityTrigger
 * @dev Listens for specific blockchain events and, upon detection, transfers 0.01 ETH to a designated recipient.
 * It subscribes to events (such as significant crypto volatility) via an external reactive service.
 */
contract ReactiveVolatilityTrigger is AbstractReactive {
    // Address to receive funds upon event trigger.
    address private immutable recipient;

    // Default recipient address if none is provided.
    address private constant DEFAULT_RECIPIENT = 0x53981d91E5E7039375FF74BD2d7652329fd4aB01;

    // Event emitted after a successful transfer.
    event TransferExecuted(address indexed from, address indexed to, uint256 amount);

    /**
     * @dev Constructor to set the recipient address and attempt event subscription.
     * @param _recipient The address designated to receive funds. If set to address(0), the default is used.
     */
    constructor(address _recipient) {
        // Set the recipient address.
        recipient = (_recipient == address(0)) ? DEFAULT_RECIPIENT : _recipient;

        // Attempt to subscribe to events indicating significant crypto volatility.
        // The call is wrapped in a try/catch block to prevent deployment failure
        // if the external service (inherited as "service") is not available or rejects the parameters.
        try service.subscribe(
            block.chainid,       // Current chain ID
            address(0),          // Address to monitor (to be specified)
            uint256(0),          // Topic 0 (event signature hash, to be specified)
            uint256(0),          // Topic 1 (optional)
            uint256(0),          // Topic 2 (optional)
            uint256(0)           // Topic 3 (optional)
        ) {
            // Subscription succeeded.
        } catch {
            // Subscription failed.
            // You might add logging here or take alternative action if necessary.
        }
    }

    /*
     * @notice Callback function invoked when a subscribed event is detected.
     * @param /log/ IReactive.LogRecord calldata The log record containing event data.
     */
    function react(IReactive.LogRecord calldata log) external override {
        // Ensure only the authorized service can invoke this function.
        require(msg.sender == address(service), "Unauthorized sender");

        // Execute the payment logic upon event detection.
        _initiatePayment();
    }

    /**
     * @dev Internal function that handles payment logic by transferring 0.01 ETH.
     */
    function _initiatePayment() internal {
        // Verify the contract holds at least 0.01 ETH.
        require(address(this).balance >= 0.01 ether, "Insufficient balance");

        // Transfer 0.01 ETH to the recipient.
        (bool sent, ) = recipient.call{value: 0.01 ether}("");
        require(sent, "Transfer failed");

        // Emit an event on successful transfer.
        emit TransferExecuted(address(this), recipient, 0.01 ether);
    }

    // Function to receive ETH into the contract.
    receive() external payable override{}
}
