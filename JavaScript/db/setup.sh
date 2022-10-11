psql -f install.sql -U anton
PGPASSWORD=412315 psql -d example -f structure.sql -U anton
PGPASSWORD=412315 psql -d example -f data.sql -U anton
