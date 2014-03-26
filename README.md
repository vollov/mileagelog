#mileagelog

Single Page Application with ACL Restful Application. Client side implemented with angluarjs, server side with expressjs, mongodb, redis.

##Overview
The application implement a multiple user application to record mileages for business.

##Use cases
* User can do registration and login.
* User can add multiple vehicles in settings page.
* User can add/edit/delete milages under a vehicle.
* Session expires in every 15 minutes.

** User can define custom routes to add mileage quickly.

##Maintainance
###Databese Backup

backup table
export
mongoexport --db sfm --collection events --out sfm_events.json
import
mongoimport -d sfm_test -c events --file sfm_events.json

backup database
mongodump -d <our database name> -o <directory_backup>
mongorestore <our database name>

mongodump --db mileage
mongorestore -d mileage_test ./dump/mileage

##TODO:
* add https implementation
* revise test cases for server
