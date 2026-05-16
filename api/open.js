import { ethers } from "ethers";

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

    const { txHash, player } = req.body;
    
    const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const random = Math.floor(Math.random() * 1000);
    let winAmount = "0";

    if (random < 550) winAmount = "0";          
    else if (random < 850) winAmount = "0.0001"; 
    else if (random < 950) winAmount = "0.0003"; 
    else if (random < 995) winAmount = "0.0015"; 
    else winAmount = "0.006";                   

    let payoutHash = null;

    if (parseFloat(winAmount) > 0) {
        try {
            const tx = await wallet.sendTransaction({
                to: player,
                value: ethers.parseEther(winAmount)
            });
            await tx.wait();
            payoutHash = tx.hash;
        } catch (err) {
            console.error("Erreur de paiement automatique :", err);
            return res.status(500).json({ error: "Erreur lors de l'envoi des gains." });
        }
    }

    return res.status(200).json({ winAmount, payoutHash });
}
