import { geoMercator ,geoPath,select,min,max,extent,scaleLinear } from 'd3';
import {useEffect, useState} from 'react'
import './Map.css';
const Map = ( {boundary, width,height,data,svgRef} ) => {
    let [mapData, setMapData] = useState(boundary);

    const projection = geoMercator().fitSize([width, height], boundary);
	const pathGenerator = geoPath(projection);

    useEffect(() =>{
        if(data){
            data.forEach(d => {
                boundary.features.forEach(b =>{
                    if(b.properties.NAME2_ === d[0]){
                        b.properties.data = d[1];
                    }
                })
                setMapData(boundary)
            })
        }
    },[data,boundary])

  
    useEffect(()=>{
        const svg = select(svgRef.current);
        svg.select("*").remove();
        const g = svg.append('g');
        let c1Value  = d => d.properties.data
        const mymin = min(mapData.features,c1Value);
        const mymax = max(mapData.features,c1Value);
        const areaExtent = extent(mapData.features,d => d.properties.AREA_)
        const comp = (mymax - mymin)/3;
    
        let myColor = v =>{
            if(v){
                if(v>=mymin && v < mymin + comp)
                return 'red';
              else if(v >= mymin+comp && v<mymax-comp)
                return 'yellow';
              else if(v >= mymax-comp)
                return 'green';
            }else{
                return "white";
            }
          
          }
        let fontScale = scaleLinear().domain(areaExtent).range([16,10])

        g
        .selectAll(".polygon")
        .data(mapData.features)
        .join("path").attr("class", "polygon") 
        .attr("d" ,feature => pathGenerator(feature))
        .style("fill", d =>{
            var value = d.properties.data;
            return myColor(value);
        })

        g.selectAll("text").data(mapData.features)
        .enter().append("text")
        .text(d => d.properties.NAME2_)
        .attr("x", function(d){
            return pathGenerator.centroid(d)[0];
        })
        .attr("y", function(d){
            return  pathGenerator.centroid(d)[1];
        })
        .attr("text-anchor","middle")
        // .attr('font-size',d => fontScale(d.properties.AREA_)+"px")
        .attr('font-size',"12px")
        .attr("font-family", "sans-serif");
    },[mapData])

    return (
        // <div className='relative  w-full pb-3 pt-1 pr-3' id="svgMap" ref={componentRef}>
        <div id="svgMap">
            <svg className = "svg-map" width={width} height={height} ref={svgRef} ></svg>

        </div>
        // <div>
    )
}

export default Map;
