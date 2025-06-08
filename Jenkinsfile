pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'docker build -t your-image .'
            }
        }
        stage('Deploy') {
            steps {
                sshagent(['deploy-key']) {
                    withCredentials([usernamePassword(credentialsId: 'mongodb-creds', usernameVariable: 'DB_USER', passwordVariable: 'DB_PASS')]) {
                        sh """
                            ssh user@server <<EOF
                            export DB_USER=$DB_USER
                            export DB_PASS=$DB_PASS
                            echo "DB_USER=\$DB_USER" > .env
                            echo "DB_PASS=\$DB_PASS" >> .env
                            docker-compose up -d
                            EOF
                        """
                    }
                }
            }
        }
    }
}
