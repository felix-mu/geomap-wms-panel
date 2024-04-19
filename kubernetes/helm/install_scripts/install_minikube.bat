set HTTP_PROXY=http://10.158.0.85:80
set HTTPS_PROXY=http://10.158.0.85:80

curl https://github.com/kubernetes/minikube/releases/download/v1.32.0/minikube-windows-amd64.exe -o minikube.exe

set PATH=%PATH%;%cd%