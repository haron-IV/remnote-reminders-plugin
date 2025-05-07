#!/bin/bash
docker exec application-mongo-1 mongodump --db remnote_notification_plugin --out /backup/
docker cp application-mongo-1:/backup/remnote_notification_plugin ./backup/remnote_notification_plugin
cd ./backup

# In case of any errors just create a directory mkdir backup

current_date=$(date +"%d-%m-%Y_%H-%M")

mv remnote_notification_plugin remnote_notification_plugin-$current_date