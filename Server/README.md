**Settup project**
1. Edit connection string of database in appsettings.json
2. Build project
3. Migrations - Open cmd at Server project:	`dotnet ef database update` 
4. If update migration error -> delete old database and try again
5. Run project
	