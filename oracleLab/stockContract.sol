pragma solidity ^0.6.0;

contract stockOracle {

	struct stock{
		uint price;
		uint volume;
	}
	
	mapping(bytes4 => stock) stockQuote;
	
	address oracleOwner;
	
	function setStock(bytes4 symbol, uint _price, uint _volume) public {
	stock memory newStock;
	newStock.price = _price;
	newStock.volume = _volume;
	stockQuote[symbol] = newStock;
	}
	
	function getStockPrice(bytes4 symbol) public view returns (uint) {
		return stockQuote[symbol].price;
	}
	
	function getStockVolume(bytes4 symbol) public view returns (uint) {
		return stockQuote[symbol].volume;
	}
	
}