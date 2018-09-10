module.exports = {
     // See <http://truffleframework.com/docs/advanced/configuration>
     // to customize your Truffle configuration!
     networks: {
          ganache: {
            host: "localhost",
            port: 7545,
            network_id: "*" // Match any network id
          },
          chainskills: {
            host: "localhost",
            port: 8545,
            network_id: "4224",
            gas: 4700000
          },
          rinkeby: {
            host: "localhost", //because we're going to use our local node to deploy rhe contracts,
            port: 8545, 
            network_id: 4, //official network id for rinkeby test network
            gas: 4700000
          }
     }
};
