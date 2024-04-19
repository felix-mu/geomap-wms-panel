minikube start

helm dependency build .
helm install grafana-geomap-wms .