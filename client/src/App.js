import { useEffect, useState } from "react";

import { getWalletFundsInfo, applyWithdraw } from "./api/binance";
import { parseFunds } from "./utils";
import "./App.css";

function App() {
  const [apiCredentials, setApiCredentials] = useState({
    apiKey: "",
    apiSecret: "",
  });
  const [funds, setFunds] = useState(null);

  const [withdraw, setWithdraw] = useState({
    address: null,
    amount: null,
    coin: null,
    network: "BSC",
    response: null,
  });

  const [showWithdraw, setShowWithdraw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCredentialsChange = (field, value) =>
    setApiCredentials((prevState) => ({ ...prevState, [field]: value }));

  const handleWithdrawChange = (field, value) =>
    setWithdraw((prevState) => ({ ...prevState, [field]: value }));

  const validateWhitdraw = () =>
    !withdraw.address || !withdraw.amount || !withdraw.coin;

  const getFundAmount = (coin) => {
    if (funds && coin) {
      const amount = funds.find((item) => item.coin === coin).free;
      return amount;
    } else {
      return "0";
    }
  };

  const networkInfo = () => {
    let search = {};
    if (!funds) return null;
    funds.forEach((item) =>
      item.networkList.forEach((n) => {
        if (n.network === "BSC") {
          search = n;
        }
      })
    );
    return search;
  };

  const makeWithdraw = async () => {
    setLoading(true);
    const response = await applyWithdraw({
      apiKey: apiCredentials.apiKey,
      apiSecret: apiCredentials.apiSecret,
      coin: withdraw.coin,
      amount: withdraw.amount,
      network: withdraw.network,
      address: withdraw.address,
    });
    handleWithdrawChange("response", response);
    setLoading(false);
  };

  useEffect(() => {
    const getFunds = () => {
      if (funds) return;
      else {
        const walletFunds = async (params) => {
          setLoading(true);
          const response = await getWalletFundsInfo(params);
          const parsedFunds = parseFunds(response);
          setFunds(parsedFunds);
          setShowWithdraw(true);
          handleWithdrawChange("coin", parsedFunds[0].coin);
          setLoading(false);
        };
        walletFunds({
          apiKey: apiCredentials.apiKey,
          apiSecret: apiCredentials.apiSecret,
        });
      }
    };
    if (apiCredentials.apiKey && apiCredentials.apiSecret) {
      getFunds();
    }
  }, [apiCredentials, funds]);
  return (
    <main className="app-container">
      Prueba de Concepto - Retiros Binance
      <div className="app-form-container">
        <label htmlFor="apiKey" className="app-form-label">
          Binance API Key:
        </label>
        <input
          name="apiKey"
          type="text"
          className="app-form-input"
          onChange={(e) => handleCredentialsChange("apiKey", e.target.value)}
          value={apiCredentials.apiKey}
          autocomplete="off"
        />
        <label htmlFor="apiSecret" className="app-form-label">
          Binance API Secret:
        </label>
        <input
          name="apiSecret"
          type="text"
          className="app-form-input"
          onChange={(e) => handleCredentialsChange("apiSecret", e.target.value)}
          value={apiCredentials.apiSecret}
          autocomplete="off"
        />
        {loading && <div class="spinner"></div>}
        {showWithdraw && (
          <>
            <div className="funds-container">
              <h2>Estado de Billetera:</h2>
              {funds.map((item, index) => (
                <div className="token-list-item">
                  <span>{item.free}</span>
                  <strong>{item.coin}</strong>
                  <img
                    src={`https://cryptoicon-api.vercel.app/api/icon/${item.coin.toLowerCase()}`}
                    alt={item.name}
                    className="token-icon"
                  />
                </div>
              ))}
            </div>
            <div className="funds-container">
              <h2>Retirar Fondos:</h2>
              <div className="app-form-container">
                <div className="app-form-inline">
                  <div className="app-form-container">
                    <label htmlFor="coin" className="app-form-label">
                      Token:
                    </label>
                    <select
                      name="coin"
                      id="coin"
                      onChange={(e) =>
                        handleWithdrawChange("coin", e.target.value)
                      }
                      value={withdraw.coin}
                      className="form-select"
                    >
                      {funds.map((token, index) => (
                        <option key={token.coin} value={token.coin}>
                          {token.coin}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="app-form-container">
                    <label htmlFor="apiSecret" className="app-form-label">
                      Cantidad:
                    </label>
                    <input
                      name="amount"
                      type="number"
                      min={networkInfo().withdrawMin || "0"}
                      max={networkInfo().withdrawMax || "100"}
                      className="app-form-input"
                      onChange={(e) =>
                        handleWithdrawChange("amount", e.target.value)
                      }
                      value={withdraw.amount}
                      step={networkInfo().withdrawIntegerMultiple || "0.01"}
                    />
                    <div className="available-funds-container">
                      <span className="available-funds">
                        Disponible: {getFundAmount(withdraw.coin)}
                      </span>
                      <span className="available-funds">
                        Costo de transacción: {networkInfo().withdrawFee}
                      </span>
                    </div>
                  </div>
                </div>
                <label htmlFor="address" className="app-form-label">
                  Address:
                </label>
                <textarea
                  name="address"
                  rows="3"
                  className="app-form-input textarea"
                  placeholder="Dirección de Retiro Binance Smart Chain(BSC)..."
                  onChange={(e) =>
                    handleWithdrawChange("address", e.target.value)
                  }
                  value={withdraw.address}
                />
              </div>
              {parseFloat(getFundAmount(withdraw.coin)) <
                parseFloat(10 + parseFloat(networkInfo().withdrawFee)) && (
                <span className="insuficient-funds">Fondos Insuficientes</span>
              )}
              <button
                className="btn secondary"
                onClick={() => makeWithdraw()}
                disabled={validateWhitdraw()}
              >
                Retirar
              </button>
            </div>
          </>
        )}
        {withdraw.response && (
          <p className="withdraw-response">
            {JSON.stringify(withdraw.response)}
          </p>
        )}
      </div>
    </main>
  );
}

export default App;
