import {VaultNft, NftCollateralVault} from "../../types/nft/schema";
import {
    AddNftToken,
    RemoveNftToken,
    OwnershipTransferred
} from "../../types/nft/templates/NFTCollateralVault/NFTCollateralVault"

export function handleAddNftToken(event: AddNftToken): void {

    let vaultNftID = event.address.toHexString().concat("-").concat(event.params.nftContract.toHexString()).concat(event.params.tokenId.toString())
    let vaultNft = VaultNft.load(vaultNftID);
    if (vaultNft == null) {
        vaultNft = new VaultNft(vaultNftID);
        vaultNft.nftAddress = event.params.nftContract.toHexString();
        vaultNft.nft = event.params.nftContract.toHexString();
        vaultNft.vault = event.address.toHexString();
        vaultNft.tokenID = event.params.tokenId;
        vaultNft.amount = event.params.amount;
    } else {
        vaultNft.amount = vaultNft.amount.plus(event.params.amount);
    }
    vaultNft.save();

    let vault = NftCollateralVault.load(event.address.toHexString());
    vault.vaultNfts.push(vaultNftID)
    vault.save();

}

export function handleRemoveNftToken(event: RemoveNftToken): void {

    let vaultNftID = event.address.toHexString().concat("-").concat(event.params.nftContract.toHexString()).concat(event.params.tokenId.toString())
    let vaultNft = VaultNft.load(vaultNftID);
    if (vaultNft != null) {
        vaultNft.amount = vaultNft.amount.minus(event.params.amount);
    }
    vaultNft.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
    let vault = NftCollateralVault.load(event.address.toHexString());
    vault.owner=event.params.newOwner;
    vault.save()
}
