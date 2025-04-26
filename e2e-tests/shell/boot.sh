#!/bin/bash
set -e  

cleanup() {
    echo "⏳ Timeout reached or script interrupted! Collecting artifacts..."
    cp -r artifacts /tmp/artifacts
}

# Trap SIGTERM (sent when timeout occurs)
trap cleanup TERM EXIT

while true; do
  PODS=$(kubectl get pods -n $NAMESPACE | grep $RELEASE_NAME || true)
  echo "$PODS"
  
  # Filter only relevant pods
  NEEDED_PODS=$(echo "$PODS" | grep -E '^(api-|api-verifier|web-verifier-|board-checker-|web-|db-|redis-|rabbitmq-)')
  echo "Needed Pods:"
  echo "$NEEDED_PODS" | tr ' ' '\n'

  FAILED_PODS=$(echo "$NEEDED_PODS" | awk '$3 !~ /^(Running|Pending|ContainerCreating|Terminating|Init:[0-9]+\/[0-9]+)$/ {print $1}')
  echo "Failed Pods:"
  echo "$FAILED_PODS" | tr ' ' '\n'

  if [ -n "$FAILED_PODS" ]; then
    for POD in $FAILED_PODS; do
      echo "📌 Failed Pod: $POD"
      TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
      kubectl describe pod $POD -n $NAMESPACE > "artifacts/pod_description_${POD}_${TIMESTAMP}.txt" || echo "❌ Failed to get description for $POD"
      kubectl logs $POD -n $NAMESPACE --all-containers=true > "artifacts/pod_logs_${POD}_${TIMESTAMP}.txt" || echo "❌ Failed to get logs for $POD"
    done
  fi

  echo "🔎 Checking readiness of pod groups..."
  POD_GROUPS=$(echo "$NEEDED_PODS" | awk '{print $1}' | sed "s/-[a-z0-9]\{9,10\}-[a-z0-9]\{5\}$/-/" | sort | uniq)

  ALL_READY=true
  for GROUP in $POD_GROUPS; do
    MATCHING_PODS=$(echo "$NEEDED_PODS" | grep "$GROUP")
    READY_FOUND=false
    while read -r LINE; do
      READY=$(echo "$LINE" | awk '{split($2, r, "/"); if ($3 == "Running" && r[1] == r[2]) print "yes"}')
      if [ "$READY" == "yes" ]; then
        READY_FOUND=true
        break
      fi
    done <<< "$MATCHING_PODS"

    if [ "$READY_FOUND" = false ]; then
      echo "❌ No ready pod found for group '$GROUP'"
      ALL_READY=false
    else
      echo "✅ At least one pod is ready in group '$GROUP'"
    fi
  done

  if [ "$ALL_READY" = true ]; then
    echo "✅ All required pod groups have at least one running pod with all containers ready."
    break
  else
    echo "⏳ Waiting for all required pod groups to have at least one healthy pod..."
    sleep 5
  fi
done
