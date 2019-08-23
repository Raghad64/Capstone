pragma solidity >=0.4.21 <0.6.0;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./verifier.sol";


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
import "./ERC721Mintable.sol";
contract SolnSquareVerifier is CustomERC721Token{

    Verifier _verifier;

// TODO define a solutions struct that can hold an index & an address
    // struct solutions{
    //     uint256 index;
    //     address Address;
    // }

// TODO define an array of the above struct
// TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => bool) _uniqueSolutions;

// TODO Create an event to emit when a solution is added
    event SolutionAdded(bytes32 key);

    constructor(address verifierAddress, string memory name, string memory symbol) CustomERC721Token(name, symbol) public{
        _verifier = Verifier(verifierAddress);
    }



// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
    function minNFT(address to, uint256 tokenID, 
        uint[2] memory a,  
        uint[2][2] memory b, 
        uint[2] memory c,
        uint[2] memory input) public onlyOwner returns(bool){

            bytes32 key = keccak256(abi.encodePacked(a, b, c, input));

            require(!_uniqueSolutions[key], "Require a unique solution");

            bool valid = _verifier.verifyTx(
                [a[0], a[1]],
                [[b[0] [0], b[0] [1]], [b[1][0], b[1][1]]],
                [c[0], c[1]],
                [input[0], input[1]]
            );

            if(valid){
            addSolution(key);
            super.mint(to, tokenID);
            }

            return valid;
        }
        
        // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(bytes32 key) public onlyOwner{
        _uniqueSolutions[key] = true;

        emit SolutionAdded(key);
    }

    function checkSolution(uint[2] memory a,  
        uint[2][2] memory b, 
        uint[2] memory c,
        uint[2] memory input) public view onlyOwner returns(bool){

            bytes32 key = keccak256(abi.encodePacked(a,b,c,input));
            return _uniqueSolutions[key];
    }

    }


























