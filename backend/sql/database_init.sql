CREATE DATABASE fse;

CREATE USER 'esnbackend'@'%' IDENTIFIED BY 's23-esn-s2023';
GRANT ALL ON *.* TO 'esnbackend'@'%';

FLUSH PRIVILEGES;