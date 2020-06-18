import React from "react";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient("http://localhost:5001");

function App() {
  const [hash, setHash] = React.useState();
  const [file, setFile] = React.useState();

  const _upload = (event) => {
    const temp = event.target.files[0];
   setFile(event.target.files[0]);
 };
 
  const _download = async () => {
    for await (const _file of ipfs.add(file)) {
     setHash(_file.path);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <input type="file" onChange={_upload}/>
        <button onClick={_download}>Load Image to IPFS</button>
        {<img src={`http://localhost:8080/ipfs/${hash}`} />}
      </header>
    </div>
  );
}


export default App;
