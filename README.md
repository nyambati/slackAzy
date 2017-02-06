# slackAzy
This scripts automates freckle time login, It takes a range of dates and logs specified hours excluding weekends

## Usage

Clone this repo, add `.env` file in the root of the project. Below is sample of what you need in this file.
``` bash
# This freckle personal access token
PERSONAL_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxx
# This the project name you are login hours to
PROJECT_NAME=The Magic Apples
# This are the tags you want to associate the hours with
TAG_NAMES=#DevOps #Launchpad
# This is the number of hours you want to log
HOURS=9
# This is the range of dates you want to log timw within.
# The start date has to be lower than end date as shown below
START_DATE=2017-1-10
END_DATE=2017-2-5
```
This is script is experimental, therefore should be run with outmost care.
