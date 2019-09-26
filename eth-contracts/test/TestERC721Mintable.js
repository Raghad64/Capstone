//import { AssertionError } from "assert";

var ERC721MintableComplete = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {
    

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new('Token2', 'tk2',{from: account_one});

            // TODO: mint multiple tokens
            for(let i = 5; i < 15; i++){
                await this.contract.mint(accounts[i], i);
            }
        })

        it('should return total supply', async function () { 
            //Something is wrong here 
            // "before each" hook for "should return total supply":
     //Error: invalid address (arg="to", coderType="address", value=undefined)
            try{
            let totalSupply = await this.contract.totalSupply();
            }catch(err){
                console.log(err);
            }
            assert.equal(10, totalSupply, "Total supply should return 10");
            
        })

        it('should get token balance', async function () { 
            let balance = await this.contract.balanceOf(accounts[5]);
            assertError.equal(balance, 1, "Balance should return 1");
            
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 

            let tokenUri = await this.contract.tokenURI(5);//, {from: account_one});
            assert.equal("https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/5", tokenUri, "Token URI is incorrect");
            
        })

        it('should transfer token from one owner to another', async function () { 
            let tokenOwner = await this.contract.ownerOf(6);
            let err = false;
            assert.equal(tokenOwner, accounts[6], "Incorrect owner");

            await this.contract.transferFrom(accounts[6], accounts[7], 6, {from: accounts[6]});
            assert.equal(tokenOwner, accounts[7], "Incorrect owner")
            
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new('Token3', 'tk3',{from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let allowed = true;
            try{
                await this.contract.mint(account_one, 1, {from: account_two});
            }catch(err){
                //console.log(err);
                allowed = false;
            }
            assert.equal(allowed, false, "Only contract owner can mint this token");
            
        })

        it('should return contract owner', async function () { 
            let contractOwner = await this.contract.getOwner();
            assert.equal(contractOwner, account_one, "Incorrect owner");
            
        })

    });
})