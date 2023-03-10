import { feature } from 'topojson';
import Map from './Components/Map/Map';
import Steps from './Components/Steps/Steps';
import './App.css';
import React, { useState,useRef } from "react";

const width = window.innerWidth;
const height = window.innerHeight;


function App() {
  const [data, setData] = useState();
  const svgRef = useRef();


  const newStateTopology = require('./data/boundries/India.json'); // NFHS5 state vector layer
  const newStateObject = newStateTopology.objects['india-state_26may'];
  let boundary = feature(newStateTopology, newStateObject)
  console.log("APP")
  return (
    <div className="App">
     <Steps setData = {setData} mapRef = {svgRef}></Steps>
     <Map boundary={boundary} data={data} width={width} height={height} svgRef={svgRef}></Map>
    </div>
  );
}

export default App;
