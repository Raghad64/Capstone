//import { AssertionError } from "assert";

// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier

var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var Verifier = artifacts.require('Verifier');

contract('SolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

let correctProof = {
                'A': ['0x26357ccd1c3f9ecb4e80f396e685195a2e041a7ba5f65302d411c39220bca251', '0x1887d364fa3c29a030876cb5682718334301bd38377c6ed3fc3448f80045b15f'],
                'B': [['0x0775a2b4a1747e013c3039d68e0b753409b24eb8c2c8888090a353d93841223a', '0x14409ef4805c40c5594e70d7a796336aef25d4ee5b9f95332276f49b65c76617'], ['0x0a76b21d33e851a8e5305b58ac9de7cc6e8d306a4c97419cefea3633220477e2', '0x06de0c61f33bbd877fa5eb8e175a26ad0ef9665e7ea96ecd573fdf19911acfad']],
                'C': ['0x2a5c6ed912aa04c9fb07ff0d6e3f22f850bb39c1ec9dde613ba24efb2ec2bd30','0x090c36ee572f23770b9fd2a0d6ef58a041c2464856d22f47b2472ea1246aa937'],
                'input': ["0x0000000000000000000000000000000000000000000000000000000000000004","0x0000000000000000000000000000000000000000000000000000000000000000"]
            }

    describe('Mint tokens with verifier', function(){
        beforeEach(async function(){
            this.Verifier = await Verifier.new({from: account_one});

            this.contract = await SolnSquareVerifier.new(Verifier.address,'token1', 'tk1', {from: account_one});
        })

        // it('Should get token balance', async function(){
        //     for(let i = 0; i < 5; i++){
        //         await this.contract.mint(accounts[5],i, "token");
        //     }

        //     let balance = await this.contract.balanceOf(accounts[5]);
        //     assert.equal(balance, 5, "Balance should return 5");
        // })

        it('Test if an ERC721 token can be minted for contract -SolnSquareVerifier', async function(){
            
            try{
                await this.contract.minNFT(account_two, 1, correctProof.A, correctProof.B, correctProof.C, correctProof.input);

            }catch(err){
                console.log(err);
            }

            let owner = await this.contract.ownerOf(1);
            assert.equal(owner, account_two, "Owner should be acc1");

            let expectedURI = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1';
            let URI = '';

            try{
                URI = await this.contract.tokenURI(1);
            }catch(err){
                console.log(err);
            }

            assert.equal(expectedURI, URI, "Token URI incorrect");

            try{
                 balance = await this.contract.balanceOf(account_two);
            }catch(err){
                console.log(err);
            }

            assert.equal(balance, 1, "Balance should return 1");
        })

        it('Test if a new solution can be added for contract - SolnSquareVerifier', async function(){
            
            let result = false;
            try{
                await this.contract.minNFT(account_two, 2, correctProof.A, correctProof.B, correctProof.C, correctProof.input);
            }catch(err){
                console.log(err);
            }

            try{
                result = await this.contract.checkSolution.call(correctProof.A, correctProof.B, correctProof.C, correctProof.input);
            }catch(err){
                console.log(err);
            }

            assert.equal(result, true, "Solution does exist");
            
        })

        it('mint a token with existed solution', async function(){
            try{
                await this.contract.minNFT(account_two, 1, correctProof.A, correctProof.B, correctProof.C, correctProof.input);
            }catch(err){
                console.log(err);
            }

            let mintAgain = true;

            try {
                await this.contract.minNFT(account_two, 1, correctProof.A, correctProof.B, correctProof.C, correctProof.input);
            } catch (err) {
             console.log(err); 
             mintAgain = false;  
            }

            assert.equal(mintAgain, false, "Solution already exist");
        });
    });
});