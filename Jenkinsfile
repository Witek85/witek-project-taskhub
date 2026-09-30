pipeline {
    agent any

    environment {
        POSTGRES_HOST = 'host.docker.internal'
        POSTGRES_PORT = '5433'
        POSTGRES_DB = 'taskhub'
        POSTGRES_CREDENTIALS = credentials('taskhub-postgres')
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Environment') {
            steps {
                sh '''
                    echo "=== Java ==="
                    java -version

                    echo "=== Git ==="
                    git --version

                    echo "=== Working directory ==="
                    pwd
                '''
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend - Build & Test') {
            steps {
                dir('backend') {
                    sh 'chmod +x mvnw'

                    withEnv([
                        "POSTGRES_USER=${POSTGRES_CREDENTIALS_USR}",
                        "POSTGRES_PASSWORD=${POSTGRES_CREDENTIALS_PSW}"
                    ]) {
                        sh './mvnw clean package'
                    }
                }
            }
        }

        stage('Frontend - Environment') {
            steps {
                sh '''
                    echo "=== Node ==="
                    node --version

                    echo "=== npm ==="
                    npm --version
                '''
            }
        }
    }

post {
    always {
        junit 'backend/target/surefire-reports/*.xml'
    }

    success {
        archiveArtifacts artifacts: 'backend/target/*.jar',
                         fingerprint: true

        echo 'Backend build successful.'
    }

    failure {
        echo 'Backend build failed.'
    }
}
}