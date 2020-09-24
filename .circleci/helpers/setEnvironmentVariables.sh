#!/bin/bash
set -eu

cd ~/project/config

jq --arg pk "$DIALOGFLOW_PRIVATE_KEY_DEV" '.DIALOGFLOW_PRIVATE_KEY_DEV = $pk' config.dev.json

sed -i 's~###DIALOGFLOW_CLIENT_EMAIL###~"$DIALOGFLOW_CLIENT_EMAIL_DEV"~' config.dev.json
sed -i 's~###DIALOGFLOW_PROJECT_ID###~"$DIALOGFLOW_PROJECT_ID_DEV"~' config.dev.json
sed -i 's~###SLACK_BOT_TOKEN###~"$SLACK_BOT_TOKEN_DEV"~' config.dev.json


jq --arg pk "$DIALOGFLOW_PRIVATE_KEY_PROD" '.DIALOGFLOW_PRIVATE_KEY_PROD = $pk' config.prod.json

sed -i 's~###DIALOGFLOW_CLIENT_EMAIL###~"$DIALOGFLOW_CLIENT_EMAIL_PROD"~' config.prod.json
sed -i 's~###DIALOGFLOW_PROJECT_ID###~"$DIALOGFLOW_PROJECT_ID_PROD"~' config.prod.json
sed -i 's~###SLACK_BOT_TOKEN###~"$SLACK_BOT_TOKEN_PROD"~' config.prod.json