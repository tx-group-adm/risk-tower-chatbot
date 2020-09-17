#!/bin/bash
set -eu

jq --arg pk "$DIALOGFLOW_CLIENT_EMAIL_DEV" '.DIALOGFLOW_CLIENT_EMAIL_DEV = $pk' config.dev.json > config.dev.json.tmp \
    && mv config.dev.json.tmp config.dev.json

jq --arg pk "$DIALOGFLOW_PRIVATE_KEY_DEV" '.DIALOGFLOW_PRIVATE_KEY_DEV = $pk' config.dev.json > config.dev.json.tmp \
    && mv config.dev.json.tmp config.dev.json

jq --arg pk "$DIALOGFLOW_PROJECT_ID_DEV" '.DIALOGFLOW_PROJECT_ID_DEV = $pk' config.dev.json > config.dev.json.tmp \
    && mv config.dev.json.tmp config.dev.json

jq --arg pk "$SLACK_BOT_TOKEN_DEV" '.SLACK_BOT_TOKEN_DEV = $pk' config.dev.json > config.dev.json.tmp \
    && mv config.dev.json.tmp config.dev.json

jq --arg pk "$DIALOGFLOW_CLIENT_EMAIL_PROD" '.DIALOGFLOW_CLIENT_EMAIL_PROD = $pk' config.prod.json > config.prod.json.tmp \
    && mv config.prod.json.tmp config.prod.json

jq --arg pk "$DIALOGFLOW_PRIVATE_KEY_PROD" '.DIALOGFLOW_PRIVATE_KEY_PROD = $pk' config.prod.json > config.prod.json.tmp \
    && mv config.prod.json.tmp config.prod.json

jq --arg pk "$DIALOGFLOW_PROJECT_ID_PROD" '.DIALOGFLOW_PROJECT_ID_PROD = $pk' config.prod.json > config.prod.json.tmp \
    && mv config.prod.json.tmp config.prod.json

jq --arg pk "$SLACK_BOT_TOKEN_PROD" '.SLACK_BOT_TOKEN_PROD = $pk' config.prod.json > config.dev.prod.tmp \
    && mv config.prod.json.tmp config.prod.json