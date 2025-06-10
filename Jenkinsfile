pipeline {
    agent any

    environment {
        REMOTE_APP_DIR = "/home/todo-node-app"
    }

    stages {
        stage('Deploy') {
            steps {
                sshagent(['deploy-key']) {
                    withCredentials([usernamePassword(credentialsId: 'mongodb-creds', usernameVariable: 'DB_USER', passwordVariable: 'DB_PASS')]) {
                        sh """
                            ssh root@144.126.129.8 <<'EOF'
                            cd ${REMOTE_APP_DIR}
                            
                            # Preserve existing .env if available
                            if [ -f .env ]; then
                                echo "Using existing .env file"
                            else
                                # Create new .env file securely
                                cat <<EOT > .env
DB_USER=${DB_USER}
DB_PASS=${DB_PASS}
DB_NAME=mydb
DB_HOST=mongo
DB_PORT=27017
EOT
                            fi
                            
                            # Ensure proper file permissions
                            chmod 600 .env
                            
                            # Restart with Docker Compose
                            docker-compose down
                            docker-compose up -d --build
                            EOF
                        """
                    }
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                sleep 10  // Wait for app to start
                sh 'curl -sSf http://144.126.129.8:3000 > /dev/null'
            }
        }
    }
}
