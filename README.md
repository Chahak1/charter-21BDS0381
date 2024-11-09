# Modular Signature Scheme Verification Algorithm

This algorithm supports flexibility with signature formats by accepting "bytes" as the signature data format and the algo is able to recognize the type of signature given and recover the signed address. It comes with a contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```
