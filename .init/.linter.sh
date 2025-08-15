#!/bin/bash
cd /home/kavia/workspace/code-generation/f1-fan-dashboard-159753-159762/f1_dashboard_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

