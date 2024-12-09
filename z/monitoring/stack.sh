#kubectl get secret --namespace default monitoring-grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
     
     
#export POD_NAME=$(kubectl get pods --namespace default -l "app.kubernetes.io/name=grafana,app.kubernetes.io/instance=monitoring" -o jsonpath="{.items[0].metadata.name}")
#     kubectl --namespace default port-forward $POD_NAME 3000

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install monitoring prometheus-community/kube-prometheus-stack

helm upgrade monitoring prometheus-community/kube-prometheus-stack -f stack.yaml
