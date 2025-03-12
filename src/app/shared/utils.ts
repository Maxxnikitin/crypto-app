import TonWeb from "tonweb";

export const getJettonBalance = async ({
  masterJettonAddress,
  userAddress,
  tonWebClient,
  decimals,
}: {
  masterJettonAddress: string;
  userAddress: string;
  tonWebClient: TonWeb;
  decimals: number;
}) => {
  const rawData = await tonWebClient.provider.call2(
    masterJettonAddress,
    "get_jetton_data",
    []
  );

  // Расшифровываем данные
  const [_totalSupply, _decimals, contentCell, walletCodeCell] = rawData;
  const adminAddress = rawData[4]; // Адрес администратора из master data
  const jettonContentUri = contentCell.bits.toString(); // URI контента
  const jettonWalletCodeHex = walletCodeCell.toString("hex"); // Байткод кошелька

  const jettonMinter = new TonWeb.token.jetton.JettonMinter(
    tonWebClient.provider,
    {
      address: masterJettonAddress,
      adminAddress: adminAddress,
      jettonContentUri: jettonContentUri,
      jettonWalletCodeHex: jettonWalletCodeHex,
    }
  );

  const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(
    new TonWeb.utils.Address(userAddress)
  );

  const jettonWallet = new TonWeb.token.jetton.JettonWallet(
    tonWebClient.provider,
    {
      address: jettonWalletAddress,
    }
  );

  let data;

  try {
    data = await jettonWallet.getData();
  } catch (e) {
    // если баланса по данной монете нет, то возвращается ошибка на этот запрос
    console.warn("No balance for this coin", e);
    return 0;
  }

  const balanceMinimal = data.balance.toString();

  // Преобразуем в стандартный формат
  const balanceStandard = parseFloat(balanceMinimal) / Math.pow(10, decimals);

  return balanceStandard;
};
