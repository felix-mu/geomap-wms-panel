import { register } from "ol/proj/proj4";
import proj4 from "proj4";

export function getFirstDirectChildNodeByLocalName(childNodes: NodeListOf<ChildNode>, localNodeName: string): any {
    for (let childNode of childNodes) {
      if (childNode.nodeName === localNodeName) {
        return childNode;
      }
    }
    return undefined;
  }
  
  export function getAllDirectChildNodesByLocalName(childNodes: NodeListOf<ChildNode>, localNodeName: string): ChildNode[] {
    let childNodesList = [];
    for (let childNode of childNodes) {
      if (childNode.nodeName === localNodeName) {
        childNodesList.push(childNode);
      }
    }
    return childNodesList;
  }
  
  export async function getProjDefinition(urlAsString: URL): Promise<string> {
    const response = await fetch(urlAsString);
    const projDef = await response.text();
    return projDef;
  }
  
  export async function getWMSCapabilitiesFromService(url: string): Promise<Node> {
    // console.log(url);
    const wmsCapabilitesURL = new URL(url);
    wmsCapabilitesURL.search = "?service=WMS&request=GetCapabilities";
    // console.log(url);
  
      const responseCapabilities = await fetch(wmsCapabilitesURL);
      const xmlCapabilities = await responseCapabilities.text();
      // console.log(xmlCapabilities);
  
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlCapabilities, "text/xml");
      // console.log(xmlDoc);
  
    const capabilityNode = xmlDoc.documentElement.getElementsByTagName("Capability")[0];
  
    return capabilityNode;
  }
  
  export async function getProjection(capabilityNode: Node): Promise<string | undefined> {
    const defaultOpenlayersEPSGCode = "EPSG:3857";
    let layerNode_parent = getFirstDirectChildNodeByLocalName(capabilityNode.childNodes, "Layer");
  
    const epsgIOBaseURL = "https://epsg.io/";
    const epsgCodes: { [epsg: string]: URL } = {};
    try {
      getAllDirectChildNodesByLocalName(layerNode_parent.childNodes, "CRS").forEach(
        (element) => {
          let epsgCode = element.textContent === null ? "" : element.textContent;
    
          // Skip if the prefix is e.g. CRS:
          if (epsgCode.split(":")[0] !== "EPSG") {
            return;
          }
          
          return epsgCodes[epsgCode] = new URL(`${epsgCode.split(":").slice(-1)}.proj4`, epsgIOBaseURL);
        }
      );
    } catch (error) {
      
    }
  
    // console.log(epsgCodes);
  
    let proj4String = undefined; // If this stays undefined no transformation is needed since WMS supports the default CRS
    
    if (typeof epsgCodes[defaultOpenlayersEPSGCode] === 'undefined') {
      // Take first entry of EPSG codes
      proj4String = await getProjDefinition(epsgCodes[Object.keys(epsgCodes)[0]]);
    }
  
    // console.log(proj4String);
  
    if (typeof proj4String !== 'undefined') {
      const firstEPSGCode = Object.keys(epsgCodes)[0];
      proj4.defs(
        firstEPSGCode,
        proj4String
      );
      register(proj4);
      return firstEPSGCode;
    } else {
      return defaultOpenlayersEPSGCode; 
    }
  }
  
  export function getWMSLayers(capaNode: Node) {
    let layers = [];
    let layerNodes = (capaNode as Element).getElementsByTagName("Layer");
    // Traverse through layers and add selection options to optBuilder
    for (let layer of layerNodes) {
      let layerTitleNode = getFirstDirectChildNodeByLocalName(layer.childNodes, "Title");
      let layerNameNode = getFirstDirectChildNodeByLocalName(layer.childNodes, "Name");
  
      if (layerNameNode === undefined) {
        continue;
      };
      
      let layerTitle = layerTitleNode !== undefined ? layerTitleNode.textContent : layerNameNode.textContent;
      let layerName = layerNameNode.textContent;
  
      layers.push(
        {
          value: layerName,
          label: layerTitle
        }
      );
      
    }
  
    return layers;
  }

export function getWMSGetLegendURL(wmsCapaNode: Node, layerName: string): string | undefined {
  if (wmsCapaNode === undefined) {
    throw new Error("wms capabilities node is undefined");
  }
  if (layerName === undefined) {
    throw new Error("wms layer name capabilities node is undefined");
  }
      let layerNodes = (wmsCapaNode as Element).getElementsByTagName("Layer");
    // Traverse through layers and add selection options to optBuilder
    for (let layer of layerNodes) {
      let layerNameNode = getFirstDirectChildNodeByLocalName(layer.childNodes, "Name");
  
      if (layerNameNode === undefined) {
        continue;
      };

      if (layerNameNode.textContent !== layerName) {
        continue;
      }

      const onlineResource = layer.querySelector("Style LegendURL OnlineResource ");
      if (onlineResource !== null && onlineResource.textContent !== null) {
        return onlineResource.getAttribute("xlink:href") ?? undefined;
      }
      return undefined;
    }
  
  return undefined;
}
