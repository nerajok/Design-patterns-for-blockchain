import React from "react";
import Web3 from "web3";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { STOCK_ORACLE_ABI, STOCK_ORACLE_ADDRESS } from "./quotecontract";

const web3 = new Web3("http://localhost:8545");
const stockQuote = new web3.eth.Contract(STOCK_ORACLE_ABI,STOCK_ORACLE_ADDRESS);

function App() {
  const [stock, setStock] = React.useState("");
  const [data, setData] = React.useState({});
  const [accounts, setAccounts] = React.useState([]);
  const [price, setPrice] = React.useState(null);
  const [volume, setVolume] = React.useState(null);
  const stockDetails = (
    <div>
        {`Price: ${price}`} &nbsp; {`Volume: ${volume}`}
    </div>
  )

  React.useEffect(() => {
    const getAccounts = async () => {
      const accountsTemp = await web3.eth.getAccounts();
      setAccounts(accountsTemp);
    };
    getAccounts();
  }, []);

  React.useEffect(() => {
    const writeToContract = async () => {
      console.log(
        web3.utils.fromAscii(stock),
        Number(data["05. price"]) * 100,
        Number(data["06. volume"])
      );
      await stockQuote.methods
        .setStock(
          web3.utils.fromAscii(stock),
          Math.round(Number(data["05. price"]) * 100),
          Number(data["06. volume"])
        )
        .send({ from: accounts[0] });
      setData({});
    };

    const readFromContract = async () => {
      var retPrice = await stockQuote.methods
        .getStockPrice(web3.utils.fromAscii(stock))
        .call();
      var retVol = await stockQuote.methods
        .getStockVolume(web3.utils.fromAscii(stock))
        .call();

      setVolume(Number(retVol));
      setPrice(retPrice/100);
    };

    if (Object.keys(data).length !== 0 && stock.length !== 0) {
      writeToContract();
      setTimeout(readFromContract, 500);
    }
  }, [data, stock, accounts]);

  const getAPIdata = async () => {
    if (stock.length !== 0) {
      await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&apikey=${process.env.REACT_APP_STOCK_API_KEY}`
      )
        .then(res => res.json())
        .then(data => {
          if (data["Global Quote"]) {
            setData(data["Global Quote"]);
          }
        })
        .catch(console.log);
    }
  };

  return (
    <div className="App">
      &nbsp;
      &nbsp;
      &nbsp;
      &nbsp;
      <Form>
        <Form.Group>
          <Form.Control
            type="symbol"
            placeholder="Please input a stock symbol"
            value={stock}
            onChange={event => {setStock(event.target.value)}}
          />
        </Form.Group>
      </Form>
      <Button onClick={getAPIdata} variant="dark">Submit</Button>
      {stockDetails}
    </div>
  );
}

export default App;
