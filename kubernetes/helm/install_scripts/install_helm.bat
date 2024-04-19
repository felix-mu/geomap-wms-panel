set zipFile=helm.zip
set installPath=%cd%
set HTTP_PROXY=http://10.158.0.85:80
set HTTPS_PROXY=http://10.158.0.85:80

REM Download binary helm release
curl https://get.helm.sh/helm-v3.13.2-windows-amd64.zip -o %installPath%\%zipFile%
tar -xvf %installPath%\%zipFile%

REM Clean directories
move %installPath%\windows-amd64\helm.exe %installPath%\
rmdir %installPath%\windows-amd64 /s /q
del %installPath%\%zipFile%

set PATH=%PATH%;%installPath%