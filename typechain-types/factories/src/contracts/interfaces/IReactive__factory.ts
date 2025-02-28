/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IReactive,
  IReactiveInterface,
} from "../../../../src/contracts/interfaces/IReactive";

const _abi = [
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
        name: "record",
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
    name: "subscribe",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "unsubscribe",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IReactive__factory {
  static readonly abi = _abi;
  static createInterface(): IReactiveInterface {
    return new Interface(_abi) as IReactiveInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): IReactive {
    return new Contract(address, _abi, runner) as unknown as IReactive;
  }
}
