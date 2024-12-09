kubectl delete secret generic mysql-secret
kubectl create secret generic mysql-secret --from-literal=user='root' --from-literal=password='password'


helm uninstall mysql-exporter prometheus-community/prometheus-mysql-exporter 

helm install mysql-exporter prometheus-community/prometheus-mysql-exporter \
  --set mysql.existingSecret=mysql-secret \
  --set serviceMonitor.enabled=true \
  --set mysql.host=mysql \
  --set mysql.port=3306 \
  --set mysql.user=root \
  --set mysql.password=password


