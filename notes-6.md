There are diff ways to initialize a proj w truffle. As we've sen before, we can simply use `truffle init` to get a working folder structure.

Here, we decide to employ a truffle feature called "Boxes" to get us started.
Boxes are basically templates to start building off of.

The box we use is found @ "https://github.com/chainskills/chainskills-box". We can import it and set it up by running `truffle unbox chainskills/chainskills-box` in an empty direcotry.

With the unboxed template, we get a similar project hierarchy: {Contracts, Migrations, Src, Test, truffle.js}
src is the file that stores our front-end application; test is the file that will hold our test-cases (to be built out later)


We can now begin.
1) Create `Chainlist.sol`, and within it a contract called ChainList. Set up this Contract to your liking.
2) As this is only our first solidity contract, we need to create a new JS Migration file: `2_deploy_contracts.js`.
    This is a mirror image of the `1_initial_migration.js` file, only loading a different contract.

Now, let's deploy the `Chainlist` contract. For developing, can either use
    A) `Ganache`      or      B) `truffle develop` through the Terminal.
    These are both "in-memory node implementations". That is an accurate and articulate definition of what they are.
    Both are set up on the Ganache Core, and so operate similarly.
    (A) has a GUI; uses 5777 as default Net ID (but that can be changed); Ganache uses 7545 as its default RPC port  (can be changed)
    (B) uses 4447 as default Net ID and 9545 as default RPC, and neither can't be changed (this will be a problem when working with MetaMask)
    So for flexibility, we will work with Ganache. When needed, we will simply sync up our Truffle COnsole to Ganache to execute code from Command Line.
We do this in the steps that follow:

3)  Open Ganache. We will use the in-memory ethereum implementation to run steps 4 & 5.

4)      `truffle migrate --network ganache`
(can avoid `--compile-all` and `--reset` commands b/c this is the 1st time we deploy it.)
Note: If you want to change something, simply re-running the above won't work. You have to either include the `--compile-all --reset` keywords or delete the /build/ that was created 1st time u ran it.

5)      `truffle console --network ganache`
Sync up terminal to chainlist so we can interact with it.

Now our console is syncronized with the Ethereum node visible on Ganache

6) We test to see if we have a Var called Chainlist and if its address matches that listed in Transactions of Ganache
        `ChainList.address`

7) Confirm that Account 0 had to pay for Gas of deploying contracts, while Account 1's didn't.
|        `web3.fromWei(web3.eth.getBalance(web3.eth.accounts[0]), "ether").toNumber()`
|        `web3.fromWei(web3.eth.getBalance(web3.eth.accounts[1]), "ether").toNumber()`

So in the above we have set up our environment (syncing up our Terminal with Ganache's GUI), tested it and imported our contract.

Now time to test our contract.

8) Before we can run the code of our deployed contract, we need to create an instance of it:
|        `ChainList.deployed().then(function(instance){app=instance});`
Note:
    A) ` ChainList `, the Truffle Smart Contract wrapper, is just a JSON object with a number of methods stored. We do a look-up when we do ChainList.deployed and then call that! `/build/ChainList.json` holds the exact same code that the  `ChainList` variable in the console does.
    B) ` app ` on the other hand, _IS_ an instance of a Truffle Contract.

9) With an instance of our Smart Contract stored in app, if we now run `app.getArticle()`, we will get the desired behavior. In this case, we will see a list of 0's and Nones: those are just the initial vals of our vars
Note: Price is represented as  `Big Number`; which is a larger number than JS can natively represent.

10) Similarly, we can also call other functions, such as:
|       `app.sellArticle("iPhone 7", "Selling bc Horriya", web3.toWei(3, "ether"), {from: web3.eth.accounts[1]})`
Though the function only takes 3 arguments, we provide a 4th which is a  _Transaction Argument_; it specifies _who is going to pay for the GAS_

To test that the transaction was completed, run below and expect the response to be different:
|       `app.getArticle()`

Finally, note that Account 1 had to pay for the Ether.
|        `web3.fromWei(web3.eth.getBalance(web3.eth.accounts[1]), "ether").toNumber()`

Once deployed, in the spirit of immutability, a Smart Contract's code can not be altered, even if it has bugs. Best bet is to _disable_ it, then create a new Smart Contract with its own address & a new state. We haven't learned how to disable yet though.

Therefore, its CRUCIAL to test your Smart Contracts thoroughly before deploying them to the production environment.
There are several environments that can be used:
(1) Truffle Develop and Ganache are good for rapid prototyping
(2) Can use Geth to create a private Ethereum network to check your solution on the same node implementation as the one used in Prod; Geth is the most widely used Ethereum implementation.
    Note: this would mean following the process we did in the /private/ folder at the start of this course. It would also mean instantiating our own nodes
(3) Can also use a public test net like Robston or Rinkeby; this also gives you ability to share addreess of the contract with other testers.

Truffle ships in with a good Testing framework.
Can test it with JS from client-side; Or Solidity to test it within the BC by simulating another contract interacting with yours. But testing with Solidity is quite new, and not that documented, so the course will focus on JS.

** Testing is a lot more critical on the BC than on many other environments since they (1) encode value; (2) are immutable; (3) are a relatively new technolgogy w/o many of the sophisticated debugging mechanisms we rely on; (4)don't have a formal official verification process of yet.

Truffle integrates:
    (1) Mocha (MochaJS.org) as a Javascript Testing Framework
    (2) Chai (chaijs.com): a BDD assertion library.

Testing structure will be composed of a Test Suite containing several test-cases to run.
Truffle contract abstraction that Truffle wraps around our Truffle instance will help us test async requests.

So now, let's write some tests.
    1) Create a file in /test/ directory "ChainListHappyPath.js", whih will be test suite used to run all test cases for the Happy Path scenario
    2) Populate it with tests. For our purposes, comments have been integrated into the test-suite code, explaining what we do.
    3) To execute it, go to  Terminal and run:
        `truffle test --network ganache`
        This function recompiles your contracts even if they didnt change since last time, deploys them to ganache, and then runs all the tests.

Our WebApp will interact with Ethereum uisng Web3.JS to connect to our local node. This local node has a certain # of local wallets in its key store.

-------------------

Once satisfied with our tests, we can move on to building a Front End App; after all, users won't want to interact via the Terminal.

1) Bring in `index.html` from their github; this isn't an FE Course and so we just use a template.
2) In `app.js`, set some dummy data using JQuery to prove that we are able to manipulate data on the DOM.
Next, we need to swap out our dummy data for actual Blockchain data.

 So how do we sync up Web FrontEnd with Contract Backend to display the artiles stores in the contract state?

3) Start Ganache 
4) `truffle migrate --compile-all --reset --network ganache`. Confirm its done by having the build class.
Note, the JSON files contains useful info that is useful to instantiate the Trfufle contract abstraction that we will interact with in the web front end.
5) Open brwoser & disable Metamask extension; (we are going to communicate directly with our node w/o the help of a Metmask as our 1st step.)

 Our goal is specifically to replace all hard-coded data with authentic data from the smart contracts. To communicate with the contract, we need ot use Web3.JS. Web3JS is a JS library used as a connector between your Front End app and the Ethereum Node. To establish this link, it is required to bind Web3 to a provider. If you open the FE with Metamask enabled, an instance of Web3 will be automatically injected into your web page. In all other situations you will have to define the address of the HTTP provider hosting your Ethereum node.
 
 Therefore our 6th step is to:

6) Adapt `app.js` to create an instance of Web3, or re-use an existing one if someone has already created an instance. This code is specified in `initWeb3()`, which is called by `init`. Once we have an instance of `web3`, we can do two things: (1) We can get the account info; (2) We can get the contract info. And because these two do not depend on one another, we can do them simultaneously.
Displaying Account Info is straight-forward. Getting the contract info is more complicated; to do so, we have to: (1) Load up the contract's JSON file, which we will use to (2) Create a Truffle Contract instance of it. We then (3) Put it in communication with the DOM on web3, and then (4) interact with it and display the findings to the Front End.

7) Next we set up Sell an Article to call the correct function by setting it so in Index HTML and Creating the `sellArticle` function in app.js


-------------------------------
Well, now that we have finished that demo, how about we configure MetaMask to this too!?
MetaMask gives us flexibiltiy so switch between different accounts to interact with our contract.

1) Open Ganache; Migrate; set-up Dev Server (the 3 usual steps)
2) Re-activate MetaMask in the Chrome Browser
3) Switch to private network runinng on 7545, our Ganache Node.

--------------------------------

To watch the Sell Article Event exposed by the contract, we run the following:

<!--                            First one is filter; 2nd one is range           Call when a new event is intercepted. -->
<!-- Run in Truffle Console.  -->
var sellEvent = app.LogSellArticle({}, {fromBlock:0, toBlock:'latest'}).watch(function(error, event) {console.log(event);})

app.sellArticle("article 1", "Description of article 1", web3.toWei(10, "ether"), {from: web3.eth.accounts[1]});

sellEvent.stopWatching()
app.sellArticle("article 1", "Description of article 1", web3.toWei(10, "ether"), {from: web3.eth.accounts[1]});

var sellEvent = app.LogSellArticle({}, {fromBlock:0, toBlock:'latest'}).watch(function(error, event) {console.log(event);})
var sellEvent = app.LogSellArticle({}, {}).watch(function(error, event) {console.log(event);})
app.sellArticle("article 1", "Description of article 1", web3.toWei(10, "ether"), {from: web3.eth.accounts[1]});



----------------------------------
Ok. So, we just did a lot of work with MetaMask. Let's summarize what we did and what we learned.
Basically, we followed a 3-step-model: (1) Build feature in contract; (2) Test it using Ganache & Test Suite; (3) Build FE for it.
Some key insights: Using MetaMask allows you to switch between accounts.
"Event"s are things you can subscribe to to "listen" to particular actions. In that way, its like Angular's Observables and Subjects.
They are easy to configure in the contract, and then they are subscribed to in the app.js function, but can also be subscribed to in the Console. The first argument is the filter {}, the second is the range of Blocks you want to watch. It also takes a callback. `.watch`.

MetaMask is pretty buggy and anoying to work with. If it gives you a `nonce not working` error, then simply change the Network ID of your Ganache module; since our truffle.js is configured to look for "*" network ID we don't need to change it there. And then, referesh the "Network"/"RPC endpoint" of the MetaMask module by moving it away and back.

ITs also worth notung that when we change Accts on Metamask we have to refresh the page. ITs not ideal.


