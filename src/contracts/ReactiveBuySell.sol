// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IReactive.sol";
import "./abstract/AbstractReactive.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "./PriceFeedOracle.sol";

contract ReactiveBuySell is AbstractReactive {
    ISwapRouter public immutable swapRouter;
    PriceFeedOracle public immutable priceFeed;
    address public immutable WETH9;
    address public immutable targetToken;

    uint256 public buyThreshold;
    uint256 public sellThreshold;
    uint24 public constant poolFee = 3000;

    event SwapExecuted(
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    constructor(
        address _swapRouter,
        address _priceFeed,
        address _WETH9,
        address _targetToken,
        uint256 _buyThreshold,
        uint256 _sellThreshold
    ) {
        swapRouter = ISwapRouter(_swapRouter);
        priceFeed = PriceFeedOracle(_priceFeed);
        WETH9 = _WETH9;
        targetToken = _targetToken;
        buyThreshold = _buyThreshold;
        sellThreshold = _sellThreshold;

        // Initialize service as deployer (will be updated when subscribed)
        service = msg.sender;
    }

    function react(IReactive.LogRecord calldata) external override {
        require(msg.sender == address(service), "Unauthorized sender");
        checkAndTrade();
    }

    function checkAndTrade() public {
        (uint256 currentPrice, bool isValid) = priceFeed.getPrice();
        require(isValid, "Price feed data is stale");

        if (currentPrice <= buyThreshold) {
            _buy();
        } else if (currentPrice >= sellThreshold) {
            _sell();
        }
    }

    function _buy() internal {
        uint256 amountIn = address(this).balance;
        require(amountIn > 0, "Insufficient ETH balance");

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: WETH9,
                tokenOut: targetToken,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp + 15,
                amountIn: amountIn,
                amountOutMinimum: 0, // Note: In production, calculate this based on price impact
                sqrtPriceLimitX96: 0
            });

        uint256 amountOut = swapRouter.exactInputSingle{value: amountIn}(params);
        emit SwapExecuted(WETH9, targetToken, amountIn, amountOut);
    }

    function _sell() internal {
        uint256 balance = IERC20(targetToken).balanceOf(address(this));
        require(balance > 0, "Insufficient token balance");

        TransferHelper.safeApprove(targetToken, address(swapRouter), balance);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: targetToken,
                tokenOut: WETH9,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp + 15,
                amountIn: balance,
                amountOutMinimum: 0, // Note: In production, calculate this based on price impact
                sqrtPriceLimitX96: 0
            });

        uint256 amountOut = swapRouter.exactInputSingle(params);
        emit SwapExecuted(targetToken, WETH9, balance, amountOut);
    }

    function updateThresholds(uint256 _buyThreshold, uint256 _sellThreshold) external {
        require(msg.sender == address(service), "Unauthorized sender");
        buyThreshold = _buyThreshold;
        sellThreshold = _sellThreshold;
    }

    function withdrawETH(address payable recipient, uint256 amount) external {
        require(msg.sender == address(service), "Unauthorized sender");
        require(amount <= address(this).balance, "Insufficient balance");
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "ETH transfer failed");
    }

    function withdrawTokens(address token, address recipient, uint256 amount) external {
        require(msg.sender == address(service), "Unauthorized sender");
        require(amount <= IERC20(token).balanceOf(address(this)), "Insufficient balance");
        TransferHelper.safeTransfer(token, recipient, amount);
    }

    receive() external payable override {}
}
