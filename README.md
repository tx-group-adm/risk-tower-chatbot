# Risk Tower Chatbot

A Slackbot for the Risk Tower, developed using Nodejs, TypeScript and Google Dialogflow. Interact with the chatbot in a human-like conversation in order to receive the risk tower data you need - without leaving Slack!

## What is inside?

The service is using what should be used as best practice in every other Node.js based services:

- aws lambda, as the http api
- axios, as http client
- circleci configuration, in order to build a CI/CD pipeline
- @slack/web-api, for interacting with the slack API
- @google-cloud/dialogflow, for interacting with the Dialogflow API

## Environment variables

- AWS_ACCESS_KEY_ID: Credentials for AWS
- AWS_SECRET_ACCESS_KEY: Credentials for AWS
- DIALOGFLOW_CLIENT_EMAIL_DEV: Dialogflow client email, you can get all the dialogflow credentials [here](https://www.aitude.com/how-to-get-dialogflow-api-credentials/)
- DIALOGFLOW_CLIENT_EMAIL_PROD: -
- DIALOGFLOW_PRIVATE_KEY_DEV: Dialogflow private key, can also be found in the dialogflow credentials file mentioned above
- DIALOGFLOW_PRIVATE_KEY_PROD: -
- DIALOGFLOW_PROJECT_ID_DEV: Dialogflow project ID
- DIALOGFLOW_PROJECT_ID_PROD: -
- DOMAIN_DEV: The domain where the risk tower is running, f.e. `mydomain.com`
- DOMAIN_PROD: -
- OKTA_CLIENT_ID_DEV: The Okta Client ID used to authenticate with the risk tower API
- OKTA_CLIENT_ID_PROD: -
- OKTA_CLIENT_SECRET_DEV: The Okta Client Secret used to authenticate with the risk tower API
- OKTA_CLIENT_SECRET_PROD: -
- SLACK_BOT_TOKEN_DEV: The Slack Bot token, you receive this once you have created the slack apps (use the manifest files)
- SLACK_BOT_TOKEN_PROD: -

## How to get started

Make sure that the risk tower is completely setup before you try and install the risk tower chatbot
You can find the risk tower (here)[https://github.com/tx-group-adm/risk-tower].

### Steps

1. Fork the repository to your teams account

- You will need to setup a CircleCI pipeline for that repo later

2. Set up dialogflow

- Set up two different Google Cloud Projects (They are needed in order to install the dialogflow agents for dev and prod)
- Create two new dialogflow agents through the (dialogflow console)[https://dialogflow.com], f.e. "Risk Tower Security DEV" and "Risk Tower Security"
- For both agents, import the agents from the two .zip files (Risk_Tower_Security_DEV.zip & Risk_Tower_Security.zip)

3. Set up CircleCI

- Got to (CircleCI)[https://circleci.com] and navigate to the projects tab
- Search for the `risk-tower-chatbot` repository and click "Set Up Project"
- Select the repository and the develop branch
- Let the "un-tagged-build" workflow run, it will install all the dependencies and try to build to project
- Go to Project Settings > Environment Variables
- Add every environment variable that is defined above
- Now you can create a feature branch, create a pull request (feature_branch -> develop) and merge the changes into the develop branch. This will trigger the staging-build workflow which will deploy the chatbot to your dev environment
- If you want to deploy to production, create a pull request (develop -> master) and merge it, then create a new tag on the master branch (`git tag -a v1.0.0 -m "Deploy version 1.0.0 to production"`). If you push the tag (`git push origin v1.0.0`), it will trigger the prod deploy.

4. Set up the Slack apps

- Create two new Slack apps (here)[https://api.slack.com/apps]
- For both apps do the following:
  - Edit the files `manifest_dev.json` and `manifest_prod.json` and add your lambda url under `settings.event_subscriptions.request_url` as well as `settings.interactivity.request_url`
  - Create a new slack app from a manifest (Use the files `manifest_dev.json` and `manifest_prod.json`)

5. Update the Dialogflow companies

- Trigger the update-dialogflow-companies lambda, either via a simple post request to your deployed lambda (<your_lambda_url>/update-dialogflow-companies) or by telling the chatbot "Update the dialogflow companies". You need to do this for both environments. (This will create dialogflow entities for all the companies you have in your risk tower, without that dialogflow can't extract the companies you provide in your requests)

6. You're done, have fun with the risk tower chatbot :)
