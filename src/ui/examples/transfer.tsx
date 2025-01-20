'use client';

import { skipToken } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { ComponentProps, FC, useEffect, useState } from 'react';
import { isAddress } from 'viem';
import { ChainId } from '@/configs/chains';
import { wethAddresses } from '@/configs/tokens';
import { useBalance, useDecimals, useSymbol, useTransfer } from '@/lib/hooks/tokens';
import { accountAtom, chainIdAtom } from '@/lib/states/evm';
import { formatNumber } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/shadcn';
import { Button } from '@/ui/shadcn/button';
import { Input } from '@/ui/shadcn/input';

export const Transfer: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const chainId = useAtomValue(chainIdAtom);

  const account = useAtomValue(accountAtom);

  const [tokenChainId, setTokenChainId] = useState<ChainId | null>(null);

  const [token, setToken] = useState('');

  const changeToken = (text: string) => {
    setTokenChainId(chainId);
    setToken(text);
  };

  const { data: balance } = useBalance(
    chainId === tokenChainId && account != null && isAddress(token)
      ? { chainId, address: token, account }
      : skipToken,
  );

  const { data: symbol } = useSymbol(
    chainId === tokenChainId && isAddress(token) ? { chainId, address: token } : skipToken,
  );

  const { data: decimals } = useDecimals(
    chainId === tokenChainId && isAddress(token) ? { chainId, address: token } : skipToken,
  );

  const [to, setTo] = useState('');

  const [amount, setAmount] = useState('');

  const { mutateAsync: mutationTransfer, isPending: transfering } = useTransfer();

  const transfer = async () => {
    if (
      chainId === tokenChainId &&
      account != null &&
      isAddress(token) &&
      decimals != null &&
      isAddress(to) &&
      amount !== ''
    ) {
      await mutationTransfer({ chainId, address: token, account, decimals, to, amount });
    }
  };

  useEffect(() => {
    setTokenChainId(chainId);
    setToken(wethAddresses[chainId]);
  }, [chainId]);

  return (
    <div
      className={cn('grid w-[40rem] grid-cols-[auto_1fr] items-center gap-4', className)}
      {...props}
    >
      <div>Account:</div>
      <div>{account}</div>

      <div>Token:</div>
      <Input value={token} onChange={event => changeToken(event.target.value)} />

      <div>Balance:</div>
      <div>
        {formatNumber(balance)} {symbol}
      </div>

      <div>To:</div>
      <Input value={to} onChange={event => setTo(event.target.value)} />

      <div>Amount:</div>
      <Input value={amount} onChange={event => setAmount(event.target.value)} />

      <Button className="col-span-2 place-self-start" loading={transfering} onClick={transfer}>
        Send
      </Button>
    </div>
  );
};
