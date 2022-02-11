import { parseUrl } from "../utils";

export const getWalletFundsInfo = async (payload) => {
  try {
    const result = await fetch(
      `http://localhost:3001/api/wallet/getFundsInfo${parseUrl(payload)} `,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await result.json();
  } catch (error) {
    console.error(error);
  }
};

export const applyWithdraw = async (payload) => {
  try {
    const result = await fetch(
      `http://localhost:3001/api/wallet/applyWithdraw`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await result.json();
  } catch (error) {
    console.error(error);
  }
};
