const fetch = require("cross-fetch");
const { response } = require("express");
const crypto = require("crypto");

const BINANCE_URL = "https://api.binance.com/";

const createSignatureFrom = (queryString, apiSecret) =>
  crypto.createHmac("sha256", apiSecret).update(queryString).digest("hex");

const getFundsInformation = async (req, res = response) => {
  const timestamp = Date.now();
  const apiKey = req.query.apiKey;
  const apiSecret = req.query.apiSecret;
  const signature = createSignatureFrom(`timestamp=${timestamp}`, apiSecret);
  try {
    const resp = await fetch(
      `${BINANCE_URL}sapi/v1/capital/config/getall?timestamp=${timestamp}&signature=${signature}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-MBX-APIKEY": apiKey,
        },
      }
    );

    if (resp.status >= 400) {
      throw new Error("Bad response from server");
    }

    let data = await resp.json();
    let dataWithFunds = data.filter((i) => i.free !== "0");
    let dataWithBSC = dataWithFunds.filter(
      (i) => i.networkList.find((n) => n.network === "BSC") !== undefined
    );
    res.json(dataWithBSC);
  } catch (err) {
    console.error(err);
  }
};

const withdrawal = async (req, res = response) => {
  const timestamp = Date.now();
  const apiKey = req.body.apiKey;
  const apiSecret = req.body.apiSecret;
  const coin = req.body.coin;
  const amount = req.body.amount;
  const address = req.body.address;
  const network = req.body.network;

  let query = `timestamp=${timestamp}&coin=${coin}&network=${network}&address=${address}&amount=${amount}`;
  const signature = createSignatureFrom(query, apiSecret);
  query += `&signature=${signature}`;
  console.log("body:", req.body);
  console.log("query:", query);
  try {
    const resp = await fetch(`${BINANCE_URL}sapi/v1/capital/withdraw/apply`, {
      method: "POST",
      body: query,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-MBX-APIKEY": apiKey,
      },
    });

    console.log("response:", resp);
    /*     if (resp.status >= 400) {
      throw new Error("Bad response from server");
    } */
    let data = await resp.json();
    console.log("data:", data);
    res.json(data);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getFundsInformation,
  withdrawal,
};
