pipeline {
    agent any

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
                    sh './mvnw clean package'
                }
            }
        }
    }

    post {
        success {
            echo 'Backend build successful.'
        }

        failure {
            echo 'Backend build failed.'
        }
    }
}