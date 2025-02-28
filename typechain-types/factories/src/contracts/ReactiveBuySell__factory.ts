/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  BigNumberish,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  ReactiveBuySell,
  ReactiveBuySellInterface,
} from "../../../src/contracts/ReactiveBuySell";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_swapRouter",
        type: "address",
      },
      {
        internalType: "address",
        name: "_priceFeed",
        type: "address",
      },
      {
        internalType: "address",
        name: "_WETH9",
        type: "address",
      },
      {
        internalType: "address",
        name: "_targetToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_buyThreshold",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_sellThreshold",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "tokenIn",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "tokenOut",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    name: "SwapExecuted",
    type: "event",
  },
  {
    inputs: [],
    name: "WETH9",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "buyThreshold",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "checkAndTrade",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "isSubscribed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "poolFee",
    outputs: [
      {
        internalType: "uint24",
        name: "",
        type: "uint24",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "priceFeed",
    outputs: [
      {
        internalType: "contract PriceFeedOracle",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "blockNumber",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "blockHash",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "transactionIndex",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "source",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "chainId",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "key",
            type: "bytes32",
          },
        ],
        internalType: "struct IReactive.LogRecord",
        name: "",
        type: "tuple",
      },
    ],
    name: "react",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "sellThreshold",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "subscribe",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "swapRouter",
    outputs: [
      {
        internalType: "contract ISwapRouter",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "targetToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "unsubscribe",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_buyThreshold",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_sellThreshold",
        type: "uint256",
      },
    ],
    name: "updateThresholds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdrawETH",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdrawTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x61010060405234801561001157600080fd5b506040516111de3803806111de83398101604081905261003091610091565b6001600160a01b0395861660805293851660a05291841660c05290921660e05260019190915560025560008054610100600160a81b03191633610100021790556100f7565b80516001600160a01b038116811461008c57600080fd5b919050565b60008060008060008060c087890312156100aa57600080fd5b6100b387610075565b95506100c160208801610075565b94506100cf60408801610075565b93506100dd60608801610075565b92506080870151915060a087015190509295509295509295565b60805160a05160c05160e05161104c6101926000396000818161015d015281816108750152818161097401528181610a2501528181610aef01528181610b4a0152610c970152600081816101cb015281816108500152818161099e01528181610b6f0152610c6d01526000818161023401526105420152600081816102cb015281816108e201528181610b100152610bdc015261104c6000f3fe6080604052600436106100ec5760003560e01c8063741bef1a1161008a578063c31c9c0711610059578063c31c9c07146102b9578063df8d153c146102ed578063f13cff411461030d578063fcae44841461032357600080fd5b8063741bef1a146102225780638a281554146102565780638f449a0514610279578063c14b8e9c1461029957600080fd5b80634782f779116100c65780634782f779146101975780634aa4a4fc146101b95780635e35359e146101ed57806367f4227c1461020d57600080fd5b8063089fe6aa146100f85780632d4310c014610127578063327107f71461014b57600080fd5b366100f357005b600080fd5b34801561010457600080fd5b5061010e610bb881565b60405162ffffff90911681526020015b60405180910390f35b34801561013357600080fd5b5061013d60025481565b60405190815260200161011e565b34801561015757600080fd5b5061017f7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200161011e565b3480156101a357600080fd5b506101b76101b2366004610e07565b610338565b005b3480156101c557600080fd5b5061017f7f000000000000000000000000000000000000000000000000000000000000000081565b3480156101f957600080fd5b506101b7610208366004610e33565b610455565b34801561021957600080fd5b506101b761053d565b34801561022e57600080fd5b5061017f7f000000000000000000000000000000000000000000000000000000000000000081565b34801561026257600080fd5b5060005460ff16604051901515815260200161011e565b6101b76000805433610100026001600160a81b0319909116176001179055565b3480156102a557600080fd5b506101b76102b4366004610e74565b610638565b3480156102c557600080fd5b5061017f7f000000000000000000000000000000000000000000000000000000000000000081565b3480156102f957600080fd5b506101b7610308366004610e96565b610672565b34801561031957600080fd5b5061013d60015481565b34801561032f57600080fd5b506101b76106ac565b60005461010090046001600160a01b031633146103705760405162461bcd60e51b815260040161036790610eae565b60405180910390fd5b478111156103b75760405162461bcd60e51b8152602060048201526014602482015273496e73756666696369656e742062616c616e636560601b6044820152606401610367565b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114610404576040519150601f19603f3d011682016040523d82523d6000602084013e610409565b606091505b50509050806104505760405162461bcd60e51b8152602060048201526013602482015272115512081d1c985b9cd9995c8819985a5b1959606a1b6044820152606401610367565b505050565b60005461010090046001600160a01b031633146104845760405162461bcd60e51b815260040161036790610eae565b6040516370a0823160e01b81523060048201526001600160a01b038416906370a0823190602401602060405180830381865afa1580156104c8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104ec9190610edb565b8111156105325760405162461bcd60e51b8152602060048201526014602482015273496e73756666696369656e742062616c616e636560601b6044820152606401610367565b6104508383836106ed565b6000807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166398d5fdca6040518163ffffffff1660e01b81526004016040805180830381865afa15801561059d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105c19190610f09565b91509150806106125760405162461bcd60e51b815260206004820152601860248201527f507269636520666565642064617461206973207374616c6500000000000000006044820152606401610367565b6001548211610627576106236107ed565b5050565b600254821061062357610623610a0d565b60005461010090046001600160a01b031633146106675760405162461bcd60e51b815260040161036790610eae565b600191909155600255565b60005461010090046001600160a01b031633146106a15760405162461bcd60e51b815260040161036790610eae565b6106a961053d565b50565b60005461010090046001600160a01b031633146106db5760405162461bcd60e51b815260040161036790610eae565b600080546001600160a81b0319169055565b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180516001600160e01b031663a9059cbb60e01b17905291516000928392908716916107499190610f35565b6000604051808303816000865af19150503d8060008114610786576040519150601f19603f3d011682016040523d82523d6000602084013e61078b565b606091505b50915091508180156107b55750805115806107b55750808060200190518101906107b59190610f64565b6107e65760405162461bcd60e51b815260206004820152600260248201526114d560f21b6044820152606401610367565b5050505050565b478061083b5760405162461bcd60e51b815260206004820152601860248201527f496e73756666696369656e74204554482062616c616e636500000000000000006044820152606401610367565b60408051610100810182526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000811682527f0000000000000000000000000000000000000000000000000000000000000000166020820152610bb891810191909152306060820152600090608081016108bc42600f610f86565b81526020018381526020016000815260200160006001600160a01b0316815250905060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663414bf38984846040518363ffffffff1660e01b815260040161092d9190610fad565b60206040518083038185885af115801561094b573d6000803e3d6000fd5b50505050506040513d601f19601f820116820180604052508101906109709190610edb565b90507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03167f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03167fdd36740e2a012d93061a0d99eaa9107860955de4e90027d3cf465a055026c4078584604051610a00929190918252602082015260400190565b60405180910390a3505050565b6040516370a0823160e01b81523060048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa158015610a74573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a989190610edb565b905060008111610aea5760405162461bcd60e51b815260206004820152601a60248201527f496e73756666696369656e7420746f6b656e2062616c616e63650000000000006044820152606401610367565b610b357f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000083610cf9565b60408051610100810182526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000811682527f0000000000000000000000000000000000000000000000000000000000000000166020820152610bb89181019190915230606082015260009060808101610bb642600f610f86565b81526020018381526020016000815260200160006001600160a01b0316815250905060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663414bf389836040518263ffffffff1660e01b8152600401610c269190610fad565b6020604051808303816000875af1158015610c45573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c699190610edb565b90507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03167f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03167fdd36740e2a012d93061a0d99eaa9107860955de4e90027d3cf465a055026c4078584604051610a00929190918252602082015260400190565b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180516001600160e01b031663095ea7b360e01b1790529151600092839290871691610d559190610f35565b6000604051808303816000865af19150503d8060008114610d92576040519150601f19603f3d011682016040523d82523d6000602084013e610d97565b606091505b5091509150818015610dc1575080511580610dc1575080806020019051810190610dc19190610f64565b6107e65760405162461bcd60e51b8152602060048201526002602482015261534160f01b6044820152606401610367565b6001600160a01b03811681146106a957600080fd5b60008060408385031215610e1a57600080fd5b8235610e2581610df2565b946020939093013593505050565b600080600060608486031215610e4857600080fd5b8335610e5381610df2565b92506020840135610e6381610df2565b929592945050506040919091013590565b60008060408385031215610e8757600080fd5b50508035926020909101359150565b600060c08284031215610ea857600080fd5b50919050565b6020808252601390820152722ab730baba3437b934bd32b21039b2b73232b960691b604082015260600190565b600060208284031215610eed57600080fd5b5051919050565b80518015158114610f0457600080fd5b919050565b60008060408385031215610f1c57600080fd5b82519150610f2c60208401610ef4565b90509250929050565b6000825160005b81811015610f565760208186018101518583015201610f3c565b506000920191825250919050565b600060208284031215610f7657600080fd5b610f7f82610ef4565b9392505050565b80820180821115610fa757634e487b7160e01b600052601160045260246000fd5b92915050565b81516001600160a01b03908116825260208084015182169083015260408084015162ffffff16908301526060808401518216908301526080808401519083015260a0838101519083015260c0808401519083015260e0928301511691810191909152610100019056fea264697066735822122045741e13ac093574dcdfa6f0b27a544a3a4d10d6ab7ad8782f44c619736ab25864736f6c63430008140033";

type ReactiveBuySellConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ReactiveBuySellConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ReactiveBuySell__factory extends ContractFactory {
  constructor(...args: ReactiveBuySellConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _swapRouter: AddressLike,
    _priceFeed: AddressLike,
    _WETH9: AddressLike,
    _targetToken: AddressLike,
    _buyThreshold: BigNumberish,
    _sellThreshold: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      _swapRouter,
      _priceFeed,
      _WETH9,
      _targetToken,
      _buyThreshold,
      _sellThreshold,
      overrides || {}
    );
  }
  override deploy(
    _swapRouter: AddressLike,
    _priceFeed: AddressLike,
    _WETH9: AddressLike,
    _targetToken: AddressLike,
    _buyThreshold: BigNumberish,
    _sellThreshold: BigNumberish,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      _swapRouter,
      _priceFeed,
      _WETH9,
      _targetToken,
      _buyThreshold,
      _sellThreshold,
      overrides || {}
    ) as Promise<
      ReactiveBuySell & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ReactiveBuySell__factory {
    return super.connect(runner) as ReactiveBuySell__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ReactiveBuySellInterface {
    return new Interface(_abi) as ReactiveBuySellInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ReactiveBuySell {
    return new Contract(address, _abi, runner) as unknown as ReactiveBuySell;
  }
}
