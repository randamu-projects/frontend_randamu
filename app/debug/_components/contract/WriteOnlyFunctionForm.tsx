"use client";

import { useEffect, useState } from "react";
import { Abi, AbiFunction } from "abitype";
import { Address, TransactionReceipt } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import {
  ContractInput,
  TxReceipt,
  getFunctionInputKey,
  getParsedContractFunctionArgs,
  transformAbiFunction,
} from "~~/app/debug/_components/contract";
import { IntegerInput } from "~~/components/scaffold-eth";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

type WriteOnlyFunctionFormProps = {
  abi: Abi;
  abiFunction: AbiFunction;
  onChange: () => void;
  contractAddress: Address;
  inheritedFrom?: string;
  initialFormValues?: Record<string, any>;
  hideFunctionInputs?: boolean;
  buttonText: string;
};

export const WriteOnlyFunctionForm = ({
  abi,
  abiFunction,
  onChange,
  contractAddress,
  initialFormValues,
  hideFunctionInputs,
  buttonText,
}: WriteOnlyFunctionFormProps) => {
  const [form, setForm] = useState<Record<string, any>>(() => initialFormValues);
  const [txValue, setTxValue] = useState<string | bigint>("");
  const { chain } = useAccount();
  const writeTxn = useTransactor();
  const { targetNetwork } = useTargetNetwork();
  const writeDisabled = !chain || chain?.id !== targetNetwork.id;
  const { data: result, isPending, writeContractAsync } = useWriteContract();
  const showInputs = !hideFunctionInputs;

  const handleWrite = async () => {
    if (writeContractAsync) {
      try {
        const makeWriteWithParams = () =>
          writeContractAsync({
            address: contractAddress,
            functionName: abiFunction.name,
            abi: abi,
            args: getParsedContractFunctionArgs(initialFormValues || {}),
            value: BigInt(txValue),
          });
        await writeTxn(makeWriteWithParams);
        onChange();
      } catch (e: any) {
        console.error("⚡️ ~ file: WriteOnlyFunctionForm.tsx:handleWrite ~ error", e);
      }
    }
  };

  const [displayedTxResult, setDisplayedTxResult] = useState<TransactionReceipt>();

  const { data: txResult } = useWaitForTransactionReceipt({
    hash: result,
  });

  console.log("txResult", txResult);

  // TODO use `useMemo` to optimize also update in ReadOnlyFunctionForm
  const transformedFunction = transformAbiFunction(abiFunction);
  const inputs = transformedFunction.inputs.map((input, inputIndex) => {
    const key = getFunctionInputKey(abiFunction.name, input, inputIndex);
    return (
      <ContractInput
        key={key}
        setForm={updatedFormValue => {
          setDisplayedTxResult(undefined);
          setForm(updatedFormValue);
        }}
        form={form}
        stateObjectKey={key}
        paramType={input}
      />
    );
  });
  const zeroInputs = inputs.length === 0 && abiFunction.stateMutability !== "payable";

  return (
    <div className="py-5 space-y-3 first:pt-0 last:pb-1">
      <div className={`flex gap-3 ${zeroInputs ? "flex-row justify-between items-center" : "flex-col"}`}>
        {showInputs && inputs}
        {abiFunction.stateMutability === "payable" ? (
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center ml-2">
              <span className="text-xs font-medium mr-2 leading-none">payable value</span>
              <span className="block text-xs font-extralight leading-none">wei</span>
            </div>
            <IntegerInput
              value={txValue}
              onChange={updatedTxValue => {
                setDisplayedTxResult(undefined);
                setTxValue(updatedTxValue);
              }}
              placeholder="value (wei)"
            />
          </div>
        ) : null}
        <div className="flex justify-between gap-2">
          <div
            className={`flex ${
              writeDisabled &&
              "tooltip before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none"
            }`}
            data-tip={`${writeDisabled && "Wallet not connected or in the wrong network"}`}
          >
            <button className="btn btn-secondary" disabled={writeDisabled || isPending} onClick={handleWrite}>
              {isPending && <span className="loading loading-spinner loading-xs"></span>}
              {buttonText}
            </button>
          </div>
        </div>

        {/*displayedTxResult && <TxReceipt txResult={displayedTxResult} />*/}
      </div>
    </div>
  );
};
