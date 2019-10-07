#!/bin/sh
if [ -z "$1" ]
then
  echo "Name of commit for production push ?"
  exit 1
fi

CURRENT_BRANCH=$(git branch | grep \* | cut -d ' ' -f2)

LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "master")

# Check if we are on master branch
if [ $CURRENT_BRANCH != "master" ]; then
    echo "Might be on master branch to deploy"
    echo "Current branch is '$CURRENT_BRANCH'"
    exit 1

# Check if we haven't unstaged changes
elif [ $LOCAL != $REMOTE ]; then
    echo "Cannot deploy with unstaged changes, local repository need to be up-to-date with remote."
    echo "Run 'git add . && git commit -m \"YOUR_COMMIT_MESSAGE\"'"
    exit 1
else
    npm run build || exit 1

    # Remove deploy folder and create new one
    rm -rf deploy
    mkdir -p deploy

    # Copy package from service, app and dist build
    cp services/package.json deploy
    cp -RT services/dist deploy
    cp -RT app/dist deploy/app

    git add deploy && git commit -m "$1"
    git subtree push --prefix deploy origin production

    rm -rf deploy
    git reset --hard HEAD
fi
