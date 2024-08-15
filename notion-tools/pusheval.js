import { Api, JsonRpc } from "eosjs";
const { JsSignatureProvider } = require("eosjs/dist/eosjs-jssig");
const fetch = require("node-fetch");
const { TextEncoder, TextDecoder } = require("util");

const defaultPrivateKey =
  process.env.pkey || "5KQwrPbwdL6PhXujxW37FSSQ8hF5xwA8d3b8k5j5j5j5j5j5j5j";
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);

const rpc = new JsonRpc("http://wax.greymass.com", { fetch });
const api = new Api({
  rpc,
  signatureProvider,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder(),
});

let data = {
  minimum: 125000,
  decimals: 4,
  scaling_threshhold: 0.95,
  type: 1,
  scores: [],
}(async () => {
  try {
    const transaction = {
      actions: [
        {
          account: "guilds.oig",
          name: "pusheval",
          authorization: [
            {
              actor: "oig",
              permission: "active",
            },
          ],
          data: data,
        },
      ],
    };

    // Propose the transaction
    const proposalName = "rev" + Math.random().toString(36).substring(2, 8);
    const proposer = "user1";
    const requested = [
      { actor: "rakeden.oig", permission: "active" },
      { actor: "josep.oig", permission: "active" },
      { actor: "kaefer.oig", permission: "active" },
    ];

    const msig = {
      actions: [
        {
          account: "eosio.msig",
          name: "propose",
          authorization: [
            {
              actor: proposer,
              permission: "active",
            },
          ],
          data: {
            proposer,
            proposal_name: proposalName,
            requested,
            trx: transaction,
          },
        },
      ],
    };

    await api.transact(msig, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
  } catch (e) {
    console.log(e);
  }
})();
