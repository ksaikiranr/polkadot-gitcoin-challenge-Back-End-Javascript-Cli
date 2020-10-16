//Imports
const {ApiPromise, WsProvider} = require('@polkadot/api');
//Environment
const endpoint = 'wss://rpc.polkadot.io';

async function main(){
    const args = process.argv.slice(2);
    //If no arguments are passed => Latest block
    if(args.length === 0){
        await getLatestBlock();
    }
    else{
        const search_param = args[0];
        if(search_param.startsWith('0x')){
            //Parameter passed is a hash
            console.log('Search parameter is a hash');
            await searchByHash(search_param);
        }
        else{
            //Parameter passed is a height/number
            console.log('Search parameter is a number/height');
            await searchByBlockNumber(search_param);
        }
    }
}

async function getApi(){
    // Initialise the provider to connect to the local node
    const provider = new WsProvider(endpoint);
    // Create the API and wait until ready
    const api = await ApiPromise.create({ provider });
    return api;
}

async function getLatestBlock (){
    const api = await getApi();
    const response_content = await api.rpc.chain.getBlock();
    console.log(`Latest block information: ${response_content}`)
}

async function searchByBlockNumber(blockNumber){
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
    const block = await api.rpc.chain.getBlock(blockHash);
    console.log(`Result for search by number for ${blockNumber} is ${block}`);
}

async function searchByHash(blockHash){
    const api = await getApi();
    const block = await api.rpc.chain.getBlock(blockHash);
    console.log(`Result for search by hash for ${blockHash} is ${block}`);
}

main().finally(() => process.exit(0))
      .catch(() => {
          console.log(console.error);
          process.exit(-1);
      });
