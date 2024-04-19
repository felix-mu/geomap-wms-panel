set HTTP_PROXY=http://10.158.0.85:80
set HTTPS_PROXY=http://10.158.0.85:80

curl -LO "https://dl.k8s.io/release/v1.28.4/bin/windows/amd64/kubectl.exe"

set PATH=%PATH%;%cd%