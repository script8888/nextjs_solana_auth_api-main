import Moralis from "moralis";

const config = {
  domain: process.env.APP_DOMAIN || gx.site,
  statement: "welcome to GX. sign this to confirm your identity, anon",
  uri: process.env.NEXTAUTH_URL || "http://localhost:3001",
  timeout: 60,
};

export default async function handler(req, res) {
  const { address, chain, network } = req.body;

  await Moralis.start({ apiKey: process.env.MORALIS_API });

  try {
    const message = await Moralis.Auth.requestMessage({
      chain,
      network,
      address,
      ...config,
    });
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ error });
    console.log("error from request message");
    console.error(error);
  }
}
