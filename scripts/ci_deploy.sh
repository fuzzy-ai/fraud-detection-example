#!/bin/bash

# update gcloud components
sudo gcloud components update -q
sudo gcloud components install kubectl -q
sudo chown -R $USER $HOME/.config/gcloud

# configure gcloud for travis service account
gcloud config set container/use_client_certificate True
gcloud auth activate-service-account $GCLOUD_ACCOUNT --key-file=client-secret.json
gcloud config set compute/zone us-west1-a
gcloud config set project $GCLOUD_PROJECT_ID
gcloud config set account $GCLOUD_ACCOUNT
gcloud container clusters get-credentials $GCLOUD_CLUSTER

# push to GCR
docker tag fuzzyai/$PROJECT gcr.io/$GCLOUD_PROJECT_ID/$PROJECT
gcloud docker -- push gcr.io/$GCLOUD_PROJECT_ID/$PROJECT:latest
docker tag fuzzyai/$PROJECT gcr.io/$GCLOUD_PROJECT_ID/$PROJECT:$TRAVIS_TAG
gcloud docker -- push gcr.io/$GCLOUD_PROJECT_ID/$PROJECT:$TRAVIS_TAG

# Deploy the new tag
kubectl set image deployment/$PROJECT $PROJECT=gcr.io/$GCLOUD_PROJECT_ID/$PROJECT:$TRAVIS_TAG
