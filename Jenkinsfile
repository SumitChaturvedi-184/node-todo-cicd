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
                            ssh root@144.126.129.8 <<EOF
                            cd ${REMOTE_APP_DIR}

                            # Create .env if missing
                            if [ ! -f .env ]; then
                              cat <<EOT > .env
DB_USER=${DB_USER}
DB_PASS=${DB_PASS}
DB_NAME=mydb
DB_HOST=mongo
DB_PORT=27017
EOT
                            fi

                            chmod 600 .env

                            # Pull latest code (optional if Jenkins already pulls)
                            git pull origin main

                            # Restart app container to reflect code changes
                            docker-compose restart app

                            # Clean unused images (optional)
                            docker image prune -f

                            EOF
                        """
                    }
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sleep 10  // Wait for app to restart
                sh 'curl -sSf http://144.126.129.8:3000 > /dev/null'
            }
        }
    }
}
