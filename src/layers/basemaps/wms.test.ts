import '../../__mocks__/fetch_mock';
import { wms } from "./wms";
import Map from 'ol/Map';
import { config, } from '@grafana/runtime';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import { getFirstDirectChildNodeByLocalName, getAllDirectChildNodesByLocalName, getWMSLayers, getProjection, getWMSCapabilitiesFromService } from 'mapServiceHandlers/wms';
import LayerGroup from 'ol/layer/Group';

export const xmlCapabilities = `<?xml version="1.0" ?>
<WMS_Capabilities xmlns="http://www.opengis.net/wms" xmlns:sld="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:inspire_common="http://inspire.ec.europa.eu/schemas/common/1.0" xmlns:inspire_vs="http://inspire.ec.europa.eu/schemas/inspire_vs/1.0" version="1.3.0" xsi:schemaLocation="http://www.opengis.net/wms http://schemas.opengis.net/wms/1.3.0/capabilities_1_3_0.xsd http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/sld_capabilities.xsd http://inspire.ec.europa.eu/schemas/inspire_vs/1.0 http://inspire.ec.europa.eu/schemas/inspire_vs/1.0/inspire_vs.xsd">
<Service>
  <Name>WMS</Name>
  <Title>WMS TopPlusOpen</Title>
  <Abstract>Darstellungsdienst (WMS) für eine frei nutzbare weltweite einheitliche Webkarte auf der Basis von freien und amtlichen Datenquellen.
In dem Produkt werden unter anderem freie amtliche Geodaten des Bundes und der Open-Data-Länder Berlin, Brandenburg, Hamburg, Nordrhein-Westfalen, Sachsen und Thüringen präsentiert. Darüber hinaus stellen Mecklenburg-Vorpommern und Rheinland-Pfalz im Rahmen eines Kooperationsvertrages ihre amtlichen Geodaten für die TopPlusOpen zur Verfügung, sodass auch diese Länder ausschließlich durch amtliche Daten dargestellt werden.
In den übrigen Bundesländern und im Ausland werden in den entsprechenden Zoomstufen im Wesentlichen OSM-Daten verwendet, die aus Sicht des BKG alle Qualitätsansprüche erfüllen und sich beinahe nahtlos mit den amtlichen Daten kombinieren lassen.
Die Webdienste der TopPlusOpen werden über die standardisierte Schnittstellen WMS und WMTS angeboten und sind hoch performant.
Es werden 4 verschiedene Varianten angeboten: - TopPlusOpen: Inhaltlich sehr detailreiche Kartendarstellung in Volltonfarben - TopPlusOpen Graustufen:	Inhaltlich identisch mit der Volltonvariante; automatisch generierte Graustufen - TopPlusOpen Light: Gegenüber der Volltonvariante reduzierter Inhalt; Dezente Farbgebung  - TopPlusOpen Light Grau: Inhaltlich identisch mit der TopPlusOpen Light; Darstellung in Grautönen und einzelnen dezenten Farben (Gewässer, Grenzen)
Die TopPlusOpen-Webkarte wird in zwei Projektionen produziert: - Pseudo-Mercator-Projektion (EPSG:3857) - UTM32 (EPSG:25832)
Pseudo-Mercator-Projektion: Die Webkarte verfügt in dieser Projektion über 19 Maßstabsstufen und ist in drei unterschiedliche Darstellungsbereiche unterteilt:  - Weltweite Darstellung für kleine Maßstäbe - europaweite Darstellung für mittlere Maßstäbe - Detaildarstellung für Deutschland und das angrenzende Ausland
Projektion UTM32: Die Webkarte verfügt in dieser Projektion über 14 Maßstabsstufen und ist in zwei Darstellungsbereiche unterteilt: - europaweite Darstellung für mittlere Maßstäbe - Detaildarstellung für Deutschland und das angrenzende Ausland
</Abstract>
  <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://www.geodatenzentrum.de"/>
  <ContactInformation>
      <ContactPersonPrimary>
        <ContactPerson></ContactPerson>
        <ContactOrganization>Dienstleistungszentrum des Bundes für Geoinformation und Geodäsie</ContactOrganization>
      </ContactPersonPrimary>
      <ContactPosition>Technischer Administrator</ContactPosition>
      <ContactAddress>
        <AddressType>postal</AddressType>
        <Address>Karl-Rothe-Str. 10 - 14</Address>
        <City>Leipzig</City>
        <StateOrProvince></StateOrProvince>
        <PostCode>04105</PostCode>
        <Country>Deutschland</Country>
      </ContactAddress>
      <ContactVoiceTelephone>+49 (0) 341 5634 333</ContactVoiceTelephone>
      <ContactFacsimileTelephone>+49 (0) 341 5634 415</ContactFacsimileTelephone>
      <ContactElectronicMailAddress>dlz@bkg.bund.de</ContactElectronicMailAddress>
  </ContactInformation>
    <Fees>Die Daten sind urheberrechtlich geschützt. Die Kartendarstellung und Präsentationsgraphiken werden entgeltfrei mit der Datenlizenz Deutschland – Namensnennung – Version 2.0 (https://www.govdata.de/dl-de/by-2-0) zur Verfügung gestellt. Der Quellenvermerk ist zu beachten. | Quellenvermerk: Kartendarstellung und Präsentationsgraphiken: &#169; Bundesamt für Kartographie und Geodäsie &lt;Jahr&gt;, Datenquellen: https://sg.geodatenzentrum.de/web_public/gdz/datenquellen/Datenquellen_TopPlusOpen.html
</Fees>
    <AccessConstraints>Es gelten keine Zugriffsbeschränkungen
</AccessConstraints>
    <MaxWidth>6000</MaxWidth>
    <MaxHeight>6000</MaxHeight>
</Service>
<Capability>
  <Request>
    <GetCapabilities>
      <Format>text/xml</Format>
      <DCPType>
        <HTTP>
          <Get><OnlineResource xlink:href="https://sgx.geodatenzentrum.de/wms_topplus_open?"/></Get>
        </HTTP>
      </DCPType>
    </GetCapabilities>
    <GetMap>
      <Format>image/png</Format>
      <Format>image/png8</Format>
      <Format>image/png24</Format>
      <Format>image/png32</Format>
      <Format>image/jpeg</Format>
      <DCPType>
        <HTTP>
          <Get><OnlineResource xlink:href="https://sgx.geodatenzentrum.de/wms_topplus_open?"/></Get>
        </HTTP>
      </DCPType>
    </GetMap>
    <GetFeatureInfo>
      <Format>text/plain</Format>
      <Format>text/html</Format>
      <Format>text/xml</Format>
      <DCPType>
        <HTTP>
          <Get><OnlineResource xlink:href="https://sgx.geodatenzentrum.de/wms_topplus_open?"/></Get>
        </HTTP>
      </DCPType>
    </GetFeatureInfo>
    <sld:GetLegendGraphic>
      <Format>image/png</Format>
      <Format>image/png8</Format>
      <Format>image/png24</Format>
      <Format>image/png32</Format>
      <Format>image/jpeg</Format>
      <DCPType>
        <HTTP>
          <Get><OnlineResource xlink:href="https://sgx.geodatenzentrum.de/wms_topplus_open?"/></Get>
        </HTTP>
      </DCPType>
    </sld:GetLegendGraphic>
  </Request>
  <Exception>
    <Format>XML</Format>
    <Format>INIMAGE</Format>
    <Format>BLANK</Format>
  </Exception>
  <inspire_vs:ExtendedCapabilities>
    <inspire_common:MetadataUrl>
      <inspire_common:URL>https://mis.bkg.bund.de/csw?REQUEST=GetRecordById&amp;SERVICE=CSW&amp;VERSION=2.0.2&amp;elementSetName=full&amp;id=8BDFB79F-A3FD-4668-88D3-DFD957F265C2</inspire_common:URL>
      <inspire_common:MediaType>application/vnd.ogc.csw.GetRecordByIdResponse_xml</inspire_common:MediaType>
    </inspire_common:MetadataUrl>
    <inspire_common:SupportedLanguages>
      <inspire_common:DefaultLanguage>
        <inspire_common:Language>ger</inspire_common:Language>
      </inspire_common:DefaultLanguage>
    </inspire_common:SupportedLanguages>
    <inspire_common:ResponseLanguage>
      <inspire_common:Language>ger</inspire_common:Language>
    </inspire_common:ResponseLanguage>
  </inspire_vs:ExtendedCapabilities>
  <Layer>
    <Title>WMS TopPlusOpen</Title>
    <CRS>CRS:84</CRS>
    <CRS>EPSG:4326</CRS>
    <CRS>EPSG:3857</CRS>
    <CRS>EPSG:4258</CRS>
    <CRS>EPSG:25832</CRS>
    <CRS>EPSG:25833</CRS>
    <CRS>EPSG:4647</CRS>
    <CRS>EPSG:5650</CRS>
    <CRS>EPSG:3034</CRS>
    <CRS>EPSG:3035</CRS>
    <CRS>EPSG:3044</CRS>
    <CRS>EPSG:3045</CRS>
    <CRS>EPSG:31466</CRS>
    <CRS>EPSG:31467</CRS>
    <CRS>EPSG:31468</CRS>
    <CRS>EPSG:31469</CRS>
    <CRS>EPSG:5676</CRS>
    <CRS>EPSG:5677</CRS>
    <CRS>EPSG:5678</CRS>
    <CRS>EPSG:5679</CRS>
    <CRS>EPSG:4839</CRS>
    <CRS>EPSG:5243</CRS>
    <EX_GeographicBoundingBox>
      <westBoundLongitude>-180</westBoundLongitude>
      <eastBoundLongitude>180</eastBoundLongitude>
      <southBoundLatitude>-85.0511287798066</southBoundLatitude>
      <northBoundLatitude>85.0511287798066</northBoundLatitude>
    </EX_GeographicBoundingBox>
    <BoundingBox CRS="CRS:84" minx="-180" miny="-85.0511287798066" maxx="180" maxy="85.0511287798066" />
    <BoundingBox CRS="CRS:84" minx="-180.0" miny="-85.0511287798066" maxx="180.0" maxy="85.0511287798066" />
    <BoundingBox CRS="EPSG:4326" minx="-85.0511287798066" miny="-180.0" maxx="85.0511287798066" maxy="180.0" />
    <BoundingBox CRS="EPSG:3857" minx="-20037508.342789244" miny="-20037508.342789255" maxx="20037508.342789244" maxy="20037508.342789244" />
    <BoundingBox CRS="EPSG:4258" minx="18.404252" miny="-35.999991" maxx="79.321963" maxy="53.99999400000001" />
    <BoundingBox CRS="EPSG:4839" minx="-2050368.9173328548" miny="-4255403.50983551" maxx="2871346.6385650905" maxy="3623206.2912081527" />
    <BoundingBox CRS="EPSG:25832" minx="-3797208.015863713" miny="3623285.141382178" maxx="4333808.739867987" maxy="8555787.976374663" />
    <BoundingBox CRS="EPSG:25833" minx="-4294940.671908557" miny="3482749.6755738934" maxx="3924769.3710252466" maxy="8577594.608156482" />
    <BoundingBox CRS="EPSG:4647" minx="28202791.984136287" miny="3623285.141382178" maxx="36333808.739867985" maxy="8555787.976374663" />
    <BoundingBox CRS="EPSG:5650" minx="28294161.10448142" miny="3529503.8998047784" maxx="36199767.186531976" maxy="8757293.589497142" />
    <BoundingBox CRS="EPSG:3034" minx="878723.9817977201" miny="84374.66680132737" maxx="5536720.936948574" maxy="8022103.660360625" />
    <BoundingBox CRS="EPSG:3035" minx="1252100.9980705858" miny="348606.4699198855" maxx="5986072.501824301" maxy="8392877.609543256" />
    <BoundingBox CRS="EPSG:3044" minx="3623285.141382178" miny="-3797208.015863713" maxx="8555787.976374663" maxy="4333808.739867987" />
    <BoundingBox CRS="EPSG:3045" minx="3482749.6755738934" miny="-4294940.671908557" maxx="8577594.608156482" maxy="3924769.3710252466" />
    <BoundingBox CRS="EPSG:31466" minx="5088781.397114682" miny="2389190.8416419327" maxx="6293431.791194725" maxy="3388662.3349912614" />
    <BoundingBox CRS="EPSG:31467" minx="5112556.611660988" miny="3099388.8453760566" maxx="6237932.920489833" maxy="4145164.256865643" />
    <BoundingBox CRS="EPSG:31468" minx="5129408.1809673505" miny="3831115.247455611" maxx="6222211.29969823" maxy="4912602.164312548" />
    <BoundingBox CRS="EPSG:31469" minx="5130858.418624354" miny="4555511.10373179" maxx="6243653.055363198" maxy="5678905.276833218" />
    <BoundingBox CRS="EPSG:5676" minx="2389190.8416419327" miny="5088781.397114682" maxx="3388662.3349912614" maxy="6293431.791194725" />
    <BoundingBox CRS="EPSG:5677" minx="3099388.8453760566" miny="5112556.611660988" maxx="4145164.256865643" maxy="6237932.920489833" />
    <BoundingBox CRS="EPSG:5678" minx="3831115.247455611" miny="5129408.1809673505" maxx="4912602.164312548" maxy="6222211.29969823" />
    <BoundingBox CRS="EPSG:5679" minx="4555511.10373179" miny="5130858.418624354" maxx="5678905.276833218" maxy="6243653.055363198" />
    <BoundingBox CRS="EPSG:5243" minx="-4255403.50983551" miny="-2050368.9173328548" maxx="3623206.2912081527" maxy="2871346.6385650905" />
    <Layer>
      <Name>web</Name>
      <Title>TopPlusOpen</Title>
      <Abstract>Weltweite einheitliche Webkarte. Normalausgabe.
  </Abstract>
      <EX_GeographicBoundingBox>
        <westBoundLongitude>-180</westBoundLongitude>
        <eastBoundLongitude>180</eastBoundLongitude>
        <southBoundLatitude>-85.0511287798066</southBoundLatitude>
        <northBoundLatitude>85.0511287798066</northBoundLatitude>
      </EX_GeographicBoundingBox>
      <BoundingBox CRS="CRS:84" minx="-180" miny="-85.0511287798066" maxx="180" maxy="85.0511287798066" />
      <BoundingBox CRS="CRS:84" minx="-180.0" miny="-85.0511287798066" maxx="180.0" maxy="85.0511287798066" />
      <BoundingBox CRS="EPSG:4326" minx="-85.0511287798066" miny="-180.0" maxx="85.0511287798066" maxy="180.0" />
      <BoundingBox CRS="EPSG:3857" minx="-20037508.342789244" miny="-20037508.342789244" maxx="20037508.342789244" maxy="20037508.342789244" />
      <BoundingBox CRS="EPSG:4258" minx="18.404252" miny="-35.999991" maxx="79.321963" maxy="53.99999400000001" />
      <BoundingBox CRS="EPSG:4839" minx="-2050368.9173328548" miny="-4255403.50983551" maxx="2871346.6385650905" maxy="3623206.2912081527" />
      <BoundingBox CRS="EPSG:25832" minx="-3797208.015863713" miny="3623285.141382178" maxx="4333808.739867987" maxy="8555787.976374663" />
      <BoundingBox CRS="EPSG:25833" minx="-4294940.671908557" miny="3482749.6755738934" maxx="3924769.3710252466" maxy="8577594.608156482" />
      <BoundingBox CRS="EPSG:4647" minx="28202791.984136287" miny="3623285.141382178" maxx="36333808.739867985" maxy="8555787.976374663" />
      <BoundingBox CRS="EPSG:5650" minx="28294161.10448142" miny="3529503.8998047784" maxx="36199767.186531976" maxy="8757293.589497142" />
      <BoundingBox CRS="EPSG:3034" minx="878723.9817977201" miny="84374.66680132737" maxx="5536720.936948574" maxy="8022103.660360625" />
      <BoundingBox CRS="EPSG:3035" minx="1252100.9980705858" miny="348606.4699198855" maxx="5986072.501824301" maxy="8392877.609543256" />
      <BoundingBox CRS="EPSG:3044" minx="3623285.141382178" miny="-3797208.015863713" maxx="8555787.976374663" maxy="4333808.739867987" />
      <BoundingBox CRS="EPSG:3045" minx="3482749.6755738934" miny="-4294940.671908557" maxx="8577594.608156482" maxy="3924769.3710252466" />
      <BoundingBox CRS="EPSG:31466" minx="5088781.397114682" miny="2389190.8416419327" maxx="6293431.791194725" maxy="3388662.3349912614" />
      <BoundingBox CRS="EPSG:31467" minx="5112556.611660988" miny="3099388.8453760566" maxx="6237932.920489833" maxy="4145164.256865643" />
      <BoundingBox CRS="EPSG:31468" minx="5129408.1809673505" miny="3831115.247455611" maxx="6222211.29969823" maxy="4912602.164312548" />
      <BoundingBox CRS="EPSG:31469" minx="5130858.418624354" miny="4555511.10373179" maxx="6243653.055363198" maxy="5678905.276833218" />
      <BoundingBox CRS="EPSG:5676" minx="2389190.8416419327" miny="5088781.397114682" maxx="3388662.3349912614" maxy="6293431.791194725" />
      <BoundingBox CRS="EPSG:5677" minx="3099388.8453760566" miny="5112556.611660988" maxx="4145164.256865643" maxy="6237932.920489833" />
      <BoundingBox CRS="EPSG:5678" minx="3831115.247455611" miny="5129408.1809673505" maxx="4912602.164312548" maxy="6222211.29969823" />
      <BoundingBox CRS="EPSG:5679" minx="4555511.10373179" miny="5130858.418624354" maxx="5678905.276833218" maxy="6243653.055363198" />
      <BoundingBox CRS="EPSG:5243" minx="-4255403.50983551" miny="-2050368.9173328548" maxx="3623206.2912081527" maxy="2871346.6385650905" />
      <AuthorityURL name="BKG">
        <OnlineResource xlink:href="https://registry.gdi-de.org/id/de.bund.bkg.csw/" />
      </AuthorityURL>
      <AuthorityURL name="BKG">
        <OnlineResource xlink:href="https://registry.gdi-de.org/id/de.bund.bkg.csw/" />
      </AuthorityURL>
      <Identifier authority="BKG">https://registry.gdi-de.org/id/de.bund.bkg.csw/a32e622a-1893-4744-9af4-e3f85c7c681c</Identifier>
      <Identifier authority="BKG">https://registry.gdi-de.org/id/de.bund.bkg.csw/ff457838-3c09-4199-b9c1-c3b83ac48b6d</Identifier>
      <MetadataURL type="INSPIRE">
        <Format>application/xml</Format>
        <OnlineResource xlink:href="https://mis.bkg.bund.de/csw?REQUEST=GetRecordById&amp;SERVICE=CSW&amp;VERSION=2.0.2&amp;elementSetName=full&amp;id=D4A0D975-36CA-4D6B-BDD5-F8EE6FC8782D"/>
      </MetadataURL>
      <MetadataURL type="INSPIRE">
        <Format>application/xml</Format>
        <OnlineResource xlink:href="https://mis.bkg.bund.de/csw?REQUEST=GetRecordById&amp;SERVICE=CSW&amp;VERSION=2.0.2&amp;elementSetName=full&amp;id=A1C4E929-3EC9-4758-9677-DB4970D226AB"/>
      </MetadataURL>
      <Style>
        <Name>inspire_common:DEFAULT</Name>
        <Title>default</Title>
        <LegendURL width="380" height="2580">
          <Format>image/png</Format>
          <OnlineResource xlink:type="simple" xlink:href="https://sgx.geodatenzentrum.de/wms_topplus_open?format=image%2Fpng&amp;layer=web&amp;sld_version=1.1.0&amp;request=GetLegendGraphic&amp;service=WMS&amp;version=1.1.1&amp;styles=" />
        </LegendURL>
      </Style>
    </Layer>
    <Layer>
      <Name>web_grau</Name>
      <Title>TopPlusOpen Graustufen</Title>
      <Abstract>Weltweite einheitliche Webkarte. Graustufendarstellung
  </Abstract>
      <EX_GeographicBoundingBox>
        <westBoundLongitude>-180</westBoundLongitude>
        <eastBoundLongitude>180</eastBoundLongitude>
        <southBoundLatitude>-85.0511287798066</southBoundLatitude>
        <northBoundLatitude>85.0511287798066</northBoundLatitude>
      </EX_GeographicBoundingBox>
      <BoundingBox CRS="CRS:84" minx="-180" miny="-85.0511287798066" maxx="180" maxy="85.0511287798066" />
      <BoundingBox CRS="CRS:84" minx="-180.0" miny="-85.0511287798066" maxx="180.0" maxy="85.0511287798066" />
      <BoundingBox CRS="EPSG:4326" minx="-85.0511287798066" miny="-180.0" maxx="85.0511287798066" maxy="180.0" />
      <BoundingBox CRS="EPSG:3857" minx="-20037508.342789244" miny="-20037508.342789244" maxx="20037508.342789244" maxy="20037508.342789244" />
      <BoundingBox CRS="EPSG:4258" minx="18.404252" miny="-35.999991" maxx="79.321963" maxy="53.99999400000001" />
      <BoundingBox CRS="EPSG:4839" minx="-2050368.9173328548" miny="-4255403.50983551" maxx="2871346.6385650905" maxy="3623206.2912081527" />
      <BoundingBox CRS="EPSG:25832" minx="-3797208.015863713" miny="3623285.141382178" maxx="4333808.739867987" maxy="8555787.976374663" />
      <BoundingBox CRS="EPSG:25833" minx="-4294940.671908557" miny="3482749.6755738934" maxx="3924769.3710252466" maxy="8577594.608156482" />
      <BoundingBox CRS="EPSG:4647" minx="28202791.984136287" miny="3623285.141382178" maxx="36333808.739867985" maxy="8555787.976374663" />
      <BoundingBox CRS="EPSG:5650" minx="28294161.10448142" miny="3529503.8998047784" maxx="36199767.186531976" maxy="8757293.589497142" />
      <BoundingBox CRS="EPSG:3034" minx="878723.9817977201" miny="84374.66680132737" maxx="5536720.936948574" maxy="8022103.660360625" />
      <BoundingBox CRS="EPSG:3035" minx="1252100.9980705858" miny="348606.4699198855" maxx="5986072.501824301" maxy="8392877.609543256" />
      <BoundingBox CRS="EPSG:3044" minx="3623285.141382178" miny="-3797208.015863713" maxx="8555787.976374663" maxy="4333808.739867987" />
      <BoundingBox CRS="EPSG:3045" minx="3482749.6755738934" miny="-4294940.671908557" maxx="8577594.608156482" maxy="3924769.3710252466" />
      <BoundingBox CRS="EPSG:31466" minx="5088781.397114682" miny="2389190.8416419327" maxx="6293431.791194725" maxy="3388662.3349912614" />
      <BoundingBox CRS="EPSG:31467" minx="5112556.611660988" miny="3099388.8453760566" maxx="6237932.920489833" maxy="4145164.256865643" />
      <BoundingBox CRS="EPSG:31468" minx="5129408.1809673505" miny="3831115.247455611" maxx="6222211.29969823" maxy="4912602.164312548" />
      <BoundingBox CRS="EPSG:31469" minx="5130858.418624354" miny="4555511.10373179" maxx="6243653.055363198" maxy="5678905.276833218" />
      <BoundingBox CRS="EPSG:5676" minx="2389190.8416419327" miny="5088781.397114682" maxx="3388662.3349912614" maxy="6293431.791194725" />
      <BoundingBox CRS="EPSG:5677" minx="3099388.8453760566" miny="5112556.611660988" maxx="4145164.256865643" maxy="6237932.920489833" />
      <BoundingBox CRS="EPSG:5678" minx="3831115.247455611" miny="5129408.1809673505" maxx="4912602.164312548" maxy="6222211.29969823" />
      <BoundingBox CRS="EPSG:5679" minx="4555511.10373179" miny="5130858.418624354" maxx="5678905.276833218" maxy="6243653.055363198" />
      <BoundingBox CRS="EPSG:5243" minx="-4255403.50983551" miny="-2050368.9173328548" maxx="3623206.2912081527" maxy="2871346.6385650905" />
      <AuthorityURL name="BKG">
        <OnlineResource xlink:href="https://registry.gdi-de.org/id/de.bund.bkg.csw/" />
      </AuthorityURL>
      <AuthorityURL name="BKG">
        <OnlineResource xlink:href="https://registry.gdi-de.org/id/de.bund.bkg.csw/" />
      </AuthorityURL>
      <Identifier authority="BKG">https://registry.gdi-de.org/id/de.bund.bkg.csw/a32e622a-1893-4744-9af4-e3f85c7c681c</Identifier>
      <Identifier authority="BKG">https://registry.gdi-de.org/id/de.bund.bkg.csw/ff457838-3c09-4199-b9c1-c3b83ac48b6d</Identifier>
      <MetadataURL type="INSPIRE">
        <Format>application/xml</Format>
        <OnlineResource xlink:href="https://mis.bkg.bund.de/csw?REQUEST=GetRecordById&amp;SERVICE=CSW&amp;VERSION=2.0.2&amp;elementSetName=full&amp;id=D4A0D975-36CA-4D6B-BDD5-F8EE6FC8782D"/>
      </MetadataURL>
      <MetadataURL type="INSPIRE">
        <Format>application/xml</Format>
        <OnlineResource xlink:href="https://mis.bkg.bund.de/csw?REQUEST=GetRecordById&amp;SERVICE=CSW&amp;VERSION=2.0.2&amp;elementSetName=full&amp;id=A1C4E929-3EC9-4758-9677-DB4970D226AB"/>
      </MetadataURL>
      <Style>
        <Name>inspire_common:DEFAULT</Name>
        <Title>default</Title>
        <LegendURL width="380" height="2580">
          <Format>image/png</Format>
          <OnlineResource xlink:type="simple" xlink:href="https://sgx.geodatenzentrum.de/wms_topplus_open?format=image%2Fpng&amp;layer=web_grau&amp;sld_version=1.1.0&amp;request=GetLegendGraphic&amp;service=WMS&amp;version=1.1.1&amp;styles=" />
        </LegendURL>
      </Style>
    </Layer>
    <Layer>
      <Name>web_scale</Name>
      <Title>TopPlusOpen (Upscale)</Title>
      <Abstract>Normalausgabe mit weltweiter Kartendarstellung. Für Regionen ohne Daten erfolgt eine Skalierung von Bilddaten vorangegangener Zoomstufen. 
  </Abstract>
      <EX_GeographicBoundingBox>
        <westBoundLongitude>-180</westBoundLongitude>
        <eastBoundLongitude>180</eastBoundLongitude>
        <southBoundLatitude>-85.0511287798066</southBoundLatitude>
        <northBoundLatitude>85.0511287798066</northBoundLatitude>
      </EX_GeographicBoundingBox>
      <BoundingBox CRS="CRS:84" minx="-180" miny="-85.0511287798066" maxx="180" maxy="85.0511287798066" />
      <BoundingBox CRS="CRS:84" minx="-180.0" miny="-85.0511287798066" maxx="180.0" maxy="85.0511287798066" />
      <BoundingBox CRS="EPSG:4326" minx="-85.0511287798066" miny="-180.0" maxx="85.0511287798066" maxy="180.0" />
      <BoundingBox CRS="EPSG:3857" minx="-20037508.342789244" miny="-20037508.342789244" maxx="20037508.342789244" maxy="20037508.342789244" />
      <BoundingBox CRS="EPSG:4258" minx="18.404252" miny="-35.999991" maxx="79.321963" maxy="53.99999400000001" />
      <BoundingBox CRS="EPSG:4839" minx="-2050368.9173328548" miny="-4255403.50983551" maxx="2871346.6385650905" maxy="3623206.2912081527" />
      <BoundingBox CRS="EPSG:25832" minx="-3797208.015863713" miny="3623285.141382178" maxx="4333808.739867987" maxy="8555787.976374663" />
      <BoundingBox CRS="EPSG:25833" minx="-4294940.671908557" miny="3482749.6755738934" maxx="3924769.3710252466" maxy="8577594.608156482" />
      <BoundingBox CRS="EPSG:4647" minx="28202791.984136287" miny="3623285.141382178" maxx="36333808.739867985" maxy="8555787.976374663" />
      <BoundingBox CRS="EPSG:5650" minx="28294161.10448142" miny="3529503.8998047784" maxx="36199767.186531976" maxy="8757293.589497142" />
      <BoundingBox CRS="EPSG:3034" minx="878723.9817977201" miny="84374.66680132737" maxx="5536720.936948574" maxy="8022103.660360625" />
      <BoundingBox CRS="EPSG:3035" minx="1252100.9980705858" miny="348606.4699198855" maxx="5986072.501824301" maxy="8392877.609543256" />
      <BoundingBox CRS="EPSG:3044" minx="3623285.141382178" miny="-3797208.015863713" maxx="8555787.976374663" maxy="4333808.739867987" />
      <BoundingBox CRS="EPSG:3045" minx="3482749.6755738934" miny="-4294940.671908557" maxx="8577594.608156482" maxy="3924769.3710252466" />
      <BoundingBox CRS="EPSG:31466" minx="5088781.397114682" miny="2389190.8416419327" maxx="6293431.791194725" maxy="3388662.3349912614" />
      <BoundingBox CRS="EPSG:31467" minx="5112556.611660988" miny="3099388.8453760566" maxx="6237932.920489833" maxy="4145164.256865643" />
      <BoundingBox CRS="EPSG:31468" minx="5129408.1809673505" miny="3831115.247455611" maxx="6222211.29969823" maxy="4912602.164312548" />
      <BoundingBox CRS="EPSG:31469" minx="5130858.418624354" miny="4555511.10373179" maxx="6243653.055363198" maxy="5678905.276833218" />
      <BoundingBox CRS="EPSG:5676" minx="2389190.8416419327" miny="5088781.397114682" maxx="3388662.3349912614" maxy="6293431.791194725" />
      <BoundingBox CRS="EPSG:5677" minx="3099388.8453760566" miny="5112556.611660988" maxx="4145164.256865643" maxy="6237932.920489833" />
      <BoundingBox CRS="EPSG:5678" minx="3831115.247455611" miny="5129408.1809673505" maxx="4912602.164312548" maxy="6222211.29969823" />
      <BoundingBox CRS="EPSG:5679" minx="4555511.10373179" miny="5130858.418624354" maxx="5678905.276833218" maxy="6243653.055363198" />
      <BoundingBox CRS="EPSG:5243" minx="-4255403.50983551" miny="-2050368.9173328548" maxx="3623206.2912081527" maxy="2871346.6385650905" />
      <AuthorityURL name="BKG">
        <OnlineResource xlink:href="https://registry.gdi-de.org/id/de.bund.bkg.csw/" />
      </AuthorityURL>
      <AuthorityURL name="BKG">
        <OnlineResource xlink:href="https://registry.gdi-de.org/id/de.bund.bkg.csw/" />
      </AuthorityURL>
      <Identifier authority="BKG">https://registry.gdi-de.org/id/de.bund.bkg.csw/a32e622a-1893-4744-9af4-e3f85c7c681c</Identifier>
      <Identifier authority="BKG">https://registry.gdi-de.org/id/de.bund.bkg.csw/ff457838-3c09-4199-b9c1-c3b83ac48b6d</Identifier>
      <MetadataURL type="INSPIRE">
        <Format>application/xml</Format>
        <OnlineResource xlink:href="https://mis.bkg.bund.de/csw?REQUEST=GetRecordById&amp;SERVICE=CSW&amp;VERSION=2.0.2&amp;elementSetName=full&amp;id=D4A0D975-36CA-4D6B-BDD5-F8EE6FC8782D"/>
      </MetadataURL>
      <MetadataURL type="INSPIRE">
        <Format>application/xml</Format>
        <OnlineResource xlink:href="https://mis.bkg.bund.de/csw?REQUEST=GetRecordById&amp;SERVICE=CSW&amp;VERSION=2.0.2&amp;elementSetName=full&amp;id=A1C4E929-3EC9-4758-9677-DB4970D226AB"/>
      </MetadataURL>
      <Style>
        <Name>inspire_common:DEFAULT</Name>
        <Title>default</Title>
        <LegendURL width="380" height="2580">
          <Format>image/png</Format>
          <OnlineResource xlink:type="simple" xlink:href="https://sgx.geodatenzentrum.de/wms_topplus_open?format=image%2Fpng&amp;layer=web_scale&amp;sld_version=1.1.0&amp;request=GetLegendGraphic&amp;service=WMS&amp;version=1.1.1&amp;styles=" />
        </LegendURL>
      </Style>
    </Layer>
    <Layer>
      <Name>web_scale_grau</Name>
      <Title>TopPlusOpen Graustufen (Upscale)</Title>
      <Abstract>Graustufendarstellung mit weltweiter Kartendarstellung. Für Regionen ohne Daten erfolgt eine Skalierung von Bilddaten vorangegangener Zoomstufen.
  </Abstract>
      <EX_GeographicBoundingBox>
        <westBoundLongitude>-180</westBoundLongitude>
        <eastBoundLongitude>180</eastBoundLongitude>
        <southBoundLatitude>-85.0511287798066</southBoundLatitude>
        <northBoundLatitude>85.0511287798066</northBoundLatitude>
      </EX_GeographicBoundingBox>
      <BoundingBox CRS="CRS:84" minx="-180" miny="-85.0511287798066" maxx="180" maxy="85.0511287798066" />
      <BoundingBox CRS="CRS:84" minx="-180.0" miny="-85.0511287798066" maxx="180.0" maxy="85.0511287798066" />
      <BoundingBox CRS="EPSG:4326" minx="-85.0511287798066" miny="-180.0" maxx="85.0511287798066" maxy="180.0" />
      <BoundingBox CRS="EPSG:3857" minx="-20037508.342789244" miny="-20037508.342789244" maxx="20037508.342789244" maxy="20037508.342789244" />
      <BoundingBox CRS="EPSG:4258" minx="18.404252" miny="-35.999991" maxx="79.321963" maxy="53.99999400000001" />
      <BoundingBox CRS="EPSG:4839" minx="-2050368.9173328548" miny="-4255403.50983551" maxx="2871346.6385650905" maxy="3623206.2912081527" />
      <BoundingBox CRS="EPSG:25832" minx="-3797208.015863713" miny="3623285.141382178" maxx="4333808.739867987" maxy="8555787.976374663" />
      <BoundingBox CRS="EPSG:25833" minx="-4294940.671908557" miny="3482749.6755738934" maxx="3924769.3710252466" maxy="8577594.608156482" />
      <BoundingBox CRS="EPSG:4647" minx="28202791.984136287" miny="3623285.141382178" maxx="36333808.739867985" maxy="8555787.976374663" />
      <BoundingBox CRS="EPSG:5650" minx="28294161.10448142" miny="3529503.8998047784" maxx="36199767.186531976" maxy="8757293.589497142" />
      <BoundingBox CRS="EPSG:3034" minx="878723.9817977201" miny="84374.66680132737" maxx="5536720.936948574" maxy="8022103.660360625" />
      <BoundingBox CRS="EPSG:3035" minx="1252100.9980705858" miny="348606.4699198855" maxx="5986072.501824301" maxy="8392877.609543256" />
      <BoundingBox CRS="EPSG:3044" minx="3623285.141382178" miny="-3797208.015863713" maxx="8555787.976374663" maxy="4333808.739867987" />
      <BoundingBox CRS="EPSG:3045" minx="3482749.6755738934" miny="-4294940.671908557" maxx="8577594.608156482" maxy="3924769.3710252466" />
      <BoundingBox CRS="EPSG:31466" minx="5088781.397114682" miny="2389190.8416419327" maxx="6293431.791194725" maxy="3388662.3349912614" />
      <BoundingBox CRS="EPSG:31467" minx="5112556.611660988" miny="3099388.8453760566" maxx="6237932.920489833" maxy="4145164.256865643" />
      <BoundingBox CRS="EPSG:31468" minx="5129408.1809673505" miny="3831115.247455611" maxx="6222211.29969823" maxy="4912602.164312548" />
      <BoundingBox CRS="EPSG:31469" minx="5130858.418624354" miny="4555511.10373179" maxx="6243653.055363198" maxy="5678905.276833218" />
      <BoundingBox CRS="EPSG:5676" minx="2389190.8416419327" miny="5088781.397114682" maxx="3388662.3349912614" maxy="6293431.791194725" />
      <BoundingBox CRS="EPSG:5677" minx="3099388.8453760566" miny="5112556.611660988" maxx="4145164.256865643" maxy="6237932.920489833" />
      <BoundingBox CRS="EPSG:5678" minx="3831115.247455611" miny="5129408.1809673505" maxx="4912602.164312548" maxy="6222211.29969823" />
      <BoundingBox CRS="EPSG:5679" minx="4555511.10373179" miny="5130858.418624354" maxx="5678905.276833218" maxy="6243653.055363198" />
      <BoundingBox CRS="EPSG:5243" minx="-4255403.50983551" miny="-2050368.9173328548" maxx="3623206.2912081527" maxy="2871346.6385650905" />
      <AuthorityURL name="BKG">
        <OnlineResource xlink:href="https://registry.gdi-de.org/id/de.bund.bkg.csw/" />
      </AuthorityURL>
      <AuthorityURL name="BKG">
        <OnlineResource xlink:href="https://registry.gdi-de.org/id/de.bund.bkg.csw/" />
      </AuthorityURL>
      <Identifier authority="BKG">https://registry.gdi-de.org/id/de.bund.bkg.csw/a32e622a-1893-4744-9af4-e3f85c7c681c</Identifier>
      <Identifier authority="BKG">https://registry.gdi-de.org/id/de.bund.bkg.csw/ff457838-3c09-4199-b9c1-c3b83ac48b6d</Identifier>
      <MetadataURL type="INSPIRE">
        <Format>application/xml</Format>
        <OnlineResource xlink:href="https://mis.bkg.bund.de/csw?REQUEST=GetRecordById&amp;SERVICE=CSW&amp;VERSION=2.0.2&amp;elementSetName=full&amp;id=D4A0D975-36CA-4D6B-BDD5-F8EE6FC8782D"/>
      </MetadataURL>
      <MetadataURL type="INSPIRE">
        <Format>application/xml</Format>
        <OnlineResource xlink:href="https://mis.bkg.bund.de/csw?REQUEST=GetRecordById&amp;SERVICE=CSW&amp;VERSION=2.0.2&amp;elementSetName=full&amp;id=A1C4E929-3EC9-4758-9677-DB4970D226AB"/>
      </MetadataURL>
      <Style>
        <Name>inspire_common:DEFAULT</Name>
        <Title>default</Title>
        <LegendURL width="380" height="2580">
          <Format>image/png</Format>
          <OnlineResource xlink:type="simple" xlink:href="https://sgx.geodatenzentrum.de/wms_topplus_open?format=image%2Fpng&amp;layer=web_scale_grau&amp;sld_version=1.1.0&amp;request=GetLegendGraphic&amp;service=WMS&amp;version=1.1.1&amp;styles=" />
        </LegendURL>
      </Style>
    </Layer>
    <Layer>
      <Name>web_light</Name>
      <Title>TopPlusOpen Light</Title>
      <Abstract>Der Layer TopPlusOpen-Light ist zur Verwendung als Hintergrundkarte gut geeignet und hat einen gegenüber der Volltonvariante der TopPlusOpen reduzierten Inhalt. Die Darstellung erfolgt in dezenter Farbgebung.
  </Abstract>
      <EX_GeographicBoundingBox>
        <westBoundLongitude>-180</westBoundLongitude>
        <eastBoundLongitude>180</eastBoundLongitude>
        <southBoundLatitude>-85.0511287798066</southBoundLatitude>
        <northBoundLatitude>85.0511287798066</northBoundLatitude>
      </EX_GeographicBoundingBox>
      <BoundingBox CRS="CRS:84" minx="-180" miny="-85.0511287798066" maxx="180" maxy="85.0511287798066" />
      <BoundingBox CRS="CRS:84" minx="-180.0" miny="-85.0511287798066" maxx="180.0" maxy="85.0511287798066" />
      <BoundingBox CRS="EPSG:4326" minx="-85.0511287798066" miny="-180.0" maxx="85.0511287798066" maxy="180.0" />
      <BoundingBox CRS="EPSG:3857" minx="-20037508.342789244" miny="-20037508.342789244" maxx="20037508.342789244" maxy="20037508.342789244" />
      <BoundingBox CRS="EPSG:4258" minx="18.404252" miny="-35.999991" maxx="79.321963" maxy="53.99999400000001" />
      <BoundingBox CRS="EPSG:4839" minx="-2050368.9173328548" miny="-4255403.50983551" maxx="2871346.6385650905" maxy="3623206.2912081527" />
      <BoundingBox CRS="EPSG:25832" minx="-3797208.015863713" miny="3623285.141382178" maxx="4333808.739867987" maxy="8555787.976374663" />
      <BoundingBox CRS="EPSG:25833" minx="-4294940.671908557" miny="3482749.6755738934" maxx="3924769.3710252466" maxy="8577594.608156482" />
      <BoundingBox CRS="EPSG:4647" minx="28202791.984136287" miny="3623285.141382178" maxx="36333808.739867985" maxy="8555787.976374663" />
      <BoundingBox CRS="EPSG:5650" minx="28294161.10448142" miny="3529503.8998047784" maxx="36199767.186531976" maxy="8757293.589497142" />
      <BoundingBox CRS="EPSG:3034" minx="878723.9817977201" miny="84374.66680132737" maxx="5536720.936948574" maxy="8022103.660360625" />
      <BoundingBox CRS="EPSG:3035" minx="1252100.9980705858" miny="348606.4699198855" maxx="5986072.501824301" maxy="8392877.609543256" />
      <BoundingBox CRS="EPSG:3044" minx="3623285.141382178" miny="-3797208.015863713" maxx="8555787.976374663" maxy="4333808.739867987" />
      <BoundingBox CRS="EPSG:3045" minx="3482749.6755738934" miny="-4294940.671908557" maxx="8577594.608156482" maxy="3924769.3710252466" />
      <BoundingBox CRS="EPSG:31466" minx="5088781.397114682" miny="2389190.8416419327" maxx="6293431.791194725" maxy="3388662.3349912614" />
      <BoundingBox CRS="EPSG:31467" minx="5112556.611660988" miny="3099388.8453760566" maxx="6237932.920489833" maxy="4145164.256865643" />
      <BoundingBox CRS="EPSG:31468" minx="5129408.1809673505" miny="3831115.247455611" maxx="6222211.29969823" maxy="4912602.164312548" />
      <BoundingBox CRS="EPSG:31469" minx="5130858.418624354" miny="4555511.10373179" maxx="6243653.055363198" maxy="5678905.276833218" />
      <BoundingBox CRS="EPSG:5676" minx="2389190.8416419327" miny="5088781.397114682" maxx="3388662.3349912614" maxy="6293431.791194725" />
      <BoundingBox CRS="EPSG:5677" minx="3099388.8453760566" miny="5112556.611660988" maxx="4145164.256865643" maxy="6237932.920489833" />
      <BoundingBox CRS="EPSG:5678" minx="3831115.247455611" miny="5129408.1809673505" maxx="4912602.164312548" maxy="6222211.29969823" />
      <BoundingBox CRS="EPSG:5679" minx="4555511.10373179" miny="5130858.418624354" maxx="5678905.276833218" maxy="6243653.055363198" />
      <BoundingBox CRS="EPSG:5243" minx="-4255403.50983551" miny="-2050368.9173328548" maxx="3623206.2912081527" maxy="2871346.6385650905" />
      <AuthorityURL name="BKG">
        <OnlineResource xlink:href="https://registry.gdi-de.org/id/de.bund.bkg.csw/" />
      </AuthorityURL>
      <AuthorityURL name="BKG">
        <OnlineResource xlink:href="https://registry.gdi-de.org/id/de.bund.bkg.csw/" />
      </AuthorityURL>
      <Identifier authority="BKG">https://registry.gdi-de.org/id/de.bund.bkg.csw/a4d7e490-7285-457b-8186-43894330e58e</Identifier>
      <Identifier authority="BKG">https://registry.gdi-de.org/id/de.bund.bkg.csw/be9acc2f-0c50-4474-993f-372923dc4293</Identifier>
      <MetadataURL type="INSPIRE">
        <Format>application/xml</Format>
        <OnlineResource xlink:href="https://mis.bkg.bund.de/csw?REQUEST=GetRecordById&amp;SERVICE=CSW&amp;VERSION=2.0.2&amp;elementSetName=full&amp;id=CE041458-231F-478E-BB2C-00F428AB02AA"/>
      </MetadataURL>
      <MetadataURL type="INSPIRE">
        <Format>application/xml</Format>
        <OnlineResource xlink:href="https://mis.bkg.bund.de/csw?REQUEST=GetRecordById&amp;SERVICE=CSW&amp;VERSION=2.0.2&amp;elementSetName=full&amp;id=BD4D5B0F-2809-44D4-B2CE-D22ACC4CE0CC"/>
      </MetadataURL>
      <Style>
        <Name>inspire_common:DEFAULT</Name>
        <Title>default</Title>
        <LegendURL width="380" height="1490">
          <Format>image/png</Format>
          <OnlineResource xlink:type="simple" xlink:href="https://sgx.geodatenzentrum.de/wms_topplus_open?format=image%2Fpng&amp;layer=web_light&amp;sld_version=1.1.0&amp;request=GetLegendGraphic&amp;service=WMS&amp;version=1.1.1&amp;styles=" />
        </LegendURL>
      </Style>
    </Layer>
    <Layer>
      <Name>web_light_grau</Name>
      <Title>TopPlusOpen Light Grau</Title>
      <Abstract>Der Layer TopPlusOpen-Light-Grau ist zur Verwendung als Hintergrundkarte gut geeignet und hat einen gegenüber der Volltonvariante der TopPlusOpen reduzierten Inhalt. Die Darstellung erfolgt in Grautönen und einzelnen blassen Farben (Grenzen, Gewässer).
  </Abstract>
      <EX_GeographicBoundingBox>
        <westBoundLongitude>-180</westBoundLongitude>
        <eastBoundLongitude>180</eastBoundLongitude>
        <southBoundLatitude>-85.0511287798066</southBoundLatitude>
        <northBoundLatitude>85.0511287798066</northBoundLatitude>
      </EX_GeographicBoundingBox>
      <BoundingBox CRS="CRS:84" minx="-180" miny="-85.0511287798066" maxx="180" maxy="85.0511287798066" />
      <BoundingBox CRS="CRS:84" minx="-180.0" miny="-85.0511287798066" maxx="180.0" maxy="85.0511287798066" />
      <BoundingBox CRS="EPSG:4326" minx="-85.0511287798066" miny="-180.0" maxx="85.0511287798066" maxy="180.0" />
      <BoundingBox CRS="EPSG:3857" minx="-20037508.342789244" miny="-20037508.342789244" maxx="20037508.342789244" maxy="20037508.342789244" />
      <BoundingBox CRS="EPSG:4258" minx="18.404252" miny="-35.999991" maxx="79.321963" maxy="53.99999400000001" />
      <BoundingBox CRS="EPSG:4839" minx="-2050368.9173328548" miny="-4255403.50983551" maxx="2871346.6385650905" maxy="3623206.2912081527" />
      <BoundingBox CRS="EPSG:25832" minx="-3797208.015863713" miny="3623285.141382178" maxx="4333808.739867987" maxy="8555787.976374663" />
      <BoundingBox CRS="EPSG:25833" minx="-4294940.671908557" miny="3482749.6755738934" maxx="3924769.3710252466" maxy="8577594.608156482" />
      <BoundingBox CRS="EPSG:4647" minx="28202791.984136287" miny="3623285.141382178" maxx="36333808.739867985" maxy="8555787.976374663" />
      <BoundingBox CRS="EPSG:5650" minx="28294161.10448142" miny="3529503.8998047784" maxx="36199767.186531976" maxy="8757293.589497142" />
      <BoundingBox CRS="EPSG:3034" minx="878723.9817977201" miny="84374.66680132737" maxx="5536720.936948574" maxy="8022103.660360625" />
      <BoundingBox CRS="EPSG:3035" minx="1252100.9980705858" miny="348606.4699198855" maxx="5986072.501824301" maxy="8392877.609543256" />
      <BoundingBox CRS="EPSG:3044" minx="3623285.141382178" miny="-3797208.015863713" maxx="8555787.976374663" maxy="4333808.739867987" />
      <BoundingBox CRS="EPSG:3045" minx="3482749.6755738934" miny="-4294940.671908557" maxx="8577594.608156482" maxy="3924769.3710252466" />
      <BoundingBox CRS="EPSG:31466" minx="5088781.397114682" miny="2389190.8416419327" maxx="6293431.791194725" maxy="3388662.3349912614" />
      <BoundingBox CRS="EPSG:31467" minx="5112556.611660988" miny="3099388.8453760566" maxx="6237932.920489833" maxy="4145164.256865643" />
      <BoundingBox CRS="EPSG:31468" minx="5129408.1809673505" miny="3831115.247455611" maxx="6222211.29969823" maxy="4912602.164312548" />
      <BoundingBox CRS="EPSG:31469" minx="5130858.418624354" miny="4555511.10373179" maxx="6243653.055363198" maxy="5678905.276833218" />
      <BoundingBox CRS="EPSG:5676" minx="2389190.8416419327" miny="5088781.397114682" maxx="3388662.3349912614" maxy="6293431.791194725" />
      <BoundingBox CRS="EPSG:5677" minx="3099388.8453760566" miny="5112556.611660988" maxx="4145164.256865643" maxy="6237932.920489833" />
      <BoundingBox CRS="EPSG:5678" minx="3831115.247455611" miny="5129408.1809673505" maxx="4912602.164312548" maxy="6222211.29969823" />
      <BoundingBox CRS="EPSG:5679" minx="4555511.10373179" miny="5130858.418624354" maxx="5678905.276833218" maxy="6243653.055363198" />
      <BoundingBox CRS="EPSG:5243" minx="-4255403.50983551" miny="-2050368.9173328548" maxx="3623206.2912081527" maxy="2871346.6385650905" />
      <AuthorityURL name="BKG">
        <OnlineResource xlink:href="https://registry.gdi-de.org/id/de.bund.bkg.csw/" />
      </AuthorityURL>
      <AuthorityURL name="BKG">
        <OnlineResource xlink:href="https://registry.gdi-de.org/id/de.bund.bkg.csw/" />
      </AuthorityURL>
      <Identifier authority="BKG">https://registry.gdi-de.org/id/de.bund.bkg.csw/07d89e5c-16ef-41d7-8123-1ca22aaa9b62</Identifier>
      <Identifier authority="BKG">https://registry.gdi-de.org/id/de.bund.bkg.csw/f08c49f7-4f0f-4c00-9134-4da1cd2d7917</Identifier>
      <MetadataURL type="INSPIRE">
        <Format>application/xml</Format>
        <OnlineResource xlink:href="https://mis.bkg.bund.de/csw?REQUEST=GetRecordById&amp;SERVICE=CSW&amp;VERSION=2.0.2&amp;elementSetName=full&amp;id=FF838D19-57A1-4C9B-AC83-4A2083946088"/>
      </MetadataURL>
      <MetadataURL type="INSPIRE">
        <Format>application/xml</Format>
        <OnlineResource xlink:href="https://mis.bkg.bund.de/csw?REQUEST=GetRecordById&amp;SERVICE=CSW&amp;VERSION=2.0.2&amp;elementSetName=full&amp;id=2963E7F6-D7D5-47FC-B9B1-98B22D89AADA"/>
      </MetadataURL>
      <Style>
        <Name>inspire_common:DEFAULT</Name>
        <Title>default</Title>
        <LegendURL width="380" height="1490">
          <Format>image/png</Format>
          <OnlineResource xlink:type="simple" xlink:href="https://sgx.geodatenzentrum.de/wms_topplus_open?format=image%2Fpng&amp;layer=web_light_grau&amp;sld_version=1.1.0&amp;request=GetLegendGraphic&amp;service=WMS&amp;version=1.1.1&amp;styles=" />
        </LegendURL>
      </Style>
    </Layer>
  </Layer>
</Capability>
</WMS_Capabilities>`;

const parser: DOMParser = new DOMParser();
const xmlDoc: Document = parser.parseFromString(xmlCapabilities, "text/xml");
const capabilityNode: Element = xmlDoc.documentElement.getElementsByTagName("Capability")[0];

const doc = parser.parseFromString(
    `<Element>
    <Title>WMS TopPlusOpen</Title>
    <CRS>CRS:84</CRS>
    <CRS>EPSG:4326</CRS>
    <CRS>EPSG:3857</CRS>
    <CRS>EPSG:4258</CRS>
    <CRS>EPSG:25832</CRS>
    <CRS>EPSG:25833</CRS>
    <CRS>EPSG:4647</CRS>
    <CRS>EPSG:5650</CRS>
    <CRS>EPSG:3034</CRS>
    <CRS>EPSG:3035</CRS>
    <CRS>EPSG:3044</CRS>
    <CRS>EPSG:3045</CRS>
    <CRS>EPSG:31466</CRS>
    <CRS>EPSG:31467</CRS>
    <CRS>EPSG:31468</CRS>
    <CRS>EPSG:31469</CRS>
    <CRS>EPSG:5676</CRS>
    <CRS>EPSG:5677</CRS>
    <CRS>EPSG:5678</CRS>
    <CRS>EPSG:5679</CRS>
    <CRS>EPSG:4839</CRS>
    <CRS>EPSG:5243</CRS>
    </Element>`, "text/xml");

  const withoutOlDefaultEPSG = parser.parseFromString(
      `<ParentElement>
      <Layer>
      <Title>WMS TopPlusOpen</Title>
      <CRS>CRS:84</CRS>
      <CRS>EPSG:4326</CRS>
      <CRS>EPSG:4258</CRS>
      <CRS>EPSG:25832</CRS>
      <CRS>EPSG:25833</CRS>
      <CRS>EPSG:4647</CRS>
      <CRS>EPSG:5650</CRS>
      <CRS>EPSG:3034</CRS>
      <CRS>EPSG:3035</CRS>
      <CRS>EPSG:3044</CRS>
      <CRS>EPSG:3045</CRS>
      <CRS>EPSG:31466</CRS>
      <CRS>EPSG:31467</CRS>
      <CRS>EPSG:31468</CRS>
      <CRS>EPSG:31469</CRS>
      <CRS>EPSG:5676</CRS>
      <CRS>EPSG:5677</CRS>
      <CRS>EPSG:5678</CRS>
      <CRS>EPSG:5679</CRS>
      <CRS>EPSG:4839</CRS>
      <CRS>EPSG:5243</CRS>
      </Layer>
      </ParentElement>`, "text/xml");

describe("Test getFirstDirectChildNodeByLocalName", () => {
    test("empty node list", () => {
        let node = getFirstDirectChildNodeByLocalName(xmlDoc.getElementsByName(""), "Layer");
        expect(node).toBe(undefined);
    });

    test("empty string", () => {
        let node = getFirstDirectChildNodeByLocalName(capabilityNode.childNodes, "");
        expect(node).toBe(undefined);
    });

    test("normal call", () => {
      let node = getFirstDirectChildNodeByLocalName(withoutOlDefaultEPSG.documentElement.childNodes, "Layer");
      expect(node.nodeName).toBe("Layer");
  });
}
);

describe("Test getAllDirectChildNodesByLocalName", () => {
    test("normal function call", () => {
        let crsNodes = getAllDirectChildNodesByLocalName(doc.documentElement.childNodes, "CRS");
        expect(crsNodes.length).toBe(doc.getElementsByTagName("CRS").length);
    });

    test("empty string", () => {
        let crsNodes = getAllDirectChildNodesByLocalName(doc.documentElement.childNodes, "");
        expect(crsNodes.length).toBe(0);
    });

    test("empty node list", () => {
        let crsNodes = getAllDirectChildNodesByLocalName(((doc.documentElement.getElementsByTagName("") as unknown) as NodeListOf<ChildNode>), "CRS");
        expect(crsNodes.length).toBe(0);
    });
});

describe("Test getWMSLayers", () => {
    test("normal function call", () => {
        let layers = getWMSLayers(capabilityNode);
        expect(layers.length).toBe(6);
    });

    test("no wms layer in node", () => {
        let layers = getWMSLayers(doc.documentElement);
        expect(layers.length).toBe(0);
    });
});

// describe("Mocking api calls", () => {
//     test("test getProjDefinition", async () => {
//         let def = await getProjDefinition(new URL("http://test.de"));
//         expect(def).toBe("test");
//     });
// });

describe("Integration test with API call epsg.io", () => {
  test.skip("test getProjection when default OpenLayers EPSG code is available", async () => {
    let epsgCode = await getProjection(capabilityNode);
    expect(epsgCode).toBe("EPSG:3857");
  }, 5000);

  test.skip("test getProjection when default OpenLayers EPSG code is NOT available -> first entry should be chosen that begins with 'EPSG'", async () => {
    let epsgCode = await getProjection(withoutOlDefaultEPSG.documentElement);
    expect(epsgCode).toBe("EPSG:4326");
  }, 10000);
})

describe("Integration test with API call", () => {
  test("test getWMSCapabilitiesFromService with invalid url", async () => {
      try {
        await getWMSCapabilitiesFromService("");
      } catch (error) {
        expect((error as Error).name).toBe("TypeError");
      }
    }
  );

  // Arbitrary URL
  test.skip("test getWMSCapabilitiesFromService with arbitrary url that is no WMS endpoint", async () => {
    try {
      await getWMSCapabilitiesFromService("http://www.google.de");
    } catch (error) {
      expect((error as Error).name).toBe("TypeError");
    }
  });

  // TODO: 
  // test("test getWMSCapabilitiesFromService with valid url", async () => {
  //   try {
  //     await getWMSCapabilitiesFromService("");
  //   } catch (error) {
  //     expect((error as Error).name).toBe("TypeError");
  //   }
  // });
})


describe("Integration test wms base layer", () => {
  test("test create function with empty config object (i.e. first access to panel in edit mode)", async () => {
    const wmsInstance = wms;
    const cfg = {
      wmsBaselayer: [
          {
          url: "",
          layers: [],
          opacity: 1.0,
          showLegend: false,
          attribution: ""
        }
      ]
    };
    let imageLayerGroup = (await wmsInstance.create(new Map({}), {
      config: cfg,
      type: "wms"
    }, config.theme2)).init();

    //  Since there are no layers selected an empty image layer instance is returned by the init()-function
    expect((imageLayerGroup as LayerGroup).getLayers().getLength()).toBe(0);

  });

  test.skip("test create function with config object contains url but no layers (i.e. user just typed WMS endpoint url but did not select layer from dropdown)", async () => {
    const wmsInstance = wms;
    const cfg = {
      wmsBaselayer: [
          {
          url: "https://sgx.geodatenzentrum.de/wms_topplus_open",
          layers: [],
          opacity: 1.0,
          showLegend: false,
          attribution: ""
        }
      ]
    };
    let imageLayer = (await wmsInstance.create(new Map({}), {
      config: cfg,
      type: "wms"
    }, config.theme2)).init();

    //  Since there are no layers selected an empty image layer instance is returned by the init()-function
    expect((imageLayer as ImageLayer<ImageWMS>).getSource()).toBe(null);

  });

  test.skip("test create function with config object contains url and single layer (i.e. user typed WMS endpoint url and selected layer from dropdown)", async () => {
    const wmsInstance = wms;
    const cfg = {
      wmsBaselayer: [
            {
            url: "https://sgx.geodatenzentrum.de/wms_topplus_open?service=wms&version=1.3.0",
            layers: [{name: 'web_grau', title: "Grau"}],
            opacity: 1.0,
            showLegend: false,
            attribution: ""
          }
        ]
      };
    let imageLayerGroup = (await wmsInstance.create(new Map({}), {
      config: cfg,
      type: "wms"
    }, config.theme2)).init();

    //  Since there are no layers selected an empty image layer instance is returned by the init()-function
    let layers: string[] = [];
    cfg.wmsBaselayer.forEach((e) => {
      e.layers.forEach((a) => layers.push(a.name));
    });

    expect(((imageLayerGroup.getLayersArray()[0] as ImageLayer<ImageWMS>).getSource() as ImageWMS).getParams()['LAYERS']).toBe(layers.join(','));

  });

});
