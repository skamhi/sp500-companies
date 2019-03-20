# sp500-companies

List of all S&amp;P500 Companies from Wikipedia

=====

## Installation

npm install sp500-list)

## Usage

var sp500List = require('sp500-companies');

sp500List.get().then(callback).catch((error) => onError(error));

The return type is a Promise. You can add callback using .then()

```
## Example

the following will print out the following information of all S&P500 companies:
1. Ticker
2. Company name
3. Date founded
4. Date added to S&P500 list

var sp500List = require('sp500-companies');

sp500List.get().then(list => {
    list.forEach(data => console.log(data.symbol, data.description, data.Founded, data.DateFirstAdded));
});

```

## Release History

1.0 - Upload first operational version
