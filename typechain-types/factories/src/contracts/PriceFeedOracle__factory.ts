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
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  PriceFeedOracle,
  PriceFeedOracleInterface,
} from "../../../src/contracts/PriceFeedOracle";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_priceFeed",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "PriceUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "getLastUpdateTimestamp",
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
    name: "getPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
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
    name: "owner",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60a060405234801561001057600080fd5b506040516104ea3803806104ea83398101604081905261002f916100c0565b338061005557604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b61005e81610070565b506001600160a01b03166080526100f0565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000602082840312156100d257600080fd5b81516001600160a01b03811681146100e957600080fd5b9392505050565b6080516103d96101116000396000818160e8015261019301526103d96000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063715018a61461005c5780638da5cb5b1461006657806398d5fdca14610086578063e1e46882146100a3578063f2fde38b146100b9575b600080fd5b6100646100cc565b005b6000546040516001600160a01b0390911681526020015b60405180910390f35b61008e6100e0565b6040805192835290151560208301520161007d565b6100ab61018e565b60405190815260200161007d565b6100646100c73660046102dd565b61021d565b6100d4610260565b6100de600061028d565b565b6000806000807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663feaf968c6040518163ffffffff1660e01b815260040160a060405180830381865afa158015610144573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610168919061032c565b50935050925050600061012c8242610180919061037c565b939693111594509192505050565b6000807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663feaf968c6040518163ffffffff1660e01b815260040160a060405180830381865afa1580156101ef573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610213919061032c565b5095945050505050565b610225610260565b6001600160a01b03811661025457604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b61025d8161028d565b50565b6000546001600160a01b031633146100de5760405163118cdaa760e01b815233600482015260240161024b565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000602082840312156102ef57600080fd5b81356001600160a01b038116811461030657600080fd5b9392505050565b805169ffffffffffffffffffff8116811461032757600080fd5b919050565b600080600080600060a0868803121561034457600080fd5b61034d8661030d565b94506020860151935060408601519250606086015191506103706080870161030d565b90509295509295909350565b8181038181111561039d57634e487b7160e01b600052601160045260246000fd5b9291505056fea26469706673582212209627c35611644fe3d836a6d46741184382eb8d170b501bb99ed57b986c82732a64736f6c63430008140033";

type PriceFeedOracleConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PriceFeedOracleConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PriceFeedOracle__factory extends ContractFactory {
  constructor(...args: PriceFeedOracleConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _priceFeed: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_priceFeed, overrides || {});
  }
  override deploy(
    _priceFeed: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_priceFeed, overrides || {}) as Promise<
      PriceFeedOracle & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): PriceFeedOracle__factory {
    return super.connect(runner) as PriceFeedOracle__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PriceFeedOracleInterface {
    return new Interface(_abi) as PriceFeedOracleInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): PriceFeedOracle {
    return new Contract(address, _abi, runner) as unknown as PriceFeedOracle;
  }
}
