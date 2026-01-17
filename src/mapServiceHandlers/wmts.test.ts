import {expect, jest, test} from '@jest/globals';
import { addCustomParametersToWMTSOptionsURLs, getWMTSCapabilitiesFromService, getWMTSLayers, getWMTSLegendURLForLayer, registerCRSInProj4, removeQueryParameters } from "./wmts";
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import { get } from 'ol/proj';
import { Options } from 'ol/source/WMTS';

const capabilitiesXMLDocument = `
<Capabilities xmlns="http://www.opengis.net/wmts/1.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:gml="http://www.opengis.net/gml" xsi:schemaLocation="http://www.opengis.net/wmts/1.0 http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd" version="1.0.0">
<ows:ServiceIdentification>
<ows:Title>WMTS TopPlusOpen</ows:Title>
<ows:Abstract>Darstellungsdienst (WMTS) für eine frei nutzbare weltweite einheitliche Webkarte auf der Basis von freien und amtlichen Datenquellen. In dem Produkt werden unter anderem freie amtliche Geodaten des Bundes und der Open-Data-Länder Berlin, Brandenburg, Hamburg, Hessen, Nordrhein-Westfalen, Sachsen, Sachsen-Anhalt, Schleswig-Holstein und Thüringen präsentiert. Darüber hinaus stellen Mecklenburg-Vorpommern und Rheinland-Pfalz im Rahmen eines Kooperationsvertrages ihre amtlichen Geodaten für die TopPlusOpen zur Verfügung, sodass auch diese Länder ausschließlich durch amtliche Daten dargestellt werden. In den übrigen Bundesländern und im Ausland werden in den entsprechenden Zoomstufen im Wesentlichen OSM-Daten verwendet, die aus Sicht des BKG alle Qualitätsansprüche erfüllen und sich beinahe nahtlos mit den amtlichen Daten kombinieren lassen. Die Webdienste der TopPlusOpen werden über die standardisierte Schnittstellen WMS und WMTS angeboten und sind hoch performant. Es werden 4 verschiedene Varianten angeboten: - TopPlusOpen: Inhaltlich sehr detailreiche Kartendarstellung in Volltonfarben - TopPlusOpen Graustufen: Inhaltlich identisch mit der Volltonvariante; automatisch generierte Graustufen - TopPlusOpen Light: Gegenüber der Volltonvariante reduzierter Inhalt; Dezente Farbgebung - TopPlusOpen Light Grau: Inhaltlich identisch mit der TopPlusOpen Light; Darstellung in Grautönen und einzelnen dezenten Farben (Gewässer, Grenzen) Die TopPlusOpen-Webkarte wird in zwei Projektionen produziert: - Pseudo-Mercator-Projektion (EPSG:3857) - UTM32 (EPSG:25832) Pseudo-Mercator-Projektion: Die Webkarte verfügt in dieser Projektion über 19 Maßstabsstufen und ist in drei unterschiedliche Darstellungsbereiche unterteilt: - Weltweite Darstellung für kleine Maßstäbe - europaweite Darstellung für mittlere Maßstäbe - Detaildarstellung für Deutschland und das angrenzende Ausland Projektion UTM32: Die Webkarte verfügt in dieser Projektion über 14 Maßstabsstufen und ist in zwei Darstellungsbereiche unterteilt: - europaweite Darstellung für mittlere Maßstäbe - Detaildarstellung für Deutschland und das angrenzende Ausland </ows:Abstract>
<ows:ServiceType>OGC WMTS</ows:ServiceType>
<ows:ServiceTypeVersion>1.0.0</ows:ServiceTypeVersion>
<ows:Fees>Die Daten sind urheberrechtlich geschützt. Die Daten werden geldleistungsfrei gemäß der Datenlizenz Deutschland Namensnennung 2.0 (https://www.govdata.de/dl-de/by-2-0) zur Verfügung gestellt. Die Verwendung des Datensatzes für die Pflege und Erweiterung der Daten des OpenStreetMap Projektes wird unter Einhaltung der im Ergänzungstext beschriebenen Angaben zur Namensnennung ausdrücklich erlaubt, siehe https://sg.geodatenzentrum.de/web_public/gdz/lizenz/deu/Datenlizenz_Deutschland_Erg%C3%A4nzungstext_Namensnennung.pdf. Der Quellenvermerk ist zu beachten. || Quellenvermerk: Kartendarstellung: © BKG (Jahr des letzten Datenbezugs) dl-de/by-2-0, Datenquellen: https://sg.geodatenzentrum.de/web_public/gdz/datenquellen/datenquellen_topplusopen.html </ows:Fees>
<ows:AccessConstraints>Es gelten keine Zugriffsbeschränkungen </ows:AccessConstraints>
</ows:ServiceIdentification>
<ows:ServiceProvider>
<ows:ProviderName>Dienstleistungszentrum des Bundes für Geoinformation und Geodäsie</ows:ProviderName>
<ows:ProviderSite xlink:href="http://www.geodatenzentrum.de"/>
<ows:ServiceContact>
<ows:IndividualName/>
<ows:PositionName>Technischer Administrator</ows:PositionName>
<ows:ContactInfo>
<ows:Phone>
<ows:Voice>+49 (0) 341 5634 333</ows:Voice>
<ows:Facsimile>+49 (0) 341 5634 415</ows:Facsimile>
</ows:Phone>
<ows:Address>
<ows:DeliveryPoint>Dienstleistungszentrum des Bundes für Geoinformation und Geodäsie</ows:DeliveryPoint>
<ows:City>Leipzig</ows:City>
<ows:PostalCode>04105</ows:PostalCode>
<ows:Country>Deutschland</ows:Country>
<ows:ElectronicMailAddress>dlz@bkg.bund.de</ows:ElectronicMailAddress>
</ows:Address>
</ows:ContactInfo>
</ows:ServiceContact>
</ows:ServiceProvider>
<Contents>
<Layer>
<ows:Title>TopPlusOpen</ows:Title>
<ows:Abstract/>
<ows:WGS84BoundingBox>
<ows:LowerCorner>-180.0 -85.0511287798066</ows:LowerCorner>
<ows:UpperCorner>180.0 85.0511287798066</ows:UpperCorner>
</ows:WGS84BoundingBox>
<ows:Identifier>web</ows:Identifier>
<Style>
<ows:Identifier>default</ows:Identifier>
<LegendURL format="image/png" xlink:href="https://sgx.geodatenzentrum.de/wmts_topplus_open/legend/web.png"/>
</Style>
<Format>image/png</Format>
<TileMatrixSetLink>
<TileMatrixSet>WEBMERCATOR</TileMatrixSet>
</TileMatrixSetLink>
<TileMatrixSetLink>
<TileMatrixSet>EU_EPSG_25832_TOPPLUS</TileMatrixSet>
</TileMatrixSetLink>
<ResourceURL format="image/png" resourceType="tile" template="https://sgx.geodatenzentrum.de/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"/>
</Layer>
<Layer>
<ows:Title>TopPlusOpen Graustufen</ows:Title>
<ows:Abstract/>
<ows:WGS84BoundingBox>
<ows:LowerCorner>-180.0 -85.0511287798066</ows:LowerCorner>
<ows:UpperCorner>180.0 85.0511287798066</ows:UpperCorner>
</ows:WGS84BoundingBox>
<ows:Identifier>web_grau</ows:Identifier>
<Style>
<ows:Identifier>default</ows:Identifier>
<LegendURL format="image/png" xlink:href="https://sgx.geodatenzentrum.de/wmts_topplus_open/legend/web_grau.png"/>
</Style>
<Format>image/png</Format>
<TileMatrixSetLink>
<TileMatrixSet>WEBMERCATOR</TileMatrixSet>
</TileMatrixSetLink>
<TileMatrixSetLink>
<TileMatrixSet>EU_EPSG_25832_TOPPLUS</TileMatrixSet>
</TileMatrixSetLink>
<ResourceURL format="image/png" resourceType="tile" template="https://sgx.geodatenzentrum.de/wmts_topplus_open/tile/1.0.0/web_grau/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"/>
</Layer>
<Layer>
<ows:Title>TopPlusOpen (Upscale)</ows:Title>
<ows:Abstract/>
<ows:WGS84BoundingBox>
<ows:LowerCorner>-180.0 -85.0511287798066</ows:LowerCorner>
<ows:UpperCorner>180.0 85.0511287798066</ows:UpperCorner>
</ows:WGS84BoundingBox>
<ows:Identifier>web_scale</ows:Identifier>
<Style>
<ows:Identifier>default</ows:Identifier>
<LegendURL format="image/png" xlink:href="https://sgx.geodatenzentrum.de/wmts_topplus_open/legend/web_scale.png"/>
</Style>
<Format>image/png</Format>
<TileMatrixSetLink>
<TileMatrixSet>WEBMERCATOR</TileMatrixSet>
</TileMatrixSetLink>
<TileMatrixSetLink>
<TileMatrixSet>EU_EPSG_25832_TOPPLUS</TileMatrixSet>
</TileMatrixSetLink>
<ResourceURL format="image/png" resourceType="tile" template="https://sgx.geodatenzentrum.de/wmts_topplus_open/tile/1.0.0/web_scale/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"/>
</Layer>
<Layer>
<ows:Title>TopPlusOpen Graustufen (Upscale)</ows:Title>
<ows:Abstract/>
<ows:WGS84BoundingBox>
<ows:LowerCorner>-180.0 -85.0511287798066</ows:LowerCorner>
<ows:UpperCorner>180.0 85.0511287798066</ows:UpperCorner>
</ows:WGS84BoundingBox>
<ows:Identifier>web_scale_grau</ows:Identifier>
<Style>
<ows:Identifier>default</ows:Identifier>
<LegendURL format="image/png" xlink:href="https://sgx.geodatenzentrum.de/wmts_topplus_open/legend/web_scale_grau.png"/>
</Style>
<Format>image/png</Format>
<TileMatrixSetLink>
<TileMatrixSet>WEBMERCATOR</TileMatrixSet>
</TileMatrixSetLink>
<TileMatrixSetLink>
<TileMatrixSet>EU_EPSG_25832_TOPPLUS</TileMatrixSet>
</TileMatrixSetLink>
<ResourceURL format="image/png" resourceType="tile" template="https://sgx.geodatenzentrum.de/wmts_topplus_open/tile/1.0.0/web_scale_grau/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"/>
</Layer>
<Layer>
<ows:Title>TopPlusOpen Light</ows:Title>
<ows:Abstract/>
<ows:WGS84BoundingBox>
<ows:LowerCorner>-180.0 -85.0511287798066</ows:LowerCorner>
<ows:UpperCorner>180.0 85.0511287798066</ows:UpperCorner>
</ows:WGS84BoundingBox>
<ows:Identifier>web_light</ows:Identifier>
<Style>
<ows:Identifier>default</ows:Identifier>
<LegendURL format="image/png" xlink:href="https://sgx.geodatenzentrum.de/wmts_topplus_open/legend/web_light.png"/>
</Style>
<Format>image/png</Format>
<TileMatrixSetLink>
<TileMatrixSet>WEBMERCATOR</TileMatrixSet>
</TileMatrixSetLink>
<TileMatrixSetLink>
<TileMatrixSet>EU_EPSG_25832_TOPPLUS</TileMatrixSet>
</TileMatrixSetLink>
<ResourceURL format="image/png" resourceType="tile" template="https://sgx.geodatenzentrum.de/wmts_topplus_open/tile/1.0.0/web_light/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"/>
</Layer>
<Layer>
<ows:Title>TopPlusOpen Light Grau</ows:Title>
<ows:Abstract/>
<ows:WGS84BoundingBox>
<ows:LowerCorner>-180.0 -85.0511287798066</ows:LowerCorner>
<ows:UpperCorner>180.0 85.0511287798066</ows:UpperCorner>
</ows:WGS84BoundingBox>
<ows:Identifier>web_light_grau</ows:Identifier>
<Style>
<ows:Identifier>default</ows:Identifier>
<LegendURL format="image/png" xlink:href="https://sgx.geodatenzentrum.de/wmts_topplus_open/legend/web_light_grau.png"/>
</Style>
<Format>image/png</Format>
<TileMatrixSetLink>
<TileMatrixSet>WEBMERCATOR</TileMatrixSet>
</TileMatrixSetLink>
<TileMatrixSetLink>
<TileMatrixSet>EU_EPSG_25832_TOPPLUS</TileMatrixSet>
</TileMatrixSetLink>
<ResourceURL format="image/png" resourceType="tile" template="https://sgx.geodatenzentrum.de/wmts_topplus_open/tile/1.0.0/web_light_grau/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"/>
</Layer>
<TileMatrixSet>
<ows:Identifier>WEBMERCATOR</ows:Identifier>
<ows:SupportedCRS>EPSG:3857</ows:SupportedCRS>
<TileMatrix>
<ows:Identifier>00</ows:Identifier>
<ScaleDenominator>559082264.0287176</ScaleDenominator>
<TopLeftCorner>-20037508.342789244 20037508.342789244</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>1</MatrixWidth>
<MatrixHeight>1</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>01</ows:Identifier>
<ScaleDenominator>279541132.0143588</ScaleDenominator>
<TopLeftCorner>-20037508.342789244 20037508.342789244</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>2</MatrixWidth>
<MatrixHeight>2</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>02</ows:Identifier>
<ScaleDenominator>139770566.0071794</ScaleDenominator>
<TopLeftCorner>-20037508.342789244 20037508.342789244</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>4</MatrixWidth>
<MatrixHeight>4</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>03</ows:Identifier>
<ScaleDenominator>69885283.0035897</ScaleDenominator>
<TopLeftCorner>-20037508.342789244 20037508.342789244</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>8</MatrixWidth>
<MatrixHeight>8</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>04</ows:Identifier>
<ScaleDenominator>34942641.50179485</ScaleDenominator>
<TopLeftCorner>-20037508.342789244 20037508.342789244</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>16</MatrixWidth>
<MatrixHeight>16</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>05</ows:Identifier>
<ScaleDenominator>17471320.750897426</ScaleDenominator>
<TopLeftCorner>-20037508.342789244 20037508.342789244</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>32</MatrixWidth>
<MatrixHeight>32</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>06</ows:Identifier>
<ScaleDenominator>8735660.375448713</ScaleDenominator>
<TopLeftCorner>-20037508.342789244 20037508.342789244</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>64</MatrixWidth>
<MatrixHeight>64</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>07</ows:Identifier>
<ScaleDenominator>4367830.187724357</ScaleDenominator>
<TopLeftCorner>-20037508.342789244 20037508.342789244</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>128</MatrixWidth>
<MatrixHeight>128</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>08</ows:Identifier>
<ScaleDenominator>2183915.0938621783</ScaleDenominator>
<TopLeftCorner>-20037508.342789244 20037508.342789244</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>256</MatrixWidth>
<MatrixHeight>256</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>09</ows:Identifier>
<ScaleDenominator>1091957.5469310891</ScaleDenominator>
<TopLeftCorner>-20037508.342789244 20037508.342789244</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>512</MatrixWidth>
<MatrixHeight>512</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>10</ows:Identifier>
<ScaleDenominator>545978.7734655446</ScaleDenominator>
<TopLeftCorner>-20037508.342789244 20037508.342789244</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>1024</MatrixWidth>
<MatrixHeight>1024</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>11</ows:Identifier>
<ScaleDenominator>272989.3867327723</ScaleDenominator>
<TopLeftCorner>-20037508.342789244 20037508.342789244</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>2048</MatrixWidth>
<MatrixHeight>2048</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>12</ows:Identifier>
<ScaleDenominator>136494.69336638614</ScaleDenominator>
<TopLeftCorner>-20037508.342789244 20037508.342789244</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>4096</MatrixWidth>
<MatrixHeight>4096</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>13</ows:Identifier>
<ScaleDenominator>68247.34668319307</ScaleDenominator>
<TopLeftCorner>-20037508.342789244 20037508.342789244</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>8192</MatrixWidth>
<MatrixHeight>8192</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>14</ows:Identifier>
<ScaleDenominator>34123.673341596535</ScaleDenominator>
<TopLeftCorner>-20037508.342789244 20037508.342789244</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>16384</MatrixWidth>
<MatrixHeight>16384</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>15</ows:Identifier>
<ScaleDenominator>17061.836670798268</ScaleDenominator>
<TopLeftCorner>-20037508.342789244 20037508.342789244</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>32768</MatrixWidth>
<MatrixHeight>32768</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>16</ows:Identifier>
<ScaleDenominator>8530.918335399134</ScaleDenominator>
<TopLeftCorner>-20037508.342789244 20037508.342789244</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>65536</MatrixWidth>
<MatrixHeight>65536</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>17</ows:Identifier>
<ScaleDenominator>4265.459167699567</ScaleDenominator>
<TopLeftCorner>-20037508.342789244 20037508.342789244</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>131072</MatrixWidth>
<MatrixHeight>131072</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>18</ows:Identifier>
<ScaleDenominator>2132.7295838497835</ScaleDenominator>
<TopLeftCorner>-20037508.342789244 20037508.342789244</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>262144</MatrixWidth>
<MatrixHeight>262144</MatrixHeight>
</TileMatrix>
</TileMatrixSet>
<TileMatrixSet>
<ows:Identifier>EU_EPSG_25832_TOPPLUS</ows:Identifier>
<ows:SupportedCRS>EPSG:25832</ows:SupportedCRS>
<TileMatrix>
<ows:Identifier>00</ows:Identifier>
<ScaleDenominator>17471320.750897426</ScaleDenominator>
<TopLeftCorner>-3803165.98427299 8805908.08284866</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>6</MatrixWidth>
<MatrixHeight>5</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>01</ows:Identifier>
<ScaleDenominator>8735660.375448713</ScaleDenominator>
<TopLeftCorner>-3803165.98427299 8805908.08284866</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>12</MatrixWidth>
<MatrixHeight>10</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>02</ows:Identifier>
<ScaleDenominator>4367830.187724357</ScaleDenominator>
<TopLeftCorner>-3803165.98427299 8805908.08284866</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>24</MatrixWidth>
<MatrixHeight>20</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>03</ows:Identifier>
<ScaleDenominator>2183915.0938621783</ScaleDenominator>
<TopLeftCorner>-3803165.98427299 8805908.08284866</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>48</MatrixWidth>
<MatrixHeight>40</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>04</ows:Identifier>
<ScaleDenominator>1091957.5469310891</ScaleDenominator>
<TopLeftCorner>-3803165.98427299 8805908.08284866</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>96</MatrixWidth>
<MatrixHeight>80</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>05</ows:Identifier>
<ScaleDenominator>545978.7734655463</ScaleDenominator>
<TopLeftCorner>-3803165.98427299 8805908.08284866</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>192</MatrixWidth>
<MatrixHeight>160</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>06</ows:Identifier>
<ScaleDenominator>272989.38673277246</ScaleDenominator>
<TopLeftCorner>-3803165.98427299 8805908.08284866</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>384</MatrixWidth>
<MatrixHeight>320</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>07</ows:Identifier>
<ScaleDenominator>136494.69336638605</ScaleDenominator>
<TopLeftCorner>-3803165.98427299 8805908.08284866</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>768</MatrixWidth>
<MatrixHeight>640</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>08</ows:Identifier>
<ScaleDenominator>68247.3466831932</ScaleDenominator>
<TopLeftCorner>-3803165.98427299 8805908.08284866</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>1536</MatrixWidth>
<MatrixHeight>1280</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>09</ows:Identifier>
<ScaleDenominator>34123.673341596535</ScaleDenominator>
<TopLeftCorner>-3803165.98427299 8805908.08284866</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>3072</MatrixWidth>
<MatrixHeight>2560</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>10</ows:Identifier>
<ScaleDenominator>17061.836670798286</ScaleDenominator>
<TopLeftCorner>-3803165.98427299 8805908.08284866</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>6144</MatrixWidth>
<MatrixHeight>5120</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>11</ows:Identifier>
<ScaleDenominator>8530.918335399143</ScaleDenominator>
<TopLeftCorner>-3803165.98427299 8805908.08284866</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>12288</MatrixWidth>
<MatrixHeight>10240</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>12</ows:Identifier>
<ScaleDenominator>4265.4591676995715</ScaleDenominator>
<TopLeftCorner>-3803165.98427299 8805908.08284866</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>24576</MatrixWidth>
<MatrixHeight>20480</MatrixHeight>
</TileMatrix>
<TileMatrix>
<ows:Identifier>13</ows:Identifier>
<ScaleDenominator>2132.729583849782</ScaleDenominator>
<TopLeftCorner>-3803165.98427299 8805908.08284866</TopLeftCorner>
<TileWidth>256</TileWidth>
<TileHeight>256</TileHeight>
<MatrixWidth>49152</MatrixWidth>
<MatrixHeight>40960</MatrixHeight>
</TileMatrix>
</TileMatrixSet>
</Contents>
<ServiceMetadataURL xlink:href="https://sgx.geodatenzentrum.de/wmts_topplus_open/1.0.0/WMTSCapabilities.xml"/>
</Capabilities>`;

beforeEach(() => {
    global.fetch = jest.fn<typeof fetch>((a, b?) => {
        return new Promise<any>(function(resolve, reject) {
            resolve({
                text: () =>  {
                    return new Promise<string>((resolve, reject) => {
                    resolve(capabilitiesXMLDocument);
                })
            }
            });
        });
    });
  });

test("getWMTSCapabilitiesFromService should return object from rest endpoint", async () => {
    // https://jestjs.io/docs/mock-function-api#jestfnimplementation
    // https://stackoverflow.com/questions/64818305/simple-fetch-mock-using-typescript-and-jest
    // https://jestjs.io/docs/jest-object#jestfnimplementation
    // global.fetch = jest.fn<typeof fetch>((a, b?) => {
    //     return new Promise<any>(function(resolve, reject) {
    //         resolve({
    //             text: () =>  {
    //                 return new Promise<string>((resolve, reject) => {
    //                 resolve(capabilitesXMLDocument);
    //             })
    //         }
    //         });
    //     });
    // });   

    const parsedWMTSCapabilites = await getWMTSCapabilitiesFromService("https://sgx.geodatenzentrum.de/wmts_topplus_open/1.0.0/WMTSCapabilities.xml");
    expect(parsedWMTSCapabilites).not.toBeNull();
    expect(parsedWMTSCapabilites).not.toBeUndefined();
  });

test("getWMTSCapabilitiesFromService should raise error for invalid URL", async () => {
    getWMTSCapabilitiesFromService("//sgx.geodatenzentrum@de/wmts_topplus_open/1.0.0/WMTSCapabilities.xml").
        catch((error: Error) => expect(error.message).toMatch('wmtsGetCapabilitiesUrl is not a valid URL'));
  });

test("getWMTSLegendURLForLayer should return URL for given layer identifier", () => {
    const parser: WMTSCapabilities = new WMTSCapabilities();
    const wmtsCapabilities = parser.read(capabilitiesXMLDocument);
    const layerID = "web";

    const url: string = getWMTSLegendURLForLayer(wmtsCapabilities, layerID);

    expect(url).toBe("https://sgx.geodatenzentrum.de/wmts_topplus_open/legend/web.png");

  });

test("getWMTSLegendURLForLayer should throw error for not existent layer identifier", () => {
    const parser: WMTSCapabilities = new WMTSCapabilities();
    const wmtsCapabilities = parser.read(capabilitiesXMLDocument);
    const layerID = "web99999";

    expect(() => getWMTSLegendURLForLayer(wmtsCapabilities, layerID)).toThrow();
  });

test("getWMTSLegendURLForLayer should throw error for empty legend URL array", () => {
    const layerID = "web";
    const wmtsCapMock = {
        Contents: {
            Layer: [
                {
                    Identifier: layerID,
                    Style: [
                        {
                            isDefault: false,
                            LegendURL: []
                        }
                    ]
                }
            ]
        }
    };

    expect(() => getWMTSLegendURLForLayer(wmtsCapMock, layerID)).toThrow("Style element does not contain any legend Urls");
  });

test("getWMTSLegendURLForLayer should throw error for missing Contents property", () => {
    const layerID = "web";
    const wmtsCapMock = {
    };

    expect(() => getWMTSLegendURLForLayer(wmtsCapMock, layerID)).toThrow("wmtsCapabilites.Contents is undefined or null");
  });

test("getWMTSLegendURLForLayer should throw error for missing Layer property", () => {
    const layerID = "web";
    const wmtsCapMock = {
        Contents: {
        }
    };

    expect(() => getWMTSLegendURLForLayer(wmtsCapMock, layerID)).toThrow("wmtsCapabilites.Contents.Layer is undefined or null");
  });

test("getWMTSLegendURLForLayer should throw error for empty Layer array", () => {
    const layerID = "web";
    const wmtsCapMock = {
        Contents: {
            Layer: []
        }
    };

    expect(() => getWMTSLegendURLForLayer(wmtsCapMock, layerID)).toThrow("wmtsCapabilites.Contents.Layer.length is 0 and does not contain any elements");
  });

test("getWMTSLegendURLForLayer should throw error when wmtCapabilities is null", () => {
    const layerID = "web";
    expect(() => getWMTSLegendURLForLayer(null, layerID)).toThrow("wmtsCapabilites is undefined or null");
  });

test("getWMTSLegendURLForLayer should throw error when wmtCapabilities is undefined", () => {
    const layerID = "web";
    expect(() => getWMTSLegendURLForLayer(undefined, layerID)).toThrow("wmtsCapabilites is undefined or null");
  });

test("getWMTSLegendURLForLayer should return first URL of default style legend URLs", () => {
    const layerID = "web";
    const defaultLegendUrls = [
        {"href": "default_0"},
        {"href": "default_1"}
    ];
    const wmtsCapMock = {
        Contents: {
            Layer: [
                {
                    Identifier: layerID,
                    Style: [
                        {
                            isDefault: false,
                            LegendURL: []
                        },
                        {
                            isDefault: true,
                            LegendURL: defaultLegendUrls
                        }
                    ]
                }
            ]
        }
    };

    expect(getWMTSLegendURLForLayer(wmtsCapMock, layerID)).toBe(defaultLegendUrls[0].href);
  });

test("getWMTSLayers should return when layer with Title equal to the Identifier when Title is missing", () => {
    const layerID = "web";
    const wmtsCapMock = {
        Contents: {
            Layer: [
                {
                    Identifier: layerID
                }
            ]
        }
    };
    const layers = getWMTSLayers(wmtsCapMock);
    expect(layers).toHaveLength(1);
    expect(layers[0].label).toBe(layers[0].value);
  });

test.each([null, undefined])("getWMTSLayers should throw error when wmtsCapabilities is null or undefined", (val) => {
    expect(() => getWMTSLayers(val)).toThrow("wmtsCapabilites is undefined or null");
});

describe("registerCRSInProj4", () => {
    test.each([undefined, null, {}])("invalid or nullish wmtsCapabilities should throw error", async (wmtsCapabilites) => {
        // await expect(registerCRSInProj4(wmtsCapabilites)).rejects.toThrow(TypeError);
        expect.assertions(1);
        try {
            await registerCRSInProj4(wmtsCapabilites);
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });

    test("empty wmtsCapabilities.Contents.TileMatrixSet should not throw an error", async () => {
        expect.assertions(0);
        try {
            await registerCRSInProj4({
                Contents: {
                    TileMatrixSet: []
                }
            });
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });

    test("pre-registered wmtsCapabilities.Contents.TileMatrixSet should return sliently", async () => {
        expect.assertions(0);
        try {
            await registerCRSInProj4({
                Contents: {
                    TileMatrixSet: [
                        {
                            SupportedCRS: "EPSG:3857"
                        }
                    ]
                }
            });
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });

    test("not pre-registered wmtsCapabilities.Contents.TileMatrixSet should return without error and have the respective projection registered", async () => {
        global.fetch =jest.fn<typeof fetch>(async (a, b?) => {
            return new Promise<any>((resolve, reject) => {
                    resolve(
                        {
                            text: () => new Promise<string>((resolve, reject) => {
                                resolve("+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
                            }),
                            ok: true
                        }
                    );
                }
            );
            // return ({
            //     ok: true,
            //     text: async () => "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs"
            // });
        });

        await registerCRSInProj4({
            Contents: {
                TileMatrixSet: [
                    {
                        SupportedCRS: "EPSG:3857"
                    },
                    {
                        SupportedCRS: "EPSG:25832"
                    }
                ]
            }
        });

        expect(get("EPSG:25832")).toBeTruthy();
    });

    test("invalid not pre-registered wmtsCapabilities.Contents.TileMatrixSet should throw error", async () => {
        global.fetch =jest.fn<typeof fetch>(async (a, b?) => {
            return new Promise<any>((resolve, reject) => {
                    resolve(
                        {
                            text: () => new Promise<string>((resolve, reject) => {
                                resolve("");
                            }),
                            ok: false
                        }
                    );
                }
            );
        });

        expect.assertions(1);
        try {
            await registerCRSInProj4({
            Contents: {
                TileMatrixSet: [
                    {
                        SupportedCRS: "EPSG:3857"
                    },
                    {
                        SupportedCRS: "1234XYZ"
                    }
                ]
            }
        });
        } catch (error) {
            expect(error).toBeTruthy();   
        }
    });
});

describe("tests for addCustomParametersToWMTSOptionsURLs", () => {
    test("throw an error when wmtsURL is not an valid URL", () => {
        const wmtsURL = "";
        expect.assertions(1);
        try {
            addCustomParametersToWMTSOptionsURLs(wmtsURL, {} as Options)
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });

    test("wmtsUrl with no query parameters and empty wmtsOptions should return unchanged wmtsOptions", () => {
        const wmtsURL = "https://sgx.geodatenzentrum.de/wmts_topplus_open/1.0.0/WMTSCapabilities.xml";
        const wmtsOptions = addCustomParametersToWMTSOptionsURLs(wmtsURL, {} as Options);
        expect(wmtsOptions).toEqual({});
    });

    test("wmtsUrl with query parameters and empty wmtsOptions should return unchanged wmtsOptions", () => {
        const wmtsURL = "https://sgx.geodatenzentrum.de/wmts_basemapde?request=GetCapabilities&service=WMTS";
        const wmtsOptions = addCustomParametersToWMTSOptionsURLs(wmtsURL, {} as Options);
        expect(wmtsOptions).toEqual({});
    });

    test("wmtsUrl with wmts query parameters and custom query parameters and empty wmtsOptions should return unchanged wmtsOptions", () => {
        const wmtsURL = "https://sgx.geodatenzentrum.de/wmts_basemapde?request=GetCapabilities&service=WMTS&customA=0&customB=test";
        const wmtsOptions = addCustomParametersToWMTSOptionsURLs(wmtsURL, {} as Options);
        expect(wmtsOptions).toEqual({});
    });

    test("wmtsUrl without wmts query parameters and custom query parameters and empty wmtsOptions should return unchanged wmtsOptions", () => {
        const wmtsURL = "https://sgx.geodatenzentrum.de/wmts_topplus_open/1.0.0/WMTSCapabilities.xml";
        const wmtsOptions = addCustomParametersToWMTSOptionsURLs(wmtsURL, {} as Options);
        expect(wmtsOptions).toEqual({});
    });

    test("wmtsUrl without wmts query parameters and custom query parameters and url prop without query params in wmtsOptions should return wmtsOptions url prop with custom parameters appended", () => {
        const wmtsURL = "https://sgx.geodatenzentrum.de/wmts_topplus_open/1.0.0/WMTSCapabilities.xml?custom=123&customwd=8999";
        const wmtsOptions = addCustomParametersToWMTSOptionsURLs(wmtsURL, { url: "http://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"} as Options);
        expect(wmtsOptions).toEqual({
            url: "http://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?custom=123&customwd=8999"
        });
    });

    test("wmtsUrl without wmts query parameters and custom query parameters and urls prop with query params in wmtsOptions should return wmtsOptions url prop with custom parameters appended", () => {
        const wmtsURL = "https://sgx.geodatenzentrum.de/wmts_topplus_open/1.0.0/WMTSCapabilities.xml?custom=123&customwd=8999";
        const wmtsOptions = addCustomParametersToWMTSOptionsURLs(wmtsURL, { url: "http://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?a=1&b=2"} as Options);
        expect(wmtsOptions).toEqual({
            url: "http://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?a=1&b=2&custom=123&customwd=8999"
        });
    });

    test("wmtsUrl with wmts query parameters and no custom query parameters and urls prop with query params in wmtsOptions should return wmtsOptions url prop with custom parameters appended", () => {
        const wmtsURL = "https://sgx.geodatenzentrum.de/wmts_basemapde?request=GetCapabilities&service=WMTS&version=1.3.0";
        const wmtsOptions = addCustomParametersToWMTSOptionsURLs(wmtsURL, { url: "http://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?a=1&b=2"} as Options);
        expect(wmtsOptions).toEqual({
            url: "http://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?a=1&b=2"
        });
    });

    test("wmtsUrl with wmts query parameters and custom query parameters and url prop with query params in wmtsOptions should return wmtsOptions url prop with custom parameters appended", () => {
        const wmtsURL = "https://sgx.geodatenzentrum.de/wmts_basemapde?request=GetCapabilities&service=WMTS&version=1.3.0&customMap=basemap";
        const wmtsOptions = addCustomParametersToWMTSOptionsURLs(wmtsURL, { url: "http://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?a=1&b=2"} as Options);
        expect(wmtsOptions).toEqual({
            url: "http://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?a=1&b=2&customMap=basemap"
        });
    });

    test("wmtsUrl with wmts query parameters and custom query parameters and urls prop with query params in wmtsOptions should return wmtsOptions urls prop with custom parameters appended", () => {
        const wmtsURL = "https://sgx.geodatenzentrum.de/wmts_basemapde?request=GetCapabilities&service=WMTS&version=1.3.0&customMap=basemap";
        const wmtsOptions = addCustomParametersToWMTSOptionsURLs(wmtsURL, { urls: ["http://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?a=1&b=2"]} as Options);
        expect(wmtsOptions).toEqual({
            urls: ["http://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?a=1&b=2&customMap=basemap"]
        });
    });

    test("wmtsUrl with wmts query parameters and with custom query parameters and urls prop without query params in wmtsOptions should return wmtsOptions urls prop with custom parameters appended", () => {
        const wmtsURL = "https://sgx.geodatenzentrum.de/wmts_basemapde?request=GetCapabilities&service=WMTS&version=1.3.0&customMap=basemap";
        const wmtsOptions = addCustomParametersToWMTSOptionsURLs(wmtsURL, { urls: ["http://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"]} as Options);
        expect(wmtsOptions).toEqual({
            urls: ["http://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?customMap=basemap"]
        });
    });

    test("wmtsUrl with wmts query parameters and custom query parameters and urls prop with query params in wmtsOptions should return wmtsOptions urls prop with custom parameters appended", () => {
        const wmtsURL = "https://sgx.geodatenzentrum.de/wmts_basemapde?request=GetCapabilities&service=WMTS&version=1.3.0&customMap=basemap";
        const wmtsOptions = addCustomParametersToWMTSOptionsURLs(wmtsURL, { urls: ["http://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?a=1&b=2"]} as Options);
        expect(wmtsOptions).toEqual({
            urls: ["http://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?a=1&b=2&customMap=basemap"]
        });
    });

    test("wmtsUrl with wmts query parameters and without custom query parameters and urls prop with query params in wmtsOptions should return wmtsOptions urls prop with custom parameters appended", () => {
        const wmtsURL = "https://sgx.geodatenzentrum.de/wmts_basemapde?request=GetCapabilities&service=WMTS&version=1.3.0";
        const wmtsOptions = addCustomParametersToWMTSOptionsURLs(wmtsURL, { urls: ["http://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?a=1&b=2"]} as Options);
        expect(wmtsOptions).toEqual({
            urls: ["http://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?a=1&b=2"]
        });
    });

    test("wmtsUrl with wmts query parameters and without custom query parameters and urls prop without query params in wmtsOptions should return wmtsOptions urls prop with custom parameters appended", () => {
        const wmtsURL = "https://sgx.geodatenzentrum.de/wmts_basemapde?request=GetCapabilities&service=WMTS&version=1.3.0";
        const wmtsOptions = addCustomParametersToWMTSOptionsURLs(wmtsURL, { urls: ["http://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"]} as Options);
        expect(wmtsOptions).toEqual({
            urls: ["http://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"]
        });
    });

    test("invalid url in urls prop of wtmsOptions should throw an error", () => {
        const wmtsURL = "https://sgx.geodatenzentrum.de/wmts_basemapde?request=GetCapabilities&service=WMTS&version=1.3.0";
        expect.assertions(1);
        try {
            addCustomParametersToWMTSOptionsURLs(wmtsURL, { urls: [""]} as Options);
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });

    test.each([
        {
            wmtsURL: "https://sgx.geodatenzentrum.de/wmts_basemapde?request=GetCapabilities&service=WMTS&version=1.3.0&",
            wmtsOptions: {
                url: "https://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"
            },
            expected: { 
                url: "https://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"
            }
        },
        {
            wmtsURL: "https://sgx.geodatenzentrum.de/wmts_basemapde?request=GetCapabilities&service=WMTS&version=1.3.0&",
            wmtsOptions: {
                url: "https://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?"
            },
            expected: { 
                url: "https://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"
            }
        },
        {
            wmtsURL: "https://sgx.geodatenzentrum.de/wmts_topplus_open/1.0.0/WMTSCapabilities.xml?",
            wmtsOptions: {
                url: "https://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?"
            },
            expected: { 
                url: "https://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"
            }
        },
        {
            wmtsURL: "https://sgx.geodatenzentrum.de/wmts_topplus_open/1.0.0/WMTSCapabilities.xml?&",
            wmtsOptions: {
                url: "https://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?a"
            },
            expected: { 
                url: "https://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?a="
            }
        },
        {
            wmtsURL: "https://sgx.geodatenzentrum.de/wmts_topplus_open/1.0.0/WMTSCapabilities.xml?a=b&",
            wmtsOptions: {
                url: "https://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?s=t&"
            },
            expected: { 
                url: "https://example.org/wmts_topplus_open/tile/1.0.0/web/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png?s=t&a=b"
            }
        }
    ])("trailing '?' or '&' in URLs should be ignored", ({wmtsURL, wmtsOptions, expected}) => {
        expect(addCustomParametersToWMTSOptionsURLs(wmtsURL, wmtsOptions as Options)).toEqual(expected);
    });
});

describe("tests for removeQueryParameters",() => {
    test("empty search parameters should return object untouched", () => {
        const emptySearchParams = new URLSearchParams();
        expect([...emptySearchParams.keys()].length).toBe([...removeQueryParameters(emptySearchParams).keys()].length);
    });

    test("empty parameter name array should not return any parameters", () => {
        const parameterNames: string[] = [];
        const emptySearchParams = new URLSearchParams({
            "a": "1",
            "b": "2"
        });
        expect(removeQueryParameters(emptySearchParams, parameterNames).toString()).toBe(emptySearchParams.toString());
    });

    test.each([
        {
            args: {
                    urlSeachParams: new URLSearchParams({"a": "1"}),
                    parameterNames: ["A"],
                    ignoreCase: true
            },
            expected: 0 // [...new URLSearchParams().keys()].length
        },
        {
            args: {
                    urlSeachParams: new URLSearchParams({"a": "1"}),
                    parameterNames: ["A"],
                    ignoreCase: false
            },
            expected: 1 // [...new URLSearchParams().keys()].length
        }
    ])("ignoreCase flag should remove parameter when set to true, else the parameter should be preserved", ({args, expected}) => {
        expect([...removeQueryParameters(args.urlSeachParams, args.parameterNames, args.ignoreCase)].length).toBe(expected);
    });

    test("defined parameter names of array should be removed from URL parameters", () => {
        const parameterNames: string[] = ["a", "b"];
        const emptySearchParams = new URLSearchParams({
            "a": "1",
            "b": "2",
            "c": "3"
        });
        expect([...removeQueryParameters(emptySearchParams, parameterNames)].length).toBe(1);
    });
});
