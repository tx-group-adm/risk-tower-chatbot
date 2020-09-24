#!/bin/bash
set -eu

cd ~/project/config

jq --arg dced "$DIALOGFLOW_CLIENT_EMAIL_DEV" '.DIALOGFLOW_CLIENT_EMAIL_DEV = $dced' config.dev.json

jq --arg dpkd "$DIALOGFLOW_PRIVATE_KEY_DEV" '.DIALOGFLOW_PRIVATE_KEY_DEV = $dpkd' config.dev.json

jq --arg dpid "$DIALOGFLOW_PROJECT_ID_DEV" '.DIALOGFLOW_PROJECT_ID_DEV = $dpid' config.dev.json

jq --arg sbtd "$SLACK_BOT_TOKEN_DEV" '.SLACK_BOT_TOKEN_DEV = $sbtd' config.dev.json

jq --arg dcep "$DIALOGFLOW_CLIENT_EMAIL_PROD" '.DIALOGFLOW_CLIENT_EMAIL_PROD = $dcep' config.prod.json

jq --arg dpkp "$DIALOGFLOW_PRIVATE_KEY_PROD" '.DIALOGFLOW_PRIVATE_KEY_PROD = $dpkp' config.prod.json

jq --arg dpip "$DIALOGFLOW_PROJECT_ID_PROD" '.DIALOGFLOW_PROJECT_ID_PROD = $dpip' config.prod.json

jq --arg sbtp "$SLACK_BOT_TOKEN_PROD" '.SLACK_BOT_TOKEN_PROD = $sbtp' config.prod.json